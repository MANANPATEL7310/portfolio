# Comprehensive Post-MVP Plan: Final Design Frame Alignment

## 1. Context check
- **Goal:** We need to meticulously analyze the provided reference image (the portfolio design frame) and extract every single visual and interactive element that isn't currently built into our live OS environment. We will execute these to achieve 100% pixel-perfect design alignment.

## 2. Feature C: Menu Bar Overhaul & Routing
Currently, our `MenuBar.tsx` uses generic macOS "Finder, File, Edit" placeholders. The design frame shows a custom portfolio navigation scheme.
**Task Breakdown:**
- [ ] Overwrite the left-side Menu Bar items directly to: `Apple Logo | [Name]'s Portfolio | Projects | Testimonials | Contact | Resume`.
- [ ] Connect `onClick` events to these Menu text items so that clicking them directly fires `useWindowStore().openWindow(id)`. This guarantees users don't *have* to use the Desktop or Dock to navigate.
- [ ] Overwrite the right-side System Tray to correctly show the mockup's exact layout: `WiFi | Magnifying Glass (Search) | Profile Target | Battery | Date/Time`.

## 3. Feature D: Control Center Dropdown (Theming)
The design frame shows an active, glossy popover modal displaying a "Light Mode / Dark Mode" toggle box.
**Task Breakdown:**
- [ ] Create `src/components/desktop/ThemeDropdown.tsx` as a popover component extending exactly from the MenuBar's settings icon.
- [ ] Build the glossy Tailwind UI for the dropdown mirroring the `Light Mode` and `Dark Mode (Checked)` text from the mockup.
- [ ] Hook this directly into a system state `useTheme()` to physically toggle Tailwind CSS `.dark` HTML classes to globally manipulate the `GlassWrapper` styling live.

## 4. Feature E: Native Desktop Apps & Files
The visual mock features heavily spaced, draggable objects directly on the wallpaper and the giant centralized stylized text. 
**Task Breakdown:**
- [ ] Incorporate the previously planned `WelcomeText.tsx` ("Hey, welcome to my **portfolio**") right in the absolute center layout featuring the requested 3D magnetic hover physics.
- [ ] Create `DesktopShortcut.tsx` instances positioned exactly as in the mock:
      - Left flank: `Resume.pdf` (Clicking opens ResumeApp)
      - Right flank: 3 staggered Folder Icons -> `Project 1`, `Project 2`, `Project 3`. (Clicking opens ProjectsApp filtered to that project, or just opens the window).

## 5. Feature F: Dock Icon Strict Mapping
Our exact Dock assets must mimic the design frame.
**Task Breakdown:**
- [ ] Update `Dock.tsx` `DOCK_APPS` array to strictly load the mock icons: Finder, Safari, Photos, Contacts, Terminal, Trash.
- [ ] Reconfigure the routing so: Contacts -> `AboutApp`, Safari/Apps -> `ProjectsApp`, Terminal/Preview -> `ResumeApp`.

## Execution Sequence
If approved, we will execute `/enhance` to build these sequentially, prioritizing the **Desktop Elements (Icons/Text)** first, the **Menu Bar modifications** second, and the **Theming Dropdown** third to tie up the final design fidelity.
