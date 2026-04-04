# Development Phases

## Phase 1: Infrastructure & The Design System (Days 1)
- Scaffold Next.js + Tailwind environment.
- Implement Atomic generic components: traffic light buttons, CSS generic glassmorphism wrappers, and generic SVG wrappers.
- Inject raw design tokens (colors, blur radiuses, drop shadows).

## Phase 2: Frame & Shell (Days 2-3)
- Build the `Zustand` Window Management store.
- Implement the `Desktop` environment layout.
- Build the fixed `MenuBar` and reactive `Dock` components.
- *Milestone*: A fully functional desktop that displays the wallpaper and dock without interactivity.

## Phase 3: The Window System (Days 4-5)
- Build the `WindowFrame` component featuring `framer-motion` dragging.
- Connect `WindowFrame` to the Zustand store (open/close buttons).
- *Milestone*: User can open an empty window from the Dock, drag it, focus it, and close it.

## Phase 4: Content Applications (Days 6-7)
- Build out the *About Me* component.
- Build out the *Projects* gallery view.
- Build out the *Resume* PDF view.
- Inject these into their respective Window instances.

## Phase 5: Polish & Performance Optimization (Days 8-9)
- Implement Dock hover GSAP math.
- Code-split static assets and heavily optimize images.
- Verify 60FPS on mid-tier hardware.
