# Information Architecture

## 1. Global Viewport (The Desktop)
- **Top Bar (Menu Bar)**
  - Brand Logo (Apple replica or Custom) + App Name
  - Navigation links: Projects, Testimonials, Contact, Resume
  - System Tray: WiFi, Search, Control Center, Clock
- **Background Layer**
  - High-res wallpaper
  - 3D Canvas Layer (Optional/React Three Fiber)
- **Desktop Grid**
  - "Folders" mapping to Projects
  - "Files" mapping to PDFs (Resume)
- **Bottom Dock**
  - Interactive Application Icons (Finder, App Store, Settings, Mail)

## 2. Window Applications (Content Layers)
- **About App (Finder Clone)**
  - Left Sidebar: Favorite categories (General, Hobbies, Future Plans)
  - Main Panel: Developer avatar, intro text, timeline.
- **Projects App (Photos Clone)**
  - Top Toolbar: Sorting or Search filter
  - Main Panel: Masonry grid of project screenshots or video loops.
- **Resume App (PDF Viewer)**
  - Top Toolbar: Zoom controls, page indicators.
  - Main Panel: Embedded PDF or HTML recreation of a CV.

## 3. Component Hierarchy Tree
```text
PortfolioApp/
├── DesktopBackground/
├── MenuBar/
│   ├── BrandMenu
│   └── SystemTray
├── WindowManager/
│   ├── WindowFrame (Draggable wrapper)
│   │   ├── TrafficLights
│   │   └── SpecificAppContent (About / Projects / Resume)
└── DockMenu/
    └── DockIcon
```
