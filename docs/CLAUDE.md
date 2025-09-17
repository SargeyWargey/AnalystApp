# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **cross-platform desktop productivity application** built with **Electron + React + TypeScript**. The app combines MarkDown file conversion and integrated terminal functionality in a unified interface with a plugin-based architecture.

**Current Status**: Pre-development phase - comprehensive planning complete, ready for implementation.

## Technology Stack

- **Framework**: Electron 27+ with React 18+ and TypeScript
- **Build System**: Vite for fast development and optimized builds
- **State Management**: Zustand (lightweight, plugin-friendly)
- **UI Framework**: Tailwind CSS + Headless UI
- **Testing**: Vitest + React Testing Library + Playwright
- **Terminal Integration**: node-pty for cross-platform terminal support
- **Python Integration**: Embedded Python runtime with MarkItDown library

## Commands to Set Up Development Environment

Since this project is in pre-development phase, the following commands will need to be established during Phase 1:

```bash
# Initialize Node.js project
npm init -y

# Install core dependencies
npm install electron react react-dom typescript vite
npm install @types/react @types/react-dom @types/node --save-dev

# Install additional dependencies
npm install zustand tailwindcss @headlessui/react node-pty
npm install vitest @vitejs/plugin-react eslint prettier --save-dev

# Development commands (to be established)
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run test suite
npm run lint         # ESLint code checking
npm run typecheck    # TypeScript type checking
npm run electron     # Start Electron app
npm run dist         # Build distributable packages
```

## Core Architecture

### Plugin-Based Architecture
The application uses a plugin system where each tool (MarkDown converter, terminal) is implemented as an independent plugin:

```
src/
├── core/                    # Core application framework
│   ├── app/                 # Electron main process
│   ├── plugin-system/       # Plugin management framework
│   ├── ipc/                # Inter-process communication
│   └── state/              # Global state management (Zustand)
├── plugins/                # Plugin implementations
│   ├── markdown-converter/ # File conversion tool
│   ├── terminal/           # Integrated terminal
│   └── settings/           # Configuration management
├── shared/                 # Reusable components and utilities
└── assets/                 # Static resources
```

### Key Plugin Interface
```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  initialize(): Promise<void>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  getComponent(): React.ComponentType;
  getSidebarIcon(): React.ComponentType;
  capabilities: PluginCapabilities;
}
```

## Development Phases

**Current Phase**: Phase 1 - Project Setup & Architecture

1. **Phase 1**: Project setup & core architecture
2. **Phase 2**: Core application foundation (UI framework)
3. **Phase 3**: MarkDown converter plugin
4. **Phase 4**: Terminal plugin
5. **Phase 5**: Polish & testing
6. **Phase 6**: Packaging & distribution

## Key Features to Implement

### MarkDown Converter Plugin
- Drag-and-drop file import interface
- Support for PDF, Office docs, images, HTML via MarkItDown library
- Destination folder management
- Progress tracking and conversion history

### Terminal Plugin  
- Split-pane interface (file explorer + terminal)
- Cross-platform shell support (PowerShell, bash, zsh)
- Directory-contextual terminal launching
- Multiple terminal sessions with tabs

## Design System

- **Theme**: Dark gradient design (`#2D1B4E` → `#1A0E2E`)
- **Sidebar**: 72px collapsed width with icon navigation
- **Typography**: Inter font family
- **Icons**: 24x24px minimalist design in 48x48px containers

## Security Considerations

- **Renderer Security**: Context isolation enabled, node integration disabled
- **IPC Validation**: All inter-process communication validated
- **File System**: Restricted to user-selected directories
- **Plugin Sandboxing**: Controlled environments with explicit capabilities

## Important Implementation Notes

- Self-contained distribution - all dependencies bundled (Python runtime, MarkItDown library)
- Cross-platform consistency - single codebase for Windows and Mac
- Plugin-first architecture - hot-pluggable plugins with standardized interfaces
- Offline-capable - full functionality without internet connectivity
- Performance targets: <3s startup, <200MB memory, <100ms UI response

## Target Platforms

- **Windows**: 10+ with proper DPI scaling
- **macOS**: 12+ with native look-and-feel

## Development Progress Tracking

**IMPORTANT**: As tasks are completed during development, update the checkboxes in `productivity-app-plan.md` by changing `- [ ]` to `- [x]` for completed items. This provides a clear visual progress indicator for the entire development roadmap.

When implementing features, always refer to the detailed specifications in `design-architecture.md` and follow the development roadmap in `productivity-app-plan.md`.