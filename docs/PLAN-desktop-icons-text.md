# Post-MVP Plan: Desktop Interactions & Premium Typography

## 1. Context check
- **Goal:** Emulate the reference image by populating the primary empty Desktop canvas with interactive desktop icons (folders, PDFs) and injecting a premium, floating center text typography effect that reacts to user hover.

## 2. Feature A: Draggable Desktop Shortcuts
**Task Breakdown:**
- [ ] Create `src/components/desktop/DesktopIcon.tsx`.
- [ ] Wrap the icon in `framer-motion`'s `<motion.div drag>` component to allow free placement across the screen.
- [ ] Implement `dragConstraints` to strictly lock the folders inside the Desktop view so they can't be dragged offscreen forever.
- [ ] Rig an `onDoubleClick` handler to call `useWindowStore().openWindow(id)` so double-clicking the physical desktop "Resume.pdf" opens the Resume Window App.
- [ ] Map out an array of Desktop Items (e.g., "Project 1", "Project 2", "Resume.pdf") and safely position them natively on the right/left borders in `Desktop.tsx`.

## 3. Feature B: Advanced 3D Hover Text (Center Screen)
**Task Breakdown:**
- [ ] Create `src/components/desktop/WelcomeText.tsx` and place it natively in the absolute center of `Desktop.tsx` (behind the WindowManager, so Windows can be dragged *over* the text).
- [ ] Implement CSS masking or advanced font weighting ("Hey, welcome to my **portfolio**").
- [ ] Write a custom math physics hook (`useMouseTilt`) tracking mouse bounds over the text element.
- [ ] Use Framer Motion hooks (`useMotionValue`, `useTransform`, `useSpring`) to map the mouse `X/Y` offsets to `rotateX` and `rotateY` transforms.
- [ ] This will result in a professional, premium 3D "floating/tilting" effect when the exact text is hovered!

## 4. Execution Sequence
We will execute **Feature B (Centered Text)** first as it acts as the immediate background layer constraint, then layer the customizable **Feature A (Draggable Shortcuts)** exactly over it to make the desktop feel 'lived in' and highly responsive.

## Socratic Verification List
- Will adding `drag` events to the icons conflict with window dragging? **No**, the Z-indices will be carefully structured so clicking an icon stays underneath active modal windows seamlessly.
- Will the 3D typography impact text legibility? **No**, the tilt boundaries will be mathematically constrained to highly subtle, organic degrees (e.g., max 15deg tilt) resulting in a slick, non-distracting premium interaction.
