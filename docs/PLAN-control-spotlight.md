# Post-MVP Plan: System Control & Spotlight Search

## 1. System State Architecture (Zustand Expansion)
To support both features, we need global system state:
- **`useSystemStore.ts`**: A dedicated store for OS-level preferences.
  - State: `theme` ('light' | 'dark'), `wallpaper` (string path), `isSpotlightOpen` (boolean).
  - Actions: `setTheme()`, `setWallpaper()`, `toggleSpotlight()`.

## 2. Option A Implementation: Control Center & Settings
**Task Breakdown:**
- [ ] Create `src/components/desktop/ControlCenter.tsx` (a dropdown anchored to the top right `MenuBar.tsx` items).
- [ ] Create `src/features/settings/SettingsApp.tsx` allowing detailed Wallpaper/Theme modifications.
- [ ] Register `settings` into the `WindowManager` `AppRegistry` and add an icon to the Dock.
- [ ] Modify `Desktop.tsx` to dynamically pull the `src` attribute for the background from `useSystemStore`.
- [ ] Implement Tailwind logical Dark mode toggling via Next.js `next-themes` or pure DOM class manipulation on the `<html>` node.

## 3. Option B Implementation: Spotlight Search
**Task Breakdown:**
- [ ] Create `src/components/desktop/Spotlight.tsx` - A translucent centered input field wrapped in a motion modal.
- [ ] Implement custom Hook `useKeyboardShortcut(['Meta', 'k'], toggleSpotlight)`.
- [ ] Create a rigid application Map index array (id, title, metadata keywords).
- [ ] Implement fuzzy search on keystroke that returns the top matching App.
- [ ] Intercept the `Enter` key securely to fire `useWindowStore().openWindow(match.id)` and close Spotlight.

## 4. Execution Sequence
We will execute **Option A** first because it introduces the OS-level System state manipulation which will make injecting Spotlight's global listeners much easier. 

## Socratic Verification List
- Will adding `next-themes` break our custom `--mac-glass` tokens in `globals.css`? **No**, we mapped the variables correctly.
- What happens if the user presses `CMD+K` while dragging a window? **Spotlight** will mount via `zIndex: 99999` blocking drag operations safely.
