# Testing & QA Strategy

## 1. Core Objectives
Given this application relies heavily on visual flair and DOM manipulation (dragging, stacking), testing must prioritize **UI stability, rendering performance, and interactive feedback**.

## 2. Testing Layers

### Unit Testing Component Logic
- **Scope**: Zustand Store, utility math.
- **Tool**: Jest / Vitest
- **Critical Tests**:
  - verify `openWindow` action adds to state array.
  - verify `focusWindow` action moves correct ID to top of the stack.
  - verify `closeWindow` completely removes window from DOM array.

### Visual Regression & Interaction (E2E)
- **Scope**: The visual integrity of the Desktop and Windows.
- **Tool**: Playwright or Cypress
- **Critical Tests**:
  - Test Click-and-drag coordinate updates.
  - Ensure Dock items correctly appear and scale on hover.
  - Check that clicking a hidden window correctly pulls it visible over the active window.

### Performance Profiling
- **Scope**: Maintaining 60fps during GSAP transitions and Framer Motion drags.
- **Tool**: Chrome DevTools Performance Profiler, Lighthouse.
- **Critical Tests**:
  - Ensure React Three Fiber canvas unmounts or pauses rendering when hidden behind full-screen windows.
  - Ensure no memory leaks drop framerates after closing/opening 10+ windows in a session.

## 3. Responsive Strategy Checks
Because the MacOS interface is fundamentally desktop-oriented, a core QA requirement is ensuring the viewport breakpoint logic correctly routes mobile/tablet users to a streamlined semantic HTML fallback portfolio, rather than attempting to render a tiny unusable OS.
