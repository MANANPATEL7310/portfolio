# Engineering Scope Definition

## 1. In Scope (The MVP)
The initial release will focus entirely on achieving the MacOS illusion robustly on standard web browsers.

1. **Static Desktop Application Wrapper**:
   - Fixed height/width layout (`100vh`, `overflow: hidden`).
   - Hardcoded top Menu Bar and bottom glassmorphism Dock.
2. **Window Management Core**:
   - Implementation of open, close, minimize, maximize logic relying on a simple Zustand store.
   - Draggable header implementations (using `framer-motion` drag constraints).
   - Z-index management (focus tracking).
3. **Primary Portfolio Sections**:
   - Hardcoded "Finder" view for the About page.
   - Hardcoded "Photos" grid for Projects.
   - Hardcoded "Preview" app for Resume viewing.
4. **Targeted Animations**:
   - Scaling & opacity fade-ins when windows mount.
   - MacOS dock magnification equations.

## 2. Out of Scope (Post-MVP)
The following will be specifically avoided to prevent scope creep:
- **Responsive Mobile Layouts matching macOS**: The OS layout works terribly on mobile. Mobile visitors will get a completely different scrolling fallback template.
- **Dynamic File System**: We will not build a real filesystem or recursive folder nesting.
- **Backend Analytics/Databases**: Hardcoded JSON data will act as the data source for projects. No APIs to build.
- **Complex Physics/3D Mechanics**: The background may use a subtle Three.js shader, but interactions with 3D elements are out of scope.
