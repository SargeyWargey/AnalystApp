# UI Mockups - Productivity App Interface Design

## Overall Application Layout

### Sidebar Navigation Design
Based on the provided design inspiration, the sidebar follows a modern, minimalist approach:

- **Width**: 72px collapsed, 240px expanded (future enhancement)
- **Background**: Dark gradient (#2D1B4E → #1A0E2E)
- **Icons**: 24x24px, centered in 48x48px touch targets
- **Spacing**: 16px between icon buttons
- **Active State**: Subtle blue glow (#4F46E5) with rounded background

---

## Plugin-Specific Interface Mockups

### 1. MarkDown Converter Plugin Interface

```
┌──────┬─────────────────────────────────────────────────────────────────────────┐
│      │ MarkDown Converter                                              🗂️ 📤 ⚙️ │
│  📄  ├─────────────────────────────────────────────────────────────────────────┤
│ ━━━  │                                                                         │
│      │  ┌─────────────────────────────────┐  ┌───────────────────────────────┐ │
│  👥  │  │        Import Files             │  │     Destination Folder        │ │
│      │  │                                 │  │                               │ │
│  👤  │  │    ┌─────────────────────┐       │  │  📁 C:\Users\Output\Docs      │ │
│      │  │    │                     │       │  │                               │ │
│  💻  │  │    │   Drag files here   │       │  │  ┌─────────────────────────┐  │ │
│      │  │    │        or           │       │  │  │     [Browse Folder]     │  │ │
│  📋  │  │    │   [Browse Files]    │       │  │  └─────────────────────────┘  │ │
│      │  │    │                     │       │  │                               │ │
│  ⚙️  │  │    └─────────────────────┘       │  │  ┌─────────────────────────┐  │ │
│      │  │                                 │  │  │   [Clear Selection]     │  │ │
│      │  │  📄 Selected Files (3):          │  │  └─────────────────────────┘  │ │
│      │  │  • presentation.pptx             │  │                               │ │
│      │  │  • document.pdf                  │  │  ✅ Valid destination folder  │ │
│      │  │  • spreadsheet.xlsx              │  │                               │ │
│      │  │                                 │  └───────────────────────────────┘ │
│      │  └─────────────────────────────────┘                                   │ │
│      │                                                                         │
│      │                  ┌─────────────────────────────────┐                   │ │
│      │                  │     [Convert to MarkDown]       │                   │ │
│      │                  └─────────────────────────────────┘                   │ │
│      │                                                                         │
│      │  🔄 Converting: document.pdf                                           │ │
│      │  ████████████████████████████████████████ 67% (2 of 3 files)          │ │
│      │                                                                         │
│      │  📊 Conversion History                                                  │ │
│      │  ┌───────────────────────────────────────────────────────────────────┐ │ │
│      │  │ ✅ 09:15 - 5 files converted to C:\Output\                        │ │ │
│      │  │ ⚠️  09:10 - presentation.pptx: Partial conversion (images only)    │ │ │
│      │  │ ✅ 09:05 - document.pdf converted successfully                     │ │ │
│      │  └───────────────────────────────────────────────────────────────────┘ │ │
│      │                                                                         │
└──────┴─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Drag & Drop Zone**: Large, visually prominent area for file import
- **File List**: Clear display of selected files with format indicators
- **Destination Management**: Folder browser with validation feedback
- **Progress Tracking**: Real-time conversion progress with file details
- **History Panel**: Recent conversion activity with status indicators
- **Action Button**: Prominent convert button, disabled until destination set

---

### 2. Terminal Plugin Interface

```
┌──────┬─────────────────────────────────────────────────────────────────────────┐
│      │ Integrated Terminal                                         📁 ⚡ ⚙️    │
│  📄  ├─────────────────────────────────────────────────────────────────────────┤
│      │                                                                         │
│  👥  │ ┌─────────────────────┐ ┌─────────────────────────────────────────────┐ │
│      │ │   File Explorer     │ │         Terminal Session                   │ │
│  👤  │ │                     │ │                                             │ │
│      │ │ 📁 AnalystApp/      │ │ ┌─────┬─────┬─────┐                        │ │
│  💻  │ │   📁 src/           │ │ │Tab1 │Tab2+│ [+] │                        │ │
│ ━━━  │ │     📁 core/        │ │ └─────┴─────┴─────┘                        │ │
│      │ │     📁 plugins/     │ │                                             │ │
│  📋  │ │     📁 shared/      │ │ user@computer:~/AnalystApp$                 │ │
│      │ │   📁 tests/         │ │ > npm run dev                               │ │
│  ⚙️  │ │   📄 package.json   │ │                                             │ │
│      │ │   📄 README.md      │ │ > Starting development server...            │ │
│      │ │                     │ │ > Local:   http://localhost:3000           │ │
│      │ │ 📍 Current: src/    │ │ > Network: http://192.168.1.100:3000       │ │
│      │ │                     │ │                                             │ │
│      │ │ ┌─────────────────┐   │ │ > _                                         │ │
│      │ │ │ [Start Terminal]│   │ │                                             │ │
│      │ │ └─────────────────┘   │ │                                             │ │
│      │ │                     │ │                                             │ │
│      │ │ Shell: PowerShell   │ │ Status: ● Running (PID: 1234)              │ │
│      │ └─────────────────────┘ └─────────────────────────────────────────────┘ │
│      │                                                                         │
│      │ ⚡ Quick Actions:                                                       │ │
│      │ [Open in VS Code] [Git Status] [Run Tests] [Build Project]            │ │
│      │                                                                         │
└──────┴─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Split Layout**: File explorer on left, terminal on right
- **File Tree Navigation**: Hierarchical folder structure with icons
- **Terminal Tabs**: Multiple terminal sessions support
- **Context Actions**: "Start Terminal" opens in selected directory
- **Status Indicators**: Current directory, shell type, process status
- **Quick Actions**: Common development tasks as buttons

---

### 3. Settings Plugin Interface (Future Implementation)

```
┌──────┬─────────────────────────────────────────────────────────────────────────┐
│      │ Application Settings                                           🔧 💾 ⚙️ │
│  📄  ├─────────────────────────────────────────────────────────────────────────┤
│      │                                                                         │
│  👥  │ ┌─────────────────────┐ ┌─────────────────────────────────────────────┐ │
│      │ │   Settings Menu     │ │         Configuration Panel                │ │
│  👤  │ │                     │ │                                             │ │
│      │ │ 🎨 Appearance       │ │ Appearance Settings                         │ │
│  💻  │ │ 🔌 Plugins          │ │                                             │ │
│      │ │ 🛡️  Security         │ │ Theme: ● Dark  ○ Light  ○ Auto             │ │
│  📋  │ │ 📁 File System      │ │                                             │ │
│      │ │ ⚡ Performance      │ │ Sidebar: ● Icons only  ○ Icons + Labels    │ │
│  ⚙️  │ │ 🔄 Updates          │ │                                             │ │
│ ━━━  │ │ ℹ️  About            │ │ Animations: ● Enabled  ○ Disabled          │ │
│      │ │                     │ │                                             │ │
│      │ │                     │ │ Window Size:                                │ │
│      │ │                     │ │ Width: [1200] Height: [800]                │ │
│      │ │                     │ │                                             │ │
│      │ │                     │ │ ┌─────────────────────────────────────────┐ │ │
│      │ │                     │ │ │            [Apply Changes]              │ │ │
│      │ │                     │ │ └─────────────────────────────────────────┘ │ │
│      │ └─────────────────────┘ └─────────────────────────────────────────────┘ │
│      │                                                                         │
└──────┴─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Category Navigation**: Settings organized by functional groups
- **Live Preview**: Changes reflected immediately where possible
- **Form Validation**: Input validation with helpful error messages
- **Reset Options**: Ability to restore defaults per category
- **Import/Export**: Settings backup and restore functionality

---

## Sidebar Icon Specifications

### Plugin Icons
```
┌──────┐
│  🔴  │  ← App Logo/Brand (top)
│      │
│  📄  │  ← MarkDown Converter (active state with glow)
│ ━━━  │
│      │
│  💻  │  ← Terminal Plugin
│      │
│  ⚙️  │  ← Settings Plugin (bottom section)
└──────┘
```

### Icon Design Guidelines
- **Size**: 24x24px icons in 48x48px containers
- **Style**: Minimalist, single-color design
- **Colors**: 
  - Inactive: `#6B7280` (gray-500)
  - Hover: `#9CA3AF` (gray-400)
  - Active: `#4F46E5` (indigo-600) with subtle glow
- **Background**: Active state gets rounded `#1E1B4B` background
- **Spacing**: 16px vertical spacing between icons

### Responsive Behavior
- **Collapsed State** (default): Icons only, 72px width
- **Hover Tooltips**: Plugin names appear on hover
- **Future Enhancement**: Expandable sidebar with labels

---

## Color Palette

### Primary Colors
- **Background Gradient**: `#2D1B4E` → `#1A0E2E`
- **Active Accent**: `#4F46E5` (indigo-600)
- **Text Primary**: `#F9FAFB` (gray-50)
- **Text Secondary**: `#D1D5DB` (gray-300)

### Status Colors
- **Success**: `#10B981` (emerald-500)
- **Warning**: `#F59E0B` (amber-500)
- **Error**: `#EF4444` (red-500)
- **Info**: `#3B82F6` (blue-500)

### Interface Elements
- **Panel Background**: `#1F2937` (gray-800)
- **Border**: `#374151` (gray-700)
- **Input Background**: `#111827` (gray-900)
- **Button Primary**: `#4F46E5` (indigo-600)
- **Button Secondary**: `#6B7280` (gray-500)

---

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Text Hierarchy
- **Page Title**: 24px, semibold, `#F9FAFB`
- **Section Headers**: 18px, medium, `#F9FAFB`
- **Body Text**: 14px, regular, `#D1D5DB`
- **Captions**: 12px, regular, `#9CA3AF`
- **Code/Terminal**: 'Fira Code', 'Monaco', monospace

---

## Animation & Interactions

### Micro-interactions
- **Icon Hover**: 150ms ease-in-out scale(1.1) + color transition
- **Button Hover**: 150ms ease-in-out background color transition
- **Panel Transitions**: 200ms ease-in-out for content changes
- **Progress Bars**: Smooth animated progress with 300ms updates

### Loading States
- **File Processing**: Animated spinner with progress percentage
- **Plugin Loading**: Skeleton loading for interface elements
- **Terminal Output**: Smooth scrolling and text typing effects

### State Feedback
- **Success Actions**: Brief green flash + checkmark icon
- **Error States**: Red outline + shake animation
- **Drag & Drop**: Highlighted drop zones with border animation

---

*Mockup Version: 1.0*  
*Last Updated: 2025-09-17*  
*Based on Design Architecture v1.0*