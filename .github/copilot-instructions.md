# Coolify Dashboard - AI Agent Instructions

## Project Overview
A lightweight Node.js + Express dashboard for Home Lab system monitoring, deployable on Coolify. The architecture is a classic backend-first design: Express server exposes metrics via `/api/stats`, and a client-side dashboard (with Chart.js) visualizes them.

## Architecture & Data Flow
- **Backend** ([index.js](../index.js)): Express server on port 3000, serves static files from `/public` and exposes REST API
- **API Endpoint**: `GET /api/stats` returns JSON with `uptime`, `memory` (Node.js process metrics), `cpus` (system CPU count), and `timestamp`
- **Frontend** ([public/index.html](../public/index.html), [public/script.js](../public/script.js)): HTML canvas elements for memory/CPU charts + uptime display
- **Note**: `script.js` is currently empty—chart initialization is the primary expansion point

## Key Patterns & Conventions

### Express Setup
- Static files served from `public/` directory (see `express.static(path.join(__dirname, "public"))`)
- Server binds to `0.0.0.0` (all interfaces) for container deployments
- Port defaults to `process.env.PORT` or `3000`

### Metrics Exposed
- `process.uptime()`: Server runtime in seconds
- `process.memoryUsage()`: Returns object with `rss`, `heapTotal`, `heapUsed`, `external` (in bytes)
- `os.cpus().length`: System CPU count (not current CPU usage)
- Always include `timestamp: new Date()` in `/api/stats` responses for client-side time alignment

## Development & Deployment

### Local Development
```bash
npm install
npm start
```
Server listens on `http://localhost:3000`; frontend is accessible at `/`, API at `/api/stats`

### Docker Deployment
- Uses `node:20-alpine` base image (lightweight, pre-configured)
- Containerizes as-is; no build step required (index.js is pure Node.js, no transpilation)
- `EXPOSE 3000` in Dockerfile; map to host port as needed in Coolify

## Common Tasks & Extension Points

- **Add new metrics**: Add to `app.get("/api/stats")` response object; client polls and displays via Chart.js
- **Update frontend charts**: Edit [public/script.js](../public/script.js) (currently empty) to initialize Chart.js instances with canvas IDs `memoryChart` and `cpuChart`
- **Change polling interval or visualization**: Modify [public/script.js](../public/script.js)—no backend changes needed for UI updates
- **Add environment-based configuration**: Use `process.env` variables; document in startup logs or README

## Testing & Debugging
- **Manual API test**: `curl http://localhost:3000/api/stats`
- **Frontend inspection**: Browser DevTools; Network tab shows `/api/stats` requests
- **Logs**: Node.js startup message confirms port binding; any API errors logged to console

## Dependencies & Integration Points
- **Express 5.x**: HTTP server framework; no middleware (compression, CORS, etc.) currently in use
- **Node.js built-ins**: `os`, `path` modules only; no external monitoring libraries
- **Chart.js**: Client-side library (CDN-loaded); must initialize chart instances with matching canvas IDs
