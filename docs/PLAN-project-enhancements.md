# Project Enhancements Plan

## Overview
The MacOS Portfolio is currently in a highly polished state. To elevate the project from a "great web portfolio" to an "indistinguishable MacOS replica", we are focusing on **Micro-interactions and System Interactivity**. 

This plan details the implementation of Phase 1: custom Context Menus and Window Minimize Animations.

---

## Technical Stack
- **React/Next.js**: For components and logic.
- **Zustand**: `useSystemStore` (or `useWindowStore`) will be used to track context menu open/close state and position.
- **Framer Motion / Tailwind CSS**: For smooth swoosh/genie animations during window minimize.
- **Radix UI / Headless UI (Optional)**: If needed for accessible dropdowns, though custom DOM absolute elements typically work better for OS context menus.

---

## Task Breakdown

### Phase 1: The Immersive Interactivity Layer

| Task ID | Task Name | Agent | Skill | Verifiable Details |
|---------|-----------|-------|-------|--------------------|
| ENH-001 | Global Context Menu Prevent | `frontend-specialist` | `frontend-design` | **IN**: Root layout (`app/page.tsx` or `Desktop.tsx`).<br>**OUT**: Override default `onContextMenu` globally, except in explicit inputs. Setup `useContextMenu` zustand store to hold `{ x, y, isOpen, items }`.<br>**VERIFY**: Right-clicking no longer shows browser menu. |
| ENH-002 | Desktop Context Menu UI | `frontend-specialist` | `frontend-design` | **IN**: `Desktop.tsx`.<br>**OUT**: A floating absolutely positioned MacOS menu appearing at mouse coordinates containing "Change Wallpaper", "New Folder" (mock).<br>**VERIFY**: Clicking outside closes the menu. Items hover correctly. |
| ENH-003 | Dock Icon Context Menu | `frontend-specialist` | `frontend-design` | **IN**: `Dock.tsx` items.<br>**OUT**: Right-clicking dock icons reveals "Open", "Minimize", "Quit".<br>**VERIFY**: Clicking "Quit" closes the app via `useWindowStore`. |
| ENH-004 | Window Minimize Animations | `frontend-specialist` | `frontend-design` | **IN**: `useWindowStore.ts` and `Window.tsx`.<br>**OUT**: Add CSS transitions or framer-motion layout changes. When `isMinimized` is toggled, window smoothly scales down towards the dock position.<br>**VERIFY**: Visual swoosh effect on minimize/restore. |

---

## 🟢 Phase X: Verification Plan
1. Check that standard browser right click is dead.
2. Check that right clicking on edges of screen doesn't cause overflow.
3. Verify window open/minimize visual hierarchy isn't broken by Z-index overlap.
4. Run standard codebase lint: `npm run lint`.
