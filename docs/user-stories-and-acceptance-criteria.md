# User Stories & Acceptance Criteria

## Epic 1: The Desktop Environment
**User Story 1.1**: As a visitor, I want to see a macOS-style desktop so that I am immediately immersed in the portfolio experience.
- **Acceptance Criteria**:
  - The background is a full-screen wallpaper (static or subtle 3D).
  - A fixed Menu Bar is visible at the top.
  - A Dock is centered at the bottom with glassmorphism styling.

## Epic 2: The Dock and Navigation
**User Story 2.1**: As a visitor, I want to interact with the Dock icons so that I can open different sections of the portfolio.
- **Acceptance Criteria**:
  - Hovering over Dock icons triggers a magnification animation.
  - Clicking a Dock icon opens the corresponding Window component.
  - Active apps show a small indicator dot below their icon.

## Epic 3: Window Management
**User Story 3.1**: As a visitor, I want to drag windows around the screen so that I can arrange my view just like a real OS.
- **Acceptance Criteria**:
  - Clicking and holding the top bar of a window allows it to follow the cursor.
  - Windows cannot be dragged completely out of the viewport.

**User Story 3.2**: As a visitor, I want to click on overlapping windows so that the active window is brought to the front.
- **Acceptance Criteria**:
  - Clicking any part of a non-active window updates it to the highest `z-index`.

**User Story 3.3**: As a visitor, I want to close or minimize windows using the traffic light controls.
- **Acceptance Criteria**:
  - Red button closes the window completely.
  - Yellow button gracefully hides the window (minimizes).

## Epic 4: Content Applications
**User Story 4.1**: As a visitor, I want to read the developer's resume in a PDF viewer interface.
- **Acceptance Criteria**:
  - The Resume app opens a window containing a top toolbar mimicking a PDF reader.
  - The embedded resume content is highly legible and scrollable.
