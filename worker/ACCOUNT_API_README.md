# Account API Worker + D1

Worker `account-api.js` adds login accounts and syncs data per user:

- Imported vocabulary
- Custom words
- Test progress
- Mastered words
- Theme, selected unit, ebook mode
- AI API key, base URL, and selected model

Security note: the AI API key is stored in your Cloudflare D1 database so the same account can use it on another device. Deploy this Worker only under your own Cloudflare account.

## Deploy

```powershell
cd D:\python\english-vocab-web\worker
wrangler d1 create english-vocab-account-db
```

Copy the `database_id` printed by Wrangler into `wrangler.account.toml`:

```toml
database_id = "replace-with-d1-database-id"
```

Run the schema migration and deploy:

```powershell
wrangler d1 execute english-vocab-account-db --file schema.sql --remote
wrangler deploy -c wrangler.account.toml
```

After deploy, copy the Worker URL, for example:

```text
https://english-vocab-account-api.<your-subdomain>.workers.dev
```

Open the vocabulary web app, paste that URL into `Account API URL`, then register or log in.
