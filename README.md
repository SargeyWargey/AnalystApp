# AnalystApp

Cross-platform desktop productivity application built with Electron + React + TypeScript.

## Project Structure

```
AnalystApp/
├── docs/                   # Project documentation
│   ├── CLAUDE.md          # Claude Code instructions
│   ├── design-architecture.md
│   ├── productivity-app-plan.md
│   └── ui-mockups.md
├── src/                    # Source code
│   ├── core/              # Core application framework
│   ├── plugins/           # Plugin implementations
│   ├── shared/            # Reusable components
│   └── assets/            # Static assets
├── electron/              # Electron main and preload processes
├── public/                # Public assets
├── assets/                # Build assets
├── build/                 # Build output
├── scripts/               # Build and development scripts
└── ...                    # Config files and dependencies
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Technology Stack

- **Framework**: Electron 38+
- **Frontend**: React 19+ with TypeScript
- **Build**: Vite 7+
- **State**: Zustand
- **UI**: Tailwind CSS + Headless UI
- **Testing**: Vitest + React Testing Library

## Development Status

✅ **Phase 1**: Project Setup & Architecture - COMPLETE
🚧 **Phase 2**: Core Application Foundation - NEXT

See `docs/productivity-app-plan.md` for detailed roadmap.