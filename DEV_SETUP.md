# Development Server Setup

Quick guide to get the development server running for AnalystApp.

## Prerequisites

- Node.js (recommended version 18+)
- npm (comes with Node.js)

## Starting the Development Server

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Web Development Server
```bash
npm run dev
```
This starts the Vite development server at `http://localhost:5173`

### 3. Start Electron App (Optional)
```bash
# Start both web server and Electron app
npm run electron:dev
```
This runs both the web dev server and launches the Electron desktop app.

## Available Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run electron:dev` | Start web server + Electron app |
| `npm run electron` | Launch Electron app only |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests with Vitest |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Development Workflow

1. **For web development**: Use `npm run dev` and open browser to `http://localhost:5173`
2. **For Electron development**: Use `npm run electron:dev` to test desktop features
3. **Before committing**: Run `npm run typecheck` and `npm run lint` to ensure code quality

## Troubleshooting

- If port 5173 is in use, Vite will automatically use the next available port
- For Electron issues, make sure the web server is running first before launching Electron
- Run `npm install` if you encounter missing dependency errors