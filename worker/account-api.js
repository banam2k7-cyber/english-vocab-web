const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const SESSION_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 100000;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, "") || "/";

      if (request.method === "POST" && path === "/auth/register") {
        return await register(request, env);
      }

      if (request.method === "POST" && path === "/auth/login") {
        return await login(request, env);
      }

      if (request.method === "GET" && path === "/me") {
        const user = await requireUser(request, env);
        return jsonResponse({ user: publicUser(user) });
      }

      if (request.method === "GET" && path === "/data") {
        const user = await requireUser(request, env);
        return await getUserData(env, user.id);
      }

      if (request.method === "PUT" && path === "/data") {
        const user = await requireUser(request, env);
        const body = await readJson(request);
        return await saveUserData(env, user.id, body.data);
      }

      return jsonResponse({ error: { message: "Not found." } }, 404);
    } catch (error) {
      const status = error.status || 500;
      return jsonResponse({ error: { message: error.message || "Server error." } }, status);
    }
  },
};

async function register(request, env) {
  const { username, password } = await readCredentials(request);
  const existing = await getUserByUsername(env, username);
  if (existing) {
    throw httpError("Username already exists.", 409);
  }

  const passwordRecord = await hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    username,
  };

  await env.DB.prepare(
    `INSERT INTO users (id, username, password_salt, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(user.id, user.username, passwordRecord.salt, passwordRecord.hash, nowIso())
    .run();

  await env.DB.prepare(
    `INSERT INTO user_data (user_id, data_json, updated_at) VALUES (?, ?, ?)`
  )
    .bind(user.id, JSON.stringify({}), nowIso())
    .run();

  return createSessionResponse(env, user);
}

async function login(request, env) {
  const { username, password } = await readCredentials(request);
  const user = await getUserByUsername(env, username);
  if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
    throw httpError("Invalid username or password.", 401);
  }

  return createSessionResponse(env, user);
}

async function createSessionResponse(env, user) {
  const token = randomToken();
  const tokenHash = await sha256(token);
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;

  await env.DB.prepare(
    `INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`
  )
    .bind(tokenHash, user.id, expiresAt, nowIso())
    .run();

  const data = await readUserData(env, user.id);
  return jsonResponse({ token, user: publicUser(user), data });
}

async function requireUser(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    throw httpError("Not logged in.", 401);
  }

  const tokenHash = await sha256(match[1]);
  const now = Math.floor(Date.now() / 1000);
  const session = await env.DB.prepare(
    `SELECT users.id, users.username
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ? AND sessions.expires_at > ?`
  )
    .bind(tokenHash, now)
    .first();

  if (!session) {
    throw httpError("Session is invalid or expired.", 401);
  }

  return session;
}

async function getUserByUsername(env, username) {
  return env.DB.prepare(
    `SELECT id, username, password_salt, password_hash FROM users WHERE username = ?`
  )
    .bind(username)
    .first();
}

async function getUserData(env, userId) {
  return jsonResponse({ data: await readUserData(env, userId) });
}

async function readUserData(env, userId) {
  const row = await env.DB.prepare(`SELECT data_json FROM user_data WHERE user_id = ?`)
    .bind(userId)
    .first();
  return tryParseJson(row?.data_json) || {};
}

async function saveUserData(env, userId, data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw httpError("Data must be an object.", 400);
  }

  const json = JSON.stringify(data);
  if (json.length > 900000) {
    throw httpError("Data is too large. Reduce imported data.", 413);
  }

  await env.DB.prepare(
    `INSERT INTO user_data (user_id, data_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET data_json = excluded.data_json, updated_at = excluded.updated_at`
  )
    .bind(userId, json, nowIso())
    .run();

  return jsonResponse({ ok: true, data });
}

async function readCredentials(request) {
  const body = await readJson(request);
  const username = normalizeUsername(body.username);
  const password = String(body.password || "");

  if (!username) {
    throw httpError("Invalid username.", 400);
  }

  if (password.length < 6) {
    throw httpError("Password must be at least 6 characters.", 400);
  }

  return { username, password };
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw httpError("Invalid JSON body.", 400);
  }
}

async function hashPassword(password, salt = randomToken(16)) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: base64UrlToBytes(salt),
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256
  );
  return { salt, hash: bytesToBase64Url(new Uint8Array(bits)) };
}

async function verifyPassword(password, salt, expectedHash) {
  const actual = await hashPassword(password, salt);
  return actual.hash === expectedHash;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

function bytesToBase64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32);
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
  };
}

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
