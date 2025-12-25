Deployment notes — Remodify contact form

Goal
- Keep the current local development flow (React dev server + local API) but save a simple documented process so you can deploy the API (Graph-based mail sender) later and stop running a local server.

Files changed / commands
- `server.js` — API that accepts POST /send and sends mail via Microsoft Graph or SMTP.
- `package.json` scripts:
  - `npm run start:api` — start the API (`node server.js`).
  - `npm run start:web` — start the React dev server (`react-scripts start`).
  - `npm start` remains the React dev server.

Local dev (separate server)
1. Start API in one terminal:

```bash
# from project root
PORT=5001 npm run start:api
```

2. Start React dev server in another terminal:

```bash
npm run start:web
```

3. With `package.json` configured proxy (development), the React dev server will forward `/send` to the API at the configured port (see `package.json` `proxy`).

Switching to deployed API (no local server)
- When you deploy the API (Azure Function, Azure App Service, Netlify/Vercel function, etc.) you will get a public endpoint such as `https://api.example.com/send`.
- Update the frontend to call that endpoint directly by setting an environment variable before building the production bundle.

Frontend configuration (recommended)
- Use `REACT_APP_API_BASE_URL` to point to the deployed API. In code you can use:

```js
const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
fetch(`${API_BASE}/send`, { method: 'POST', ... });
```

- For local dev, leave `REACT_APP_API_BASE_URL` blank and the frontend will call `/send` (proxy or same-origin). For deployed builds set the variable to the function/app host.

Deploying the API (options)
- Azure Function (recommended if you use Microsoft Graph):
  - Create Function App (Node runtime), add app settings for `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `GRAPH_SENDER`, `EMAIL_RECIPIENT`.
  - Deploy the API handler code (port your `server.js` handler into a single function file).

- Azure App Service / VM / Docker: run `node server.js` with environment variables set.

Security
- Never commit `.env` with secrets. Keep `.env.example` with placeholders.
- In production use platform-specific secret storage (Azure App Settings, Vercel/Netlify env vars).

Testing deployed endpoint
- After deployment, set `REACT_APP_API_BASE_URL=https://<your-host>` and build the frontend or set the API URL in the frontend config. Test by submitting the form.

Notes
- The server code already supports both SMTP and Microsoft Graph paths using `USE_GRAPH`.
- You can keep running a local API during development; after deployment you can stop the local server and point the frontend to the deployed API.

If you want I can:
- Create an Azure Function stub in this repo (ready to deploy), or
- Add a small `scripts/deploy.sh` template for Azure CLI deploy, or
- Add a `README` section with exact `az` commands.  
Tell me which and I'll add it to the repo.
