# Server Setup Guide

Complete guide for running AnalystApp in development and production environments.

## Prerequisites

- Node.js (recommended version 18+)
- npm (comes with Node.js)

## Development Server

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Web Development Server
```bash
npm run dev
```
This starts the Vite development server at `http://localhost:5173`

### 3. Start Electron App (Development)
```bash
# Start both web server and Electron app
npm run electron:dev
```
This runs both the web dev server and launches the Electron desktop app.

## Production Server

### 1. Build Electron Production App
```bash
npm run build:electron
```
This builds both web assets and compiles Electron TypeScript files (runs `npm run build` internally).

### 2. Run Production Electron App
```bash
# After building, run the production Electron app
NODE_ENV=production npx electron .
```

### 3. Preview Production Web Build
```bash
npm run preview
```
This serves the production build locally for testing.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run electron:dev` | Start web server + Electron app (dev) |
| `npm run electron` | Launch Electron app only |
| `npm run build` | Build web assets for production |
| `npm run build:electron` | Build web assets + Electron for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests with Vitest |

## Workflow Guide

### Development
1. **Web development**: Use `npm run dev` and open browser to `http://localhost:5173`
2. **Electron development**: Use `npm run electron:dev` to test desktop features
3. **Before committing**: Run `npm run typecheck` and `npm run lint` to ensure code quality

### Production
1. **Build the app**: Run `npm run build:electron` (this includes building web assets)
2. **Run production app**: Use `NODE_ENV=production npx electron .`
3. **Test production web**: Use `npm run preview` to test the web build

## Troubleshooting

- If port 5173 is in use, Vite will automatically use the next available port
- For Electron issues, make sure the web server is running first before launching Electron
- Run `npm install` if you encounter missing dependency errors
- For production builds, ensure all dependencies are installed and TypeScript compiles without errors