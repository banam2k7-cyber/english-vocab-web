const DEFAULT_UNIT_COUNT = 42;
const PDF_DB_NAME = "b1TrainerPdfDb";
const PDF_DB_VERSION = 1;
const PDF_STORE_NAME = "files";
const PDF_RECORD_PREFIX = "book";
const DEFAULT_ACCOUNT_API_URL = "https://english-vocab-account-api.banam2k7.workers.dev";
const ACCOUNT_API_URL_KEY = "b1Trainer.account.apiUrl";
const SYNC_DEBOUNCE_MS = 700;

const AUTH_KEYS = {
  users: "b1Trainer.auth.users",
  currentUser: "b1Trainer.auth.currentUser",
  sessionToken: "b1Trainer.auth.sessionToken",
};

const STORAGE_KEYS = {
  imported: "b1Trainer.importedUnits",
  custom: "b1Trainer.customWords",
  mastered: "b1Trainer.masteredWords",
  progress: "b1Trainer.progress",
  selectedUnit: "b1Trainer.selectedUnit",
  theme: "b1Trainer.theme",
  ebookMode: "b1Trainer.ebookMode",
  aiApiKey: "b1Trainer.ai.apiKey",
  aiBaseUrl: "b1Trainer.ai.baseUrl",
  aiModel: "b1Trainer.ai.model",
  avatar: "b1Trainer.profile.avatar",
};

const DEFAULT_COMPATIBLE_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_COMPATIBLE_MODEL = "gpt-4.1-mini";
const MAX_AI_IMAGE_EDGE = 1100;

const AI_MODEL_PRESETS = {
  compatible: [
    { value: "gpt-4.1-mini", label: "GPT-4.1 mini - import ảnh cân bằng" },
    { value: "gpt-4.1", label: "GPT-4.1 - import ảnh tốt hơn" },
    { value: "gpt-4.1-nano", label: "GPT-4.1 nano - import ảnh nhanh/rẻ" },
    { value: "gpt-4o", label: "GPT-4o - import ảnh ổn định" },
    { value: "gpt-4o-mini", label: "GPT-4o mini - import ảnh nhanh/rẻ" },
    { value: "gpt-5.5", label: "GPT-5.5 - mới nhất, mạnh" },
    { value: "gpt-5.4", label: "GPT-5.4 - mạnh, rẻ hơn 5.5" },
    { value: "gpt-5.4-mini", label: "GPT-5.4 mini - nhanh/rẻ" },
    { value: "gpt-5.4-nano", label: "GPT-5.4 nano - nhanh/rẻ nhất" },
    { value: "gpt-5", label: "GPT-5 - mạnh" },
    { value: "gpt-5-mini", label: "GPT-5 mini - cân bằng" },
    { value: "gpt-5-nano", label: "GPT-5 nano - nhanh/rẻ" },
    { value: "o4-mini", label: "o4-mini - reasoning" },
    { value: "o3", label: "o3 - reasoning mạnh" },
    { value: "o3-pro", label: "o3-pro - reasoning mạnh hơn" },
    { value: "o3-mini", label: "o3-mini - reasoning nhanh/rẻ" },
    { value: "o1", label: "o1 - reasoning cũ" },
    { value: "o1-mini", label: "o1-mini - reasoning cũ nhanh/rẻ" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo - legacy vision" },
    { value: "gpt-4", label: "GPT-4 - legacy" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo - legacy text only" },
    { value: "gpt-image-2", label: "GPT Image 2 - tạo ảnh, không dùng import" },
    { value: "gpt-image-1", label: "GPT Image 1 - tạo ảnh, không dùng import" },
    { value: "gpt-realtime-2", label: "gpt-realtime-2 - realtime audio, không dùng import" },
    { value: "gpt-realtime-1.5", label: "gpt-realtime-1.5 - realtime audio, không dùng import" },
    { value: "gpt-realtime-translate", label: "gpt-realtime-translate - dịch giọng nói, không dùng import" },
    { value: "gpt-realtime-mini", label: "gpt-realtime-mini - realtime cũ, không dùng import" },
    { value: "gpt-realtime-whisper", label: "gpt-realtime-whisper - transcription, không dùng import" },
    { value: "gpt-4o-transcribe", label: "GPT-4o Transcribe - audio, không dùng import" },
    { value: "gpt-4o-mini-transcribe", label: "GPT-4o mini Transcribe - audio, không dùng import" },
    { value: "gpt-4o-mini-tts", label: "GPT-4o mini TTS - đọc chữ, không dùng import" },
    { value: "whisper-1", label: "Whisper 1 - audio, không dùng import" },
    { value: "tts-1", label: "TTS 1 - đọc chữ, không dùng import" },
    { value: "tts-1-hd", label: "TTS 1 HD - đọc chữ, không dùng import" },
    { value: "text-embedding-3-large", label: "Embedding 3 large - embedding, không dùng import" },
    { value: "text-embedding-3-small", label: "Embedding 3 small - embedding, không dùng import" },
    { value: "text-embedding-ada-002", label: "Embedding ada 002 - embedding cũ, không dùng import" },
    { value: "omni-moderation-latest", label: "Omni moderation latest - moderation, không dùng import" },
    { value: "omni-moderation-2024-09-26", label: "Omni moderation 2024-09-26 - moderation, không dùng import" },
    { value: "meta/llama-3.2-11b-vision-instruct", label: "Llama 3.2 11B Vision - nhanh, ít timeout" },
    { value: "meta/llama-3.2-90b-vision-instruct", label: "Llama 3.2 90B Vision - dịch tốt hơn, dễ timeout" },
    { value: "microsoft/phi-4-multimodal-instruct", label: "Phi-4 Multimodal - OCR/dịch" },
    { value: "microsoft/phi-3-vision-128k-instruct", label: "Phi-3 Vision 128K - OCR" },
  ],
};

const state = {
  currentUser: localStorage.getItem(AUTH_KEYS.currentUser) || "",
  sessionToken: localStorage.getItem(AUTH_KEYS.sessionToken) || "",
  unitId: "unit-01",
  testWords: [],
  currentIndex: 0,
  score: 0,
  results: [],
  answered: false,
  pdfUrl: "",
  aiImageDataUrl: "",
  aiImageName: "",
  syncTimer: 0,
  isApplyingRemoteData: false,
};

const VOCAB_CORRECTIONS = {
  beat: { vietnamese: "đánh bại", type: "verb" },
  "board game": { vietnamese: "trò chơi bàn cờ", type: "noun phrase" },
  captain: { vietnamese: "đội trưởng", type: "noun" },
  challenge: { vietnamese: "thử thách; thách đấu", type: "verb/noun" },
  champion: { vietnamese: "nhà vô địch", type: "noun" },
  cheat: { vietnamese: "gian lận", type: "verb" },
  "classical music": { vietnamese: "nhạc cổ điển", type: "noun phrase" },
  club: { vietnamese: "câu lạc bộ", type: "noun" },
  coach: { vietnamese: "huấn luyện viên", type: "noun" },
  competition: { vietnamese: "cuộc thi; cuộc tranh tài", type: "noun" },
  concert: { vietnamese: "buổi hòa nhạc", type: "noun" },
  defeat: { vietnamese: "đánh bại; thất bại", type: "verb/noun" },
  entertaining: { vietnamese: "thú vị; mang tính giải trí", type: "adjective" },
  "folk music": { vietnamese: "nhạc dân gian", type: "noun phrase" },
  group: { vietnamese: "nhóm; ban nhạc", type: "noun" },
  gym: { vietnamese: "phòng tập thể dục", type: "noun" },
  "have fun": { vietnamese: "vui chơi; có khoảng thời gian vui vẻ", type: "verb phrase" },
  interest: { vietnamese: "sự quan tâm; làm ai quan tâm", type: "verb/noun" },
  member: { vietnamese: "thành viên", type: "noun" },
  opponent: { vietnamese: "đối thủ", type: "noun" },
  organise: { vietnamese: "tổ chức", type: "verb" },
  pleasure: { vietnamese: "niềm vui; sự hài lòng", type: "noun" },
  referee: { vietnamese: "trọng tài", type: "noun" },
  rhythm: { vietnamese: "nhịp điệu", type: "noun" },
  risk: { vietnamese: "rủi ro; mạo hiểm", type: "verb/noun" },
  score: { vietnamese: "điểm số; ghi điểm", type: "verb/noun" },
  support: { vietnamese: "ủng hộ; sự ủng hộ", type: "verb/noun" },
  team: { vietnamese: "đội; nhóm", type: "noun" },
  train: { vietnamese: "tập luyện", type: "verb" },
  "video game": { vietnamese: "trò chơi điện tử", type: "noun phrase" },
};

const els = {
  pdfTab: document.querySelector("#pdfTab"),
  themeToggle: document.querySelector("#themeToggle"),
  ebookModeButton: document.querySelector("#ebookModeButton"),
  learnTab: document.querySelector("#learnTab"),
  testTab: document.querySelector("#testTab"),
  addTab: document.querySelector("#addTab"),
  importTab: document.querySelector("#importTab"),
  pdfPanel: document.querySelector("#pdfPanel"),
  learnPanel: document.querySelector("#learnPanel"),
  testPanel: document.querySelector("#testPanel"),
  addPanel: document.querySelector("#addPanel"),
  importPanel: document.querySelector("#importPanel"),
  pdfInput: document.querySelector("#pdfInput"),
  pdfFrame: document.querySelector("#pdfFrame"),
  pdfFileName: document.querySelector("#pdfFileName"),
  unitSelect: document.querySelector("#unitSelect"),
  unitList: document.querySelector("#unitList"),
  unitInput: document.querySelector("#unitInput"),
  importUnitInput: document.querySelector("#importUnitInput"),
  unitTitle: document.querySelector("#unitTitle"),
  unitDescription: document.querySelector("#unitDescription"),
  learnHeading: document.querySelector("#learnHeading"),
  wordCount: document.querySelector("#wordCount"),
  masteredCount: document.querySelector("#masteredCount"),
  scoreCount: document.querySelector("#scoreCount"),
  readyPercent: document.querySelector("#readyPercent"),
  showLearnButton: document.querySelector("#showLearnButton"),
  startTestButton: document.querySelector("#startTestButton"),
  startTestSideButton: document.querySelector("#startTestSideButton"),
  resetTestButton: document.querySelector("#resetTestButton"),
  onlyUnmasteredInput: document.querySelector("#onlyUnmasteredInput"),
  shuffleInput: document.querySelector("#shuffleInput"),
  searchInput: document.querySelector("#searchInput"),
  wordTable: document.querySelector("#wordTable"),
  questionCard: document.querySelector("#questionCard"),
  questionIndex: document.querySelector("#questionIndex"),
  questionScore: document.querySelector("#questionScore"),
  questionMeaning: document.querySelector("#questionMeaning"),
  questionMeta: document.querySelector("#questionMeta"),
  answerForm: document.querySelector("#answerForm"),
  answerInput: document.querySelector("#answerInput"),
  feedback: document.querySelector("#feedback"),
  skipButton: document.querySelector("#skipButton"),
  nextButton: document.querySelector("#nextButton"),
  resultPanel: document.querySelector("#resultPanel"),
  resultSummary: document.querySelector("#resultSummary"),
  resultList: document.querySelector("#resultList"),
  retryWrongButton: document.querySelector("#retryWrongButton"),
  wordForm: document.querySelector("#wordForm"),
  englishInput: document.querySelector("#englishInput"),
  vietnameseInput: document.querySelector("#vietnameseInput"),
  typeInput: document.querySelector("#typeInput"),
  exampleInput: document.querySelector("#exampleInput"),
  clearCustomButton: document.querySelector("#clearCustomButton"),
  importTextarea: document.querySelector("#importTextarea"),
  importButton: document.querySelector("#importButton"),
  exportDataButton: document.querySelector("#exportDataButton"),
  clearImportedButton: document.querySelector("#clearImportedButton"),
  importStatus: document.querySelector("#importStatus"),
  aiProviderInput: document.querySelector("#aiProviderInput"),
  aiApiKeyInput: document.querySelector("#aiApiKeyInput"),
  aiBaseUrlInput: document.querySelector("#aiBaseUrlInput"),
  aiModelSelect: document.querySelector("#aiModelSelect"),
  loadModelsButton: document.querySelector("#loadModelsButton"),
  aiProxyUrlInput: document.querySelector("#aiProxyUrlInput"),
  imageDropZone: document.querySelector("#imageDropZone"),
  imageFileInput: document.querySelector("#imageFileInput"),
  imagePreview: document.querySelector("#imagePreview"),
  aiImportButton: document.querySelector("#aiImportButton"),
  clearImageButton: document.querySelector("#clearImageButton"),
  aiImportStatus: document.querySelector("#aiImportStatus"),
  accountButton: document.querySelector("#accountButton"),
  accountAvatar: document.querySelector("#accountAvatar"),
  accountButtonText: document.querySelector("#accountButtonText"),
  accountMenu: document.querySelector("#accountMenu"),
  accountMenuAvatar: document.querySelector("#accountMenuAvatar"),
  accountSyncLabel: document.querySelector("#accountSyncLabel"),
  avatarInput: document.querySelector("#avatarInput"),
  removeAvatarButton: document.querySelector("#removeAvatarButton"),
  userNameLabel: document.querySelector("#userNameLabel"),
  logoutButton: document.querySelector("#logoutButton"),
  authOverlay: document.querySelector("#authOverlay"),
  authForm: document.querySelector("#authForm"),
  authUsernameInput: document.querySelector("#authUsernameInput"),
  authPasswordInput: document.querySelector("#authPasswordInput"),
  accountApiUrlInput: document.querySelector("#accountApiUrlInput"),
  registerButton: document.querySelector("#registerButton"),
  authCancelButton: document.querySelector("#authCancelButton"),
  authStatus: document.querySelector("#authStatus"),
};

function getActiveUserId() {
  return normalizeUsername(state.currentUser) || "guest";
}

function scopedKey(key) {
  return `${key}.${getActiveUserId()}`;
}

function scopedGetItem(key) {
  return localStorage.getItem(scopedKey(key));
}

function scopedSetItem(key, value) {
  localStorage.setItem(scopedKey(key), value);
}

function scopedRemoveItem(key) {
  localStorage.removeItem(scopedKey(key));
}

function getPdfRecordKey() {
  return `${PDF_RECORD_PREFIX}.${getActiveUserId()}`;
}

function loadGlobalJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveGlobalJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(scopedGetItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  scopedSetItem(key, JSON.stringify(value));
  queueRemoteSync();
}

function applyTheme(theme, options = {}) {
  document.body.dataset.theme = theme;
  scopedSetItem(STORAGE_KEYS.theme, theme);
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  els.themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  els.themeToggle.title = theme === "dark" ? "Chế độ sáng" : "Chế độ tối";
  if (options.sync !== false) {
    queueRemoteSync();
  }
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
}

function applyEbookMode(isEnabled, options = {}) {
  document.body.classList.toggle("ebook-mode", isEnabled);
  scopedSetItem(STORAGE_KEYS.ebookMode, isEnabled ? "1" : "0");
  localStorage.setItem(STORAGE_KEYS.ebookMode, isEnabled ? "1" : "0");
  els.ebookModeButton.textContent = isEnabled ? "Thoát ebook" : "Ebook mode";
  if (options.sync !== false) {
    queueRemoteSync();
  }
}

function toggleEbookMode() {
  applyEbookMode(!document.body.classList.contains("ebook-mode"));
}

function updateAiModelOptions(provider = els.aiProviderInput.value) {
  const presets = AI_MODEL_PRESETS[provider] || AI_MODEL_PRESETS.compatible;
  els.aiModelSelect.innerHTML = "";

  presets.forEach((preset) => {
    const option = new Option(preset.label, preset.value);
    els.aiModelSelect.append(option);
  });

  els.aiModelSelect.value = getDefaultAiModel(provider);
}

function getSelectedAiModel() {
  return els.aiModelSelect.value || getDefaultAiModel();
}

function getCompatibleBaseUrl() {
  return (els.aiBaseUrlInput.value.trim() || DEFAULT_COMPATIBLE_BASE_URL).replace(/\/+$/, "");
}

function makeCompatibleUrl(path) {
  return `${getCompatibleBaseUrl()}${path}`;
}

function isNvidiaCompatibleUrl() {
  return getCompatibleBaseUrl().includes("integrate.api.nvidia.com");
}

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeUsername(value) {
  return normalize(value).replace(/[^a-z0-9._-]/g, "").slice(0, 32);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createEmptyUnits() {
  return Array.from({ length: DEFAULT_UNIT_COUNT }, (_, index) => {
    const number = index + 1;
    return {
      id: `unit-${String(number).padStart(2, "0")}`,
      number,
      title: `Unit ${number}`,
      description:
        "Chưa có dữ liệu luyện tập cho unit này. Mở PDF gốc để học hoặc import dữ liệu bạn được phép sử dụng.",
      words: [],
    };
  });
}

function shapeWord(word, unitId) {
  if (Array.isArray(word)) {
    const [english, vietnamese, type, example] = word;
    return applyVocabCorrection(cleanImportedWord({ english, vietnamese, type, example, unitId }));
  }
  return applyVocabCorrection(cleanImportedWord({
    english: word.english || "",
    vietnamese: word.vietnamese || "",
    type: word.type || "word",
    example: word.example || "",
    phonetic: word.phonetic || word.phonetics || "",
    audio: word.audio || "",
    alternatives: Array.isArray(word.alternatives) ? word.alternatives : [],
    unitId: word.unitId || unitId,
  }));
}

function cleanImportedWord(word) {
  const english = String(word.english || "").trim();
  const posMatch = english.match(/^(.*?)\s*\(([^)]+)\)\s*$/);

  if (!posMatch) {
    return { ...word, english };
  }

  return {
    ...word,
    english: posMatch[1].trim(),
    type: mapPartOfSpeech(posMatch[2]) || word.type,
  };
}

function mapPartOfSpeech(value) {
  const normalized = normalize(value).replace(/\./g, "");
  const map = {
    v: "verb",
    n: "noun",
    adj: "adjective",
    adv: "adverb",
    phr: "phrase",
    "n phr": "noun phrase",
    "v phr": "verb phrase",
    "adj phr": "adjective phrase",
    "prep phr": "prepositional phrase",
  };
  return map[normalized] || "";
}

function applyVocabCorrection(word) {
  const correction = VOCAB_CORRECTIONS[normalize(word.english)];
  if (!correction) {
    return word;
  }

  return {
    ...word,
    vietnamese: correction.vietnamese,
    type: correction.type,
  };
}

function normalizeUnit(unit, index) {
  const number = Number(unit.number || index + 1);
  const id = unit.id || `unit-${String(number).padStart(2, "0")}`;
  return {
    id,
    number,
    title: unit.title || `Unit ${number}`,
    description: unit.description || "Dữ liệu import.",
    words: Array.isArray(unit.words) ? unit.words.map((word) => shapeWord(word, id)) : [],
  };
}

function getImportedUnits() {
  const imported = loadJson(STORAGE_KEYS.imported, []);
  const baseUnits = createEmptyUnits();

  if (!Array.isArray(imported) || !imported.length) {
    return baseUnits;
  }

  imported.map(normalizeUnit).forEach((importedUnit) => {
    const targetIndex = baseUnits.findIndex((unit) => unit.id === importedUnit.id);
    if (targetIndex >= 0) {
      baseUnits[targetIndex] = importedUnit;
    } else {
      baseUnits.push(importedUnit);
    }
  });

  return baseUnits.sort((a, b) => a.number - b.number);
}

function getCustomWords() {
  return loadJson(STORAGE_KEYS.custom, []);
}

function getMasteredMap() {
  return loadJson(STORAGE_KEYS.mastered, {});
}

function getUnits() {
  const units = getImportedUnits();

  getCustomWords().forEach((word) => {
    const unit = units.find((item) => item.id === word.unitId);
    if (unit) {
      unit.words.push(shapeWord(word, unit.id));
    }
  });

  return units;
}

function getCurrentUnit() {
  const units = getUnits();
  return units.find((unit) => unit.id === state.unitId) || units[0];
}

function makeWordId(word) {
  return `${word.unitId}:${normalize(word.english)}`;
}

function initUnitControls() {
  const units = getUnits();
  els.unitSelect.innerHTML = "";
  els.unitInput.innerHTML = "";
  els.importUnitInput.innerHTML = "";
  els.unitList.innerHTML = "";

  units.forEach((unit) => {
    const label = `Unit ${unit.number}: ${unit.title}`;
    const option = new Option(label, unit.id);
    els.unitSelect.append(option);
    els.unitInput.append(option.cloneNode(true));
    els.importUnitInput.append(option.cloneNode(true));

    const button = document.createElement("button");
    button.className = `unit-card ${unit.id === state.unitId ? "active" : ""}`;
    button.type = "button";
    button.dataset.unitId = unit.id;
    button.innerHTML = `
      <strong>Unit ${unit.number}</strong>
      <span>${escapeHtml(unit.title)}</span>
    `;
    els.unitList.append(button);
  });

  if (!units.some((unit) => unit.id === state.unitId)) {
    state.unitId = units[0].id;
  }

  els.unitSelect.value = state.unitId;
  els.unitInput.value = state.unitId;
  els.importUnitInput.value = state.unitId;
}

function setUnit(unitId) {
  state.unitId = unitId;
  state.testWords = [];
  state.results = [];
  scopedSetItem(STORAGE_KEYS.selectedUnit, unitId);
  localStorage.setItem(STORAGE_KEYS.selectedUnit, unitId);
  queueRemoteSync();
  initUnitControls();
  renderAll();
}

function switchPanel(panelName) {
  const map = {
    pdf: [els.pdfTab, els.pdfPanel],
    learn: [els.learnTab, els.learnPanel],
    test: [els.testTab, els.testPanel],
    add: [els.addTab, els.addPanel],
    import: [els.importTab, els.importPanel],
  };

  Object.values(map).forEach(([tab, panel]) => {
    tab.classList.remove("active");
    panel.classList.remove("active");
  });

  const [tab, panel] = map[panelName];
  tab.classList.add("active");
  panel.classList.add("active");
}

function renderAll() {
  renderUnitHeader();
  renderWordTable();
  updateStats();
}

function renderUnitHeader() {
  const unit = getCurrentUnit();
  els.unitTitle.textContent = `Unit ${unit.number}: ${unit.title}`;
  els.unitDescription.textContent = unit.description;
  els.learnHeading.textContent = `Từ vựng Unit ${unit.number}`;
}

function renderWordTable() {
  const unit = getCurrentUnit();
  const mastered = getMasteredMap();
  const query = normalize(els.searchInput.value);
  const words = unit.words.filter((word) => {
    const haystack = normalize(`${word.english} ${word.vietnamese} ${word.type} ${word.example}`);
    return !query || haystack.includes(query);
  });

  if (!words.length) {
    els.wordTable.innerHTML =
      '<div class="empty-state">Unit này chưa có dữ liệu từ vựng. Bạn có thể thêm từ thủ công hoặc import JSON trong tab Import.</div>';
    return;
  }

  els.wordTable.innerHTML = `
    <div class="word-row header">
      <span>#</span>
      <span>English</span>
      <span>Vietnamese</span>
      <span>Type</span>
      <span>Example</span>
      <span>Pronunciation</span>
      <span>Status</span>
    </div>
  `;

  words.forEach((word, index) => {
    const wordId = makeWordId(word);
    const row = document.createElement("div");
    row.className = "word-row";
    row.innerHTML = `
      <span class="index-pill">${index + 1}</span>
      <span class="word-main">${escapeHtml(word.english)}</span>
      <span class="meaning">${escapeHtml(word.vietnamese)}</span>
      <span class="type-tag">${escapeHtml(word.type || "word")}</span>
      <span class="example">${escapeHtml(word.example || "Tự đặt một câu với từ này.")}</span>
      <span class="pron-tools">
        ${word.phonetic ? `<span class="phonetic">${escapeHtml(word.phonetic)}</span>` : ""}
        <button class="mini-button" type="button" data-speak="${escapeHtml(word.english)}">Nghe</button>
        ${
          word.audio
            ? `<a class="mini-link" href="${escapeHtml(word.audio)}" target="_blank" rel="noreferrer">Audio</a>`
            : ""
        }
        <a class="mini-link" href="${escapeHtml(getOxfordUrl(word.english))}" target="_blank" rel="noreferrer">Oxford</a>
      </span>
      <label class="master-check">
        <input type="checkbox" data-mastered="${escapeHtml(wordId)}" ${mastered[wordId] ? "checked" : ""} />
        Đã thuộc
      </label>
    `;
    els.wordTable.append(row);
  });
}

function updateStats() {
  const unit = getCurrentUnit();
  const mastered = getMasteredMap();
  const masteredCount = unit.words.filter((word) => mastered[makeWordId(word)]).length;
  const progress = loadJson(STORAGE_KEYS.progress, {});
  const unitProgress = progress[state.unitId] || { score: 0, total: unit.words.length };
  const readyPercent = unit.words.length ? Math.round((masteredCount / unit.words.length) * 100) : 0;

  els.wordCount.textContent = unit.words.length;
  els.masteredCount.textContent = masteredCount;
  els.scoreCount.textContent = `${unitProgress.score}/${unitProgress.total || unit.words.length}`;
  els.readyPercent.textContent = `${readyPercent}%`;
}

function getTestWords() {
  const unit = getCurrentUnit();
  const mastered = getMasteredMap();
  let words = unit.words;

  if (els.onlyUnmasteredInput.checked) {
    words = words.filter((word) => !mastered[makeWordId(word)]);
  }

  if (!words.length && unit.words.length) {
    words = unit.words;
  }

  return els.shuffleInput.checked ? shuffle(words) : [...words];
}

function startTest(words = getTestWords()) {
  if (!words.length) {
    switchPanel("learn");
    els.wordTable.innerHTML =
      '<div class="empty-state">Unit này chưa có dữ liệu để test. Hãy thêm từ thủ công hoặc import JSON trước.</div>';
    return;
  }

  state.testWords = words;
  state.currentIndex = 0;
  state.score = 0;
  state.results = [];
  state.answered = false;

  els.resultPanel.classList.add("hidden");
  els.questionCard.classList.remove("hidden");
  switchPanel("test");
  renderQuestion();
}

function shuffle(words) {
  const copy = [...words];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function renderQuestion() {
  const word = state.testWords[state.currentIndex];
  const total = state.testWords.length;

  if (!word) {
    finishTest();
    return;
  }

  els.questionIndex.textContent = `Câu ${state.currentIndex + 1}/${total}`;
  els.questionScore.textContent = `${state.score} đúng`;
  els.questionMeaning.textContent = word.vietnamese;
  els.questionMeta.textContent = `${word.type || "word"} - ${word.example || "Không có ví dụ"}`;
  els.answerInput.value = "";
  els.answerInput.disabled = false;
  els.skipButton.disabled = false;
  els.nextButton.classList.add("hidden");
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  state.answered = false;
  els.answerInput.focus();
}

function submitAnswer(event) {
  event.preventDefault();
  if (state.answered) {
    return;
  }

  const word = state.testWords[state.currentIndex];
  const userAnswer = normalize(els.answerInput.value);
  const answers = [word.english, ...(word.alternatives || [])].map(normalize);
  const isCorrect = answers.includes(userAnswer);

  state.answered = true;
  els.answerInput.disabled = true;
  els.skipButton.disabled = true;
  els.nextButton.classList.remove("hidden");

  if (isCorrect) {
    state.score += 1;
    els.feedback.textContent = `Đúng: ${word.english}`;
    els.feedback.classList.add("correct");
  } else {
    els.feedback.textContent = `Sai. Đáp án đúng là: ${word.english}`;
    els.feedback.classList.add("wrong");
  }

  state.results.push({
    word,
    userAnswer: els.answerInput.value.trim() || "(bỏ trống)",
    isCorrect,
  });
  els.questionScore.textContent = `${state.score} đúng`;
}

function skipQuestion() {
  if (state.answered) {
    return;
  }

  const word = state.testWords[state.currentIndex];
  state.answered = true;
  state.results.push({ word, userAnswer: "(bỏ qua)", isCorrect: false });
  els.answerInput.disabled = true;
  els.skipButton.disabled = true;
  els.feedback.textContent = `Đáp án đúng là: ${word.english}`;
  els.feedback.className = "feedback wrong";
  els.nextButton.classList.remove("hidden");
}

function nextQuestion() {
  if (!state.answered) {
    skipQuestion();
    return;
  }
  state.currentIndex += 1;
  renderQuestion();
}

function finishTest() {
  const total = state.results.length;
  const wrong = state.results.filter((result) => !result.isCorrect);
  const progress = loadJson(STORAGE_KEYS.progress, {});
  progress[state.unitId] = {
    score: state.score,
    total,
    updatedAt: new Date().toISOString(),
  };
  saveJson(STORAGE_KEYS.progress, progress);

  els.questionCard.classList.add("hidden");
  els.resultPanel.classList.remove("hidden");
  els.resultSummary.textContent = `Bạn đúng ${state.score}/${total} câu trong ${getCurrentUnit().title}. ${
    wrong.length ? "Các câu sai đã được liệt kê bên dưới." : "Không có câu sai."
  }`;
  els.resultList.innerHTML = "";

  state.results.forEach((result) => {
    const item = document.createElement("div");
    item.className = `result-item ${result.isCorrect ? "correct" : "wrong"}`;
    item.innerHTML = `
      <strong>${result.isCorrect ? "Đúng" : "Sai"}</strong>
      <span>${escapeHtml(result.word.vietnamese)} -> ${escapeHtml(result.word.english)}
      <br />Bạn nhập: ${escapeHtml(result.userAnswer)}</span>
    `;
    els.resultList.append(item);
  });

  els.retryWrongButton.disabled = wrong.length === 0;
  updateStats();
}

function addCustomWord(event) {
  event.preventDefault();

  const word = {
    unitId: els.unitInput.value,
    english: els.englishInput.value.trim(),
    vietnamese: els.vietnameseInput.value.trim(),
    type: els.typeInput.value.trim() || "custom",
    example: els.exampleInput.value.trim(),
  };

  if (!word.english || !word.vietnamese) {
    return;
  }

  const customWords = getCustomWords();
  customWords.push(word);
  saveJson(STORAGE_KEYS.custom, customWords);
  els.wordForm.reset();
  els.unitInput.value = state.unitId;
  initUnitControls();
  renderAll();
  switchPanel("learn");
}

function clearCustomWords() {
  if (!window.confirm("Xóa toàn bộ từ bạn đã tự thêm?")) {
    return;
  }
  scopedRemoveItem(STORAGE_KEYS.custom);
  queueRemoteSync();
  initUnitControls();
  renderAll();
}

function handlePdfFile(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  savePdfFile(file)
    .then(() => showPdfFile({ name: file.name, blob: file }))
    .catch((error) => {
      els.pdfFileName.textContent = `Không lưu được PDF: ${error.message}`;
    });
}

function openPdfDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PDF_DB_NAME, PDF_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PDF_STORE_NAME)) {
        db.createObjectStore(PDF_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePdfFile(file) {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PDF_STORE_NAME, "readwrite");
    const store = transaction.objectStore(PDF_STORE_NAME);
    store.put({
      id: getPdfRecordKey(),
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      savedAt: new Date().toISOString(),
      blob: file,
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function loadSavedPdfFile() {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PDF_STORE_NAME, "readonly");
    const store = transaction.objectStore(PDF_STORE_NAME);
    const request = store.get(getPdfRecordKey());
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function showPdfFile(record) {
  if (state.pdfUrl) {
    URL.revokeObjectURL(state.pdfUrl);
  }
  state.pdfUrl = URL.createObjectURL(record.blob);
  els.pdfFrame.src = state.pdfUrl;
  els.pdfFileName.textContent = `Đang mở: ${record.name}. File này đã được lưu trong trình duyệt.`;
}

function importUnits() {
  try {
    const parsed = JSON.parse(els.importTextarea.value);
    const importedUnit = importParsedData(parsed, els.importUnitInput.value || state.unitId);
    els.importStatus.textContent = `Đã import ${importedUnit.words.length} mục vào Unit ${importedUnit.number}. Chọn unit khác ở ô "Import vào unit" để nhập bài tiếp theo.`;
    els.importStatus.className = "feedback correct";
    switchPanel("import");
  } catch (error) {
    els.importStatus.textContent = `Import lỗi: ${error.message}`;
    els.importStatus.className = "feedback wrong";
  }
}

function importParsedData(parsed, targetUnitId) {
  const units = getImportedUnits();
  const targetIndex = units.findIndex((unit) => unit.id === targetUnitId);

  if (targetIndex < 0) {
    throw new Error("Không tìm thấy unit cần import.");
  }

  const importedUnit = buildUnitForImport(parsed, units[targetIndex]);
  units[targetIndex] = importedUnit;
  saveJson(STORAGE_KEYS.imported, units);
  state.unitId = importedUnit.id;
  scopedSetItem(STORAGE_KEYS.selectedUnit, state.unitId);
  localStorage.setItem(STORAGE_KEYS.selectedUnit, state.unitId);
  queueRemoteSync();
  initUnitControls();
  renderAll();
  return importedUnit;
}

function buildUnitForImport(parsed, targetUnit) {
  const firstItem = Array.isArray(parsed) ? parsed[0] : parsed;
  const sourceUnit =
    firstItem && typeof firstItem === "object" && Array.isArray(firstItem.words)
      ? firstItem
      : null;
  const sourceWords = sourceUnit ? sourceUnit.words : parsed;

  if (!Array.isArray(sourceWords)) {
    throw new Error("JSON phải là một unit có `words`, hoặc là một mảng từ.");
  }

  const importedWords = sourceWords
    .map((word) => shapeWord(word, targetUnit.id))
    .map(removeInvalidExample)
    .filter((word) => word.english && word.vietnamese);

  if (!importedWords.length) {
    throw new Error("Không có từ hợp lệ. Mỗi từ cần có `english` và `vietnamese`.");
  }

  return {
    ...targetUnit,
    title: sourceUnit?.title || targetUnit.title,
    description: sourceUnit?.description || targetUnit.description,
    words: importedWords,
  };
}

function removeInvalidExample(word) {
  if (!word.example || !word.english) {
    return word;
  }

  const example = normalizeForExampleCheck(word.example);
  const target = normalizeForExampleCheck(word.english);

  if (target && example.includes(target)) {
    return { ...word, example: "" };
  }

  return word;
}

function normalizeForExampleCheck(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function exportCurrentData() {
  const data = getUnits().map((unit) => ({
    number: unit.number,
    title: unit.title,
    description: unit.description,
    words: unit.words.map(({ english, vietnamese, type, example, phonetic, audio, alternatives }) => ({
      english,
      vietnamese,
      type,
      example,
      phonetic,
      audio,
      alternatives,
    })),
  }));
  els.importTextarea.value = JSON.stringify(data, null, 2);
  els.importStatus.textContent = "Đã đưa dữ liệu hiện tại vào ô import.";
  els.importStatus.className = "feedback correct";
}

function getOxfordUrl(term) {
  return `https://www.oxfordlearnersdictionaries.com/search/english/?q=${encodeURIComponent(term)}`;
}

function loadSpeechVoices() {
  if (!("speechSynthesis" in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

function pickEnglishVoice() {
  const voices = loadSpeechVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "en-gb") ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en-gb")) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    window.open(getOxfordUrl(text), "_blank", "noreferrer");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.voice = pickEnglishVoice();
  utterance.rate = 0.9;
  window.setTimeout(() => window.speechSynthesis.speak(utterance), 80);
}

function setAiImage(dataUrl, name) {
  state.aiImageDataUrl = dataUrl;
  state.aiImageName = name || "pasted-image";
  els.imagePreview.src = dataUrl;
  els.imagePreview.classList.remove("hidden");
  els.aiImportStatus.textContent = `Đã nhận ảnh: ${state.aiImageName}`;
  els.aiImportStatus.className = "feedback correct";
}

function clearAiImage() {
  state.aiImageDataUrl = "";
  state.aiImageName = "";
  els.imagePreview.removeAttribute("src");
  els.imagePreview.classList.add("hidden");
  els.imageFileInput.value = "";
  els.aiImportStatus.textContent = "";
  els.aiImportStatus.className = "feedback";
}

function readImageFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    els.aiImportStatus.textContent = "File được chọn không phải ảnh.";
    els.aiImportStatus.className = "feedback wrong";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    resizeImageDataUrl(reader.result)
      .then((dataUrl) => setAiImage(dataUrl, file.name))
      .catch(() => setAiImage(reader.result, file.name));
  };
  reader.onerror = () => {
    els.aiImportStatus.textContent = "Không đọc được ảnh.";
    els.aiImportStatus.className = "feedback wrong";
  };
  reader.readAsDataURL(file);
}

function readAvatarFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    els.accountSyncLabel.textContent = "File không phải ảnh.";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    resizeAvatarDataUrl(reader.result)
      .then((dataUrl) => {
        scopedSetItem(STORAGE_KEYS.avatar, dataUrl);
        renderAuthState();
        queueRemoteSync();
        els.accountMenu.classList.remove("hidden");
        els.accountButton.setAttribute("aria-expanded", "true");
        els.accountSyncLabel.textContent = "Đã đổi ảnh đại diện";
      })
      .catch(() => {
        els.accountSyncLabel.textContent = "Không đọc được ảnh.";
      });
  };
  reader.onerror = () => {
    els.accountSyncLabel.textContent = "Không đọc được ảnh.";
  };
  reader.readAsDataURL(file);
}

function resizeAvatarDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const size = 320;
      const edge = Math.min(image.width, image.height);
      const sourceX = Math.round((image.width - edge) / 2);
      const sourceY = Math.round((image.height - edge) / 2);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      context.drawImage(image, sourceX, sourceY, edge, edge, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };
    image.onerror = reject;
    image.src = dataUrl;
  });
}

function removeAvatar() {
  scopedRemoveItem(STORAGE_KEYS.avatar);
  renderAuthState();
  queueRemoteSync();
  els.accountMenu.classList.remove("hidden");
  els.accountButton.setAttribute("aria-expanded", "true");
  els.accountSyncLabel.textContent = "Đã xóa ảnh đại diện";
}

function resizeImageDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxEdge = Math.max(image.width, image.height);
      if (maxEdge <= MAX_AI_IMAGE_EDGE) {
        resolve(dataUrl);
        return;
      }

      const scale = MAX_AI_IMAGE_EDGE / maxEdge;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    image.onerror = reject;
    image.src = dataUrl;
  });
}

function handleImagePaste(event) {
  const item = [...(event.clipboardData?.items || [])].find((clipboardItem) =>
    clipboardItem.type.startsWith("image/")
  );
  if (!item) {
    return;
  }
  event.preventDefault();
  readImageFile(item.getAsFile());
}

async function aiImportImage() {
  const apiKey = els.aiApiKeyInput.value.trim();
  const model = getSelectedAiModel();
  saveAiSettings();

  if (!apiKey) {
    els.aiImportStatus.textContent = "Bạn cần nhập API key.";
    els.aiImportStatus.className = "feedback wrong";
    return;
  }

  if (!state.aiImageDataUrl) {
    els.aiImportStatus.textContent = "Bạn cần dán hoặc chọn ảnh trước.";
    els.aiImportStatus.className = "feedback wrong";
    return;
  }

  els.aiImportButton.disabled = true;
  els.aiImportStatus.textContent = "AI đang đọc ảnh và tạo dữ liệu import...";
  els.aiImportStatus.className = "feedback";

  try {
    const responseText = await callOpenAiCompatibleVisionImport({
      apiKey,
      model,
      imageDataUrl: state.aiImageDataUrl,
      proxyUrl: els.aiProxyUrlInput.value.trim(),
    });
    const aiUnit = parseAiJsonResponse(responseText);
    const importedUnit = importParsedData(aiUnit, els.importUnitInput.value || state.unitId);
    els.importTextarea.value = JSON.stringify(aiUnit, null, 2);
    els.aiImportStatus.textContent = `Đã AI import ${importedUnit.words.length} mục vào Unit ${importedUnit.number}.`;
    els.aiImportStatus.className = "feedback correct";
    switchPanel("import");
  } catch (error) {
    els.aiImportStatus.textContent = `AI import lỗi: ${error.message}`;
    els.aiImportStatus.className = "feedback wrong";
  } finally {
    els.aiImportButton.disabled = false;
  }
}

function getDefaultAiModel(provider) {
  return DEFAULT_COMPATIBLE_MODEL;
}

async function loadAiModelsFromEndpoint() {
  const apiKey = els.aiApiKeyInput.value.trim();
  if (!apiKey) {
    els.aiImportStatus.textContent = "Nhập API key trước, rồi bấm Tải models.";
    els.aiImportStatus.className = "feedback wrong";
    return;
  }

  els.loadModelsButton.disabled = true;
  els.aiImportStatus.textContent = `Đang gọi ${makeCompatibleUrl("/models")}...`;
  els.aiImportStatus.className = "feedback";

  try {
    const data = await callCompatibleModelsEndpoint({
      apiKey,
      endpoint: makeCompatibleUrl("/models"),
      proxyUrl: els.aiProxyUrlInput.value.trim(),
    });
    const modelIds = extractModelIds(data);
    if (!modelIds.length) {
      throw new Error("Phản hồi /models không có danh sách model.");
    }
    setLoadedModelOptions(modelIds);
    saveAiSettings();
    els.aiImportStatus.textContent = `Đã tải ${modelIds.length} model từ /models.`;
    els.aiImportStatus.className = "feedback correct";
  } catch (error) {
    updateAiModelOptions();
    els.aiImportStatus.textContent = `Không tải được /models: ${error.message}. Đang dùng danh sách preset.`;
    els.aiImportStatus.className = "feedback wrong";
  } finally {
    els.loadModelsButton.disabled = false;
  }
}

async function callCompatibleModelsEndpoint({ apiKey, endpoint, proxyUrl }) {
  const response = await fetchCompatibleApi({
    apiKey,
    endpoint,
    method: "GET",
    proxyUrl,
  });
  const data = await readApiJson(response, "OpenAI-compatible /models");
  if (!response.ok) {
    throw new Error(formatApiError(data, "OpenAI-compatible /models", response.status));
  }
  return data;
}

function extractModelIds(data) {
  const source = Array.isArray(data?.data) ? data.data : Array.isArray(data?.models) ? data.models : [];
  return [...new Set(
    source
      .map((model) => (typeof model === "string" ? model : model.id || model.name))
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));
}

function setLoadedModelOptions(modelIds) {
  els.aiModelSelect.innerHTML = "";
  modelIds.forEach((modelId) => {
    els.aiModelSelect.append(new Option(modelId, modelId));
  });

  const defaultModel = modelIds.find((modelId) => modelId === DEFAULT_COMPATIBLE_MODEL);
  const visionModel =
    defaultModel ||
    modelIds.find((modelId) => /gpt-4\.1-mini|gpt-4o-mini|vision|multimodal/i.test(modelId)) ||
    modelIds[0];
  els.aiModelSelect.value = visionModel;
}

function getAiPrompt() {
  return [
    "You are a strict JSON extraction engine. Do not explain, do not add markdown, do not add comments.",
    "Read the vocabulary image.",
    "Extract only vocabulary items, phrasal verbs, prepositional phrases, word formation items, definitions if visible, part of speech, and phonetic transcription if visible.",
    "If the image shows part of speech in parentheses such as (v), (n), (adj), or (n phr), obey it exactly and translate by that part of speech.",
    "Do not guess a noun meaning when the image marks the item as a verb. For example, train (v) means practice/train, not railway train.",
    "Use the book topic context. In an Entertainment and Sport unit, champion (n) means winner/title holder, not the unchanged English word.",
    "Do not copy the English word as the Vietnamese meaning. Translate every meaning into Vietnamese.",
    "Translate meanings into Vietnamese.",
    "The first character of your response must be { and the last character must be }.",
    "Return only valid JSON with this exact shape:",
    '{"title":"string","description":"string","words":[{"english":"string","vietnamese":"string","type":"string","phonetic":"string","example":"string"}]}',
    "For every item, create one short natural English example sentence.",
    "The example sentence must NOT contain the target english word or phrase, and must NOT contain an obvious inflected form of it.",
    "Use concise Vietnamese meanings. Leave phonetic as an empty string if not visible, but do not leave example empty.",
  ].join(" ");
}

async function callOpenAiCompatibleVisionImport({ apiKey, model, imageDataUrl, proxyUrl }) {
  const endpoint = makeCompatibleUrl("/chat/completions");
  const payload = buildCompatibleChatPayload(model, imageDataUrl);
  const response = await fetchCompatibleApi({
    apiKey,
    endpoint,
    method: "POST",
    payload,
    proxyUrl,
  });
  const data = await readApiJson(response, "OpenAI-compatible");
  if (!response.ok) {
    throw new Error(formatApiError(data, "OpenAI-compatible", response.status));
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Không đọc được nội dung từ phản hồi AI compatible.");
  }

  return stripJsonFence(typeof content === "string" ? content : JSON.stringify(content));
}

function buildCompatibleChatPayload(model, imageDataUrl) {
  const nvidiaMode = isNvidiaCompatibleUrl();
  const payload = {
    model,
    temperature: 0,
    max_tokens: 1200,
    messages: [
      {
        role: "system",
        content:
          "You output only valid JSON. Never describe the image in prose. Never wrap JSON in markdown.",
      },
      {
        role: "user",
        content: nvidiaMode
          ? `${getAiPrompt()}\n<img src="${imageDataUrl}" />`
          : [
              { type: "text", text: getAiPrompt() },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                },
              },
            ],
      },
    ],
  };

  if (!nvidiaMode) {
    payload.response_format = { type: "json_object" };
  }

  return payload;
}

async function fetchCompatibleApi({ apiKey, endpoint, method, payload, proxyUrl }) {
  const headers = { "Content-Type": "application/json" };
  const normalizedMethod = method || "POST";

  try {
    if (proxyUrl) {
      return await fetch(proxyUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ apiKey, endpoint, method: normalizedMethod, payload }),
      });
    }

    headers.Authorization = `Bearer ${apiKey}`;
    return await fetch(endpoint, {
      method: normalizedMethod,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });
  } catch (error) {
    throw new Error(`Không gọi được OpenAI-compatible API: ${error.message}`);
  }
}

async function readApiJson(response, providerName) {
  const text = await response.text();
  const data = tryParseJson(text);
  if (data) {
    return data;
  }

  const preview = stripHtml(text).slice(0, 160).replace(/\s+/g, " ").trim();
  if (response.status === 524 || preview.toLowerCase().includes("error code: 524")) {
    throw new Error(
      `${providerName} bị timeout qua proxy Cloudflare (524). Hãy thử lại, giảm ảnh, hoặc đổi sang model nhanh hơn.`
    );
  }

  throw new Error(
    `${providerName} trả phản hồi không phải JSON (${response.status}). Phản hồi bắt đầu bằng: ${preview || "trống"}`
  );
}

function formatApiError(data, providerName, status) {
  const error = data?.error || data;
  const parts = [
    error?.message,
    error?.detail,
    error?.code ? `code: ${error.code}` : "",
    error?.type ? `type: ${error.type}` : "",
  ].filter(Boolean);

  if (parts.length) {
    return `${providerName} API lỗi ${status}: ${parts.join(" - ")}`;
  }

  return `${providerName} API lỗi ${status}: ${JSON.stringify(data).slice(0, 180)}`;
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
}

function getUnitImportJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["title", "description", "words"],
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      words: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["english", "vietnamese", "type", "phonetic", "example"],
          properties: {
            english: { type: "string" },
            vietnamese: { type: "string" },
            type: { type: "string" },
            phonetic: { type: "string" },
            example: { type: "string" },
          },
        },
      },
    },
  };
}

function extractOpenAiResponseText(data) {
  if (data.output_text) {
    return data.output_text;
  }

  for (const outputItem of data.output || []) {
    for (const contentItem of outputItem.content || []) {
      if (contentItem.type === "output_text" && contentItem.text) {
        return contentItem.text;
      }
    }
  }

  throw new Error("Không đọc được JSON từ phản hồi AI.");
}

function stripJsonFence(value) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseAiJsonResponse(value) {
  const cleaned = stripJsonFence(String(value || ""));
  const direct = tryParseJson(cleaned);
  if (direct) {
    return direct;
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const extracted = cleaned.slice(firstBrace, lastBrace + 1);
    const parsed = tryParseJson(extracted);
    if (parsed) {
      return parsed;
    }
  }

  const preview = cleaned.slice(0, 160).replace(/\s+/g, " ");
  throw new Error(
    `AI chưa trả JSON hợp lệ. Hãy bấm lại hoặc đổi model. Phản hồi bắt đầu bằng: ${preview}`
  );
}

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getAccountApiUrl() {
  const value =
    els.accountApiUrlInput?.value.trim() ||
    localStorage.getItem(ACCOUNT_API_URL_KEY) ||
    DEFAULT_ACCOUNT_API_URL;
  return value.replace(/\/+$/, "");
}

function initializeAccountApiInput() {
  if (!els.accountApiUrlInput) {
    return;
  }
  els.accountApiUrlInput.value = localStorage.getItem(ACCOUNT_API_URL_KEY) || DEFAULT_ACCOUNT_API_URL;
}

function setAuthStatus(message, statusClass = "") {
  els.authStatus.textContent = message;
  els.authStatus.className = `feedback ${statusClass}`.trim();
}

function getAvatarDataUrl() {
  return scopedGetItem(STORAGE_KEYS.avatar) || "";
}

function getAccountInitial() {
  const source = state.currentUser || "B1";
  return source.slice(0, state.currentUser ? 1 : 2).toUpperCase();
}

function renderAvatar(target, avatarDataUrl) {
  if (!target) {
    return;
  }
  target.innerHTML = avatarDataUrl
    ? `<img src="${escapeHtml(avatarDataUrl)}" alt="" />`
    : escapeHtml(getAccountInitial());
}

function renderAuthState() {
  const isLoggedIn = Boolean(state.sessionToken && state.currentUser);
  const avatarDataUrl = isLoggedIn ? getAvatarDataUrl() : "";

  els.authOverlay.classList.add("hidden");
  els.accountMenu.classList.add("hidden");
  els.accountButton.setAttribute("aria-expanded", "false");
  els.accountButton.classList.toggle("logged-in", isLoggedIn);
  els.accountButton.setAttribute(
    "aria-label",
    isLoggedIn ? `Tài khoản ${state.currentUser}` : "Đăng nhập hoặc đăng kí"
  );
  els.accountButton.title = isLoggedIn ? state.currentUser : "Đăng nhập / Đăng kí";
  els.logoutButton.classList.toggle("hidden", !isLoggedIn);
  els.removeAvatarButton.classList.toggle("hidden", !isLoggedIn || !avatarDataUrl);
  els.accountButtonText.textContent = isLoggedIn ? state.currentUser : "Đăng nhập / Đăng kí";
  els.userNameLabel.textContent = isLoggedIn ? state.currentUser : "Chưa đăng nhập";
  els.accountSyncLabel.textContent = isLoggedIn ? "Sẵn sàng đồng bộ" : "Đăng nhập để đồng bộ";
  renderAvatar(els.accountAvatar, avatarDataUrl);
  renderAvatar(els.accountMenuAvatar, avatarDataUrl);
}

function openAuthDialog() {
  els.accountMenu.classList.add("hidden");
  els.accountButton.setAttribute("aria-expanded", "false");
  els.authOverlay.classList.remove("hidden");
  window.setTimeout(() => els.authUsernameInput.focus(), 0);
}

function closeAuthDialog() {
  els.authOverlay.classList.add("hidden");
  setAuthStatus("");
}

function toggleAccountMenu() {
  if (!state.sessionToken || !state.currentUser) {
    openAuthDialog();
    return;
  }

  const isOpen = !els.accountMenu.classList.contains("hidden");
  els.accountMenu.classList.toggle("hidden", isOpen);
  els.accountButton.setAttribute("aria-expanded", String(!isOpen));
}

async function accountFetch(path, options = {}) {
  const apiUrl = getAccountApiUrl();
  if (!apiUrl) {
    throw new Error("ChÆ°a cáº¥u hÃ¬nh Account API URL.");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (state.sessionToken) {
    headers.Authorization = `Bearer ${state.sessionToken}`;
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || `Account API lá»—i ${response.status}.`);
  }

  return data;
}

function getUserDataSnapshot() {
  return {
    imported: loadJson(STORAGE_KEYS.imported, []),
    custom: loadJson(STORAGE_KEYS.custom, []),
    mastered: loadJson(STORAGE_KEYS.mastered, {}),
    progress: loadJson(STORAGE_KEYS.progress, {}),
    selectedUnit: scopedGetItem(STORAGE_KEYS.selectedUnit) || state.unitId,
    theme: scopedGetItem(STORAGE_KEYS.theme) || localStorage.getItem(STORAGE_KEYS.theme) || "light",
    ebookMode:
      scopedGetItem(STORAGE_KEYS.ebookMode) ||
      localStorage.getItem(STORAGE_KEYS.ebookMode) ||
      "0",
    aiApiKey: scopedGetItem(STORAGE_KEYS.aiApiKey) || "",
    aiBaseUrl: scopedGetItem(STORAGE_KEYS.aiBaseUrl) || DEFAULT_COMPATIBLE_BASE_URL,
    aiModel: scopedGetItem(STORAGE_KEYS.aiModel) || getSelectedAiModel(),
    avatar: scopedGetItem(STORAGE_KEYS.avatar) || "",
    updatedAt: new Date().toISOString(),
  };
}

function hasRemoteData(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  return Boolean(
    data.aiApiKey ||
      data.aiBaseUrl ||
      data.avatar ||
      (Array.isArray(data.imported) && data.imported.length) ||
      (Array.isArray(data.custom) && data.custom.length) ||
      (data.mastered && Object.keys(data.mastered).length) ||
      (data.progress && Object.keys(data.progress).length)
  );
}

function applyUserDataSnapshot(data) {
  const snapshot = data || {};
  state.isApplyingRemoteData = true;
  try {
    scopedSetItem(STORAGE_KEYS.imported, JSON.stringify(snapshot.imported || []));
    scopedSetItem(STORAGE_KEYS.custom, JSON.stringify(snapshot.custom || []));
    scopedSetItem(STORAGE_KEYS.mastered, JSON.stringify(snapshot.mastered || {}));
    scopedSetItem(STORAGE_KEYS.progress, JSON.stringify(snapshot.progress || {}));
    scopedSetItem(STORAGE_KEYS.selectedUnit, snapshot.selectedUnit || "unit-01");
    scopedSetItem(STORAGE_KEYS.theme, snapshot.theme || "light");
    scopedSetItem(STORAGE_KEYS.ebookMode, snapshot.ebookMode === "1" ? "1" : "0");
    scopedSetItem(STORAGE_KEYS.aiApiKey, snapshot.aiApiKey || "");
    scopedSetItem(STORAGE_KEYS.aiBaseUrl, snapshot.aiBaseUrl || DEFAULT_COMPATIBLE_BASE_URL);
    scopedSetItem(STORAGE_KEYS.aiModel, snapshot.aiModel || DEFAULT_COMPATIBLE_MODEL);
    scopedSetItem(STORAGE_KEYS.avatar, snapshot.avatar || "");

    state.unitId = snapshot.selectedUnit || "unit-01";
    localStorage.setItem(STORAGE_KEYS.selectedUnit, state.unitId);
    applyTheme(snapshot.theme || "light", { sync: false });
    applyEbookMode(snapshot.ebookMode === "1", { sync: false });
    applyAiSettingsFromStorage();
    renderAuthState();
  } finally {
    state.isApplyingRemoteData = false;
  }
}

function applyAiSettingsFromStorage() {
  els.aiApiKeyInput.value = scopedGetItem(STORAGE_KEYS.aiApiKey) || "";
  els.aiBaseUrlInput.value = scopedGetItem(STORAGE_KEYS.aiBaseUrl) || DEFAULT_COMPATIBLE_BASE_URL;
  updateAiModelOptions();
  const savedModel = scopedGetItem(STORAGE_KEYS.aiModel) || DEFAULT_COMPATIBLE_MODEL;
  if (![...els.aiModelSelect.options].some((option) => option.value === savedModel)) {
    els.aiModelSelect.append(new Option(savedModel, savedModel));
  }
  els.aiModelSelect.value = savedModel;
}

function saveAiSettings() {
  scopedSetItem(STORAGE_KEYS.aiApiKey, els.aiApiKeyInput.value.trim());
  scopedSetItem(STORAGE_KEYS.aiBaseUrl, getCompatibleBaseUrl());
  scopedSetItem(STORAGE_KEYS.aiModel, getSelectedAiModel());
  queueRemoteSync();
}

function queueRemoteSync() {
  if (state.isApplyingRemoteData || !state.sessionToken) {
    return;
  }
  window.clearTimeout(state.syncTimer);
  state.syncTimer = window.setTimeout(syncUserData, SYNC_DEBOUNCE_MS);
}

async function syncUserData() {
  if (!state.sessionToken) {
    return;
  }
  try {
    await accountFetch("/data", {
      method: "PUT",
      body: JSON.stringify({ data: getUserDataSnapshot() }),
    });
    if (!els.authOverlay.classList.contains("hidden")) {
      return;
    }
    els.accountSyncLabel.textContent = "Đã đồng bộ";
    els.userNameLabel.textContent = state.currentUser;
  } catch (error) {
    els.accountSyncLabel.textContent = "Sync lỗi";
    els.userNameLabel.textContent = state.currentUser;
    console.warn("Sync failed", error);
  }
}

async function loadRemoteUserData() {
  const response = await accountFetch("/data");
  if (hasRemoteData(response?.data)) {
    applyUserDataSnapshot(response.data);
  } else {
    await syncUserData();
  }
}

async function restoreSession() {
  initializeAccountApiInput();
  renderAuthState();
  if (!state.sessionToken) {
    return;
  }

  try {
    const response = await accountFetch("/me");
    state.currentUser = response.user.username;
    localStorage.setItem(AUTH_KEYS.currentUser, state.currentUser);
    await loadRemoteUserData();
  } catch (error) {
    logout(false);
    setAuthStatus(`PhiÃªn Ä‘Äƒng nháº­p háº¿t háº¡n: ${error.message}`, "wrong");
  } finally {
    renderAuthState();
  }
}

async function authenticate(mode) {
  const username = normalizeUsername(els.authUsernameInput.value);
  const password = els.authPasswordInput.value;
  const localSnapshot = getUserDataSnapshot();

  if (!username || !password) {
    setAuthStatus("Nháº­p tÃªn tÃ i khoáº£n vÃ  máº­t kháº©u.", "wrong");
    return;
  }

  if (password.length < 6) {
    setAuthStatus("Máº­t kháº©u cáº§n Ã­t nháº¥t 6 kÃ½ tá»±.", "wrong");
    return;
  }

  localStorage.setItem(ACCOUNT_API_URL_KEY, getAccountApiUrl());
  setAuthStatus(mode === "register" ? "Äang táº¡o tÃ i khoáº£n..." : "Äang Ä‘Äƒng nháº­p...");

  try {
    const response = await accountFetch(`/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    state.currentUser = response.user.username;
    state.sessionToken = response.token;
    localStorage.setItem(AUTH_KEYS.currentUser, state.currentUser);
    localStorage.setItem(AUTH_KEYS.sessionToken, state.sessionToken);

    if (hasRemoteData(response.data)) {
      applyUserDataSnapshot(response.data);
    } else {
      applyUserDataSnapshot(localSnapshot);
      await syncUserData();
    }

    els.authPasswordInput.value = "";
    initUnitControls();
    renderAll();
    renderAuthState();
    setAuthStatus("");
  } catch (error) {
    setAuthStatus(error.message, "wrong");
  }
}

function logout(shouldRender = true) {
  state.sessionToken = "";
  state.currentUser = "";
  localStorage.removeItem(AUTH_KEYS.sessionToken);
  localStorage.removeItem(AUTH_KEYS.currentUser);
  if (shouldRender) {
    state.unitId = scopedGetItem(STORAGE_KEYS.selectedUnit) || "unit-01";
    applyAiSettingsFromStorage();
    initUnitControls();
    renderAll();
    renderAuthState();
  }
}

function clearImportedData() {
  if (!window.confirm("Xóa toàn bộ dữ liệu import?")) {
    return;
  }
  scopedRemoveItem(STORAGE_KEYS.imported);
  state.unitId = "unit-01";
  scopedSetItem(STORAGE_KEYS.selectedUnit, state.unitId);
  localStorage.setItem(STORAGE_KEYS.selectedUnit, state.unitId);
  queueRemoteSync();
  initUnitControls();
  renderAll();
  els.importStatus.textContent = "Đã xóa dữ liệu import.";
  els.importStatus.className = "feedback correct";
}

function bindEvents() {
  els.themeToggle.addEventListener("click", toggleTheme);
  els.ebookModeButton.addEventListener("click", toggleEbookMode);
  els.pdfInput.addEventListener("change", handlePdfFile);
  els.unitSelect.addEventListener("change", () => setUnit(els.unitSelect.value));
  els.importUnitInput.addEventListener("change", () => {
    setUnit(els.importUnitInput.value);
  });
  els.unitList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-unit-id]");
    if (button) {
      setUnit(button.dataset.unitId);
    }
  });

  els.pdfTab.addEventListener("click", () => switchPanel("pdf"));
  els.learnTab.addEventListener("click", () => switchPanel("learn"));
  els.testTab.addEventListener("click", () => switchPanel("test"));
  els.addTab.addEventListener("click", () => switchPanel("add"));
  els.importTab.addEventListener("click", () => switchPanel("import"));
  els.showLearnButton.addEventListener("click", () => switchPanel("learn"));
  els.startTestButton.addEventListener("click", () => startTest());
  els.startTestSideButton.addEventListener("click", () => startTest());
  els.resetTestButton.addEventListener("click", () => startTest());
  els.answerForm.addEventListener("submit", submitAnswer);
  els.skipButton.addEventListener("click", skipQuestion);
  els.nextButton.addEventListener("click", nextQuestion);
  els.retryWrongButton.addEventListener("click", () => {
    const wrongWords = state.results
      .filter((result) => !result.isCorrect)
      .map((result) => result.word);
    startTest(wrongWords);
  });
  els.searchInput.addEventListener("input", renderWordTable);
  els.wordTable.addEventListener("change", (event) => {
    const input = event.target.closest("[data-mastered]");
    if (!input) {
      return;
    }
    const mastered = getMasteredMap();
    mastered[input.dataset.mastered] = input.checked;
    saveJson(STORAGE_KEYS.mastered, mastered);
    updateStats();
  });
  els.wordTable.addEventListener("click", (event) => {
    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) {
      speakText(speakButton.dataset.speak);
    }
  });
  els.wordForm.addEventListener("submit", addCustomWord);
  els.clearCustomButton.addEventListener("click", clearCustomWords);
  els.importButton.addEventListener("click", importUnits);
  els.exportDataButton.addEventListener("click", exportCurrentData);
  els.clearImportedButton.addEventListener("click", clearImportedData);
  els.imageDropZone.addEventListener("paste", handleImagePaste);
  els.imageDropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.imageDropZone.classList.add("drag-over");
  });
  els.imageDropZone.addEventListener("dragleave", () => {
    els.imageDropZone.classList.remove("drag-over");
  });
  els.imageDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    els.imageDropZone.classList.remove("drag-over");
    readImageFile(event.dataTransfer.files[0]);
  });
  els.imageFileInput.addEventListener("change", () => {
    readImageFile(els.imageFileInput.files[0]);
  });
  els.clearImageButton.addEventListener("click", clearAiImage);
  els.aiImportButton.addEventListener("click", aiImportImage);
  els.aiProviderInput.addEventListener("change", () => {
    updateAiModelOptions();
    saveAiSettings();
  });
  els.aiBaseUrlInput.addEventListener("change", () => {
    updateAiModelOptions();
    saveAiSettings();
    if (els.aiApiKeyInput.value.trim()) {
      loadAiModelsFromEndpoint();
    }
  });
  els.aiApiKeyInput.addEventListener("change", () => {
    saveAiSettings();
    if (els.aiApiKeyInput.value.trim()) {
      loadAiModelsFromEndpoint();
    }
  });
  els.aiModelSelect.addEventListener("change", saveAiSettings);
  els.loadModelsButton.addEventListener("click", loadAiModelsFromEndpoint);
  els.accountButton.addEventListener("click", toggleAccountMenu);
  els.avatarInput.addEventListener("change", () => {
    readAvatarFile(els.avatarInput.files[0]);
    els.avatarInput.value = "";
  });
  els.removeAvatarButton.addEventListener("click", removeAvatar);
  els.authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    authenticate("login");
  });
  els.registerButton.addEventListener("click", () => authenticate("register"));
  els.authCancelButton.addEventListener("click", closeAuthDialog);
  els.logoutButton.addEventListener("click", () => {
    logout();
    els.accountMenu.classList.add("hidden");
  });
  els.accountApiUrlInput?.addEventListener("change", () => {
    localStorage.setItem(ACCOUNT_API_URL_KEY, getAccountApiUrl());
  });
  document.addEventListener("click", (event) => {
    if (
      els.accountMenu.classList.contains("hidden") ||
      els.accountMenu.contains(event.target) ||
      els.accountButton.contains(event.target)
    ) {
      return;
    }
    els.accountMenu.classList.add("hidden");
    els.accountButton.setAttribute("aria-expanded", "false");
  });
}

async function init() {
  initializeAccountApiInput();
  applyTheme(scopedGetItem(STORAGE_KEYS.theme) || localStorage.getItem(STORAGE_KEYS.theme) || "light", {
    sync: false,
  });
  applyEbookMode(
    (scopedGetItem(STORAGE_KEYS.ebookMode) || localStorage.getItem(STORAGE_KEYS.ebookMode)) === "1",
    { sync: false }
  );
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
    loadSpeechVoices();
  }
  updateAiModelOptions();
  applyAiSettingsFromStorage();
  bindEvents();
  await restoreSession();
  state.unitId = scopedGetItem(STORAGE_KEYS.selectedUnit) || localStorage.getItem(STORAGE_KEYS.selectedUnit) || "unit-01";
  initUnitControls();
  renderAll();
  try {
    const savedPdf = await loadSavedPdfFile();
    if (savedPdf) {
      showPdfFile(savedPdf);
    }
  } catch (error) {
    els.pdfFileName.textContent = `Chọn file PDF để mở. Trình duyệt chưa nạp được PDF đã lưu: ${error.message}`;
  }
}

init();
