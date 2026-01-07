
# Company Employee Viewer — ChatGPT App + MCP (Node.js)

A minimal, store-ready ChatGPT App that renders an HTML UI and connects to an MCP server
to fetch and update employee data.

## What’s included
- `chatgpt-app.json` — ChatGPT App manifest (declares HTML entrypoint and MCP server)
- `/.well-known/mcp.json` — MCP manifest (declares tools/resources)
- `src/server.js` — Node.js MCP server
- `public/ui/index.html` — Rendered HTML UI (works locally and inside ChatGPT)
- `package.json`, `.env.example`, README

## Quickstart (local)
```bash
npm install
npm run dev
# Open http://localhost:3000/ui/index.html
```
Endpoints:
- GET `/.well-known/mcp.json`
- POST `/tools/get_employee`
- POST `/tools/update_status`

## Configure for production
1. Deploy the server (Render / Fly / Vercel / your infra) over HTTPS.
2. Replace `YOUR_DOMAIN` in `chatgpt-app.json` with your domain.
3. Host your Privacy Policy, Terms, and App Icon at the provided URLs.
4. Submit `chatgpt-app.json` to the ChatGPT App Store submission flow.

## Security notes
 - The HTML UI does not hardcode secrets; when inside ChatGPT, tool calls are proxied via the MCP bridge.
- CORS is enabled for simplicity; tighten origins in production.
