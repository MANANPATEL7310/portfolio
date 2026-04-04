# MVP Technical Document

## 1. Objective

Build a visually impressive, interactive portfolio with core desktop-like behavior using modern frontend stack.

---

## 2. Tech Stack

* React + Next.js
* Tailwind CSS
* shadcn/ui
* Framer Motion
* GSAP
* React Three Fiber (Three.js)

---

## 3. MVP Features

### ✅ Core Features

1. Desktop UI

   * Background (static or subtle 3D)
   * Dock
   * Menu bar

2. Window System

   * Open / close windows
   * Drag functionality
   * Focus (z-index)

3. Sections

   * About
   * Projects
   * Resume

4. Animations

   * Window open/close (Framer Motion)
   * Dock hover effects (GSAP)

---

### ❌ Not in MVP

* Complex 3D interactions
* Physics-based animations
* Backend APIs

---

## 4. Project Structure

```id="nextstruct"
/app
  /components
    /ui
    /desktop
    /window
  /features
    about
    projects
    resume
  /lib
  /store
```

---

## 5. Core Logic

### Window Manager

* Zustand store:

  * openWindows[]
  * activeWindow
  * positions

---

### Animation Strategy

* Framer Motion → UI transitions
* GSAP → timeline sequences

---

## 6. Performance Plan

* Dynamic imports for Three.js
* Memoization for heavy components
* Reduce re-renders

---

## 7. Timeline

1. Design system → 1 day
2. Core components → 2 days
3. Window system → 2 days
4. Animations → 2 days

---

## 8. Success Criteria

* Smooth 60fps animations
* Responsive UI
* Clean component structure

---
