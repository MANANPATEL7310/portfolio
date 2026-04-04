# PLAN: MacOS Portfolio Generation

**Task Slug**: `macos-portfolio`
**Objective**: Architecture and Planning for the MacOS-inspired Web Portfolio.

## Agent Assignments
- **`project-planner`**: Analyzed `PRD.md`, `MVP Tech Doc.md`,  `Architecture.md` and `system design.md` to extract core actionable files down-selecting unnecessary backend tasks.
- **`frontend-specialist`**: (Next phase execution) Will build the React + Tailwind application utilizing the Atomic asset tree.
- **`clean-code`**: Ensuring the Zustand window manager is performant and not over-engineered.

## Selected Document Scope
Based on the explicit constraint "we only create protfolio app so may be some of above 12 files are not required", the following strictly Frontend-oriented planning docs were generated:

1. `docs/product-requirements.md` ✅ (Expanded from PRD)
2. `docs/user-stories-and-acceptance-criteria.md` ✅
3. `docs/information-architecture.md` ✅ (Maps the OS components together)
4. `docs/system-architecture.md` ✅ (Defines Zustand/Framer/R3F connections)
5. `docs/engineering-scope-definition.md` ✅
6. `docs/development-phases.md` ✅
7. `docs/testing-strategy.md` ✅

**Excluded Files:** `database-schema.md`, `api-contracts.md`, `scoring-engine-spec.md`, `monorepo-structure.md`, `environment-and-devops.md` as they are irrelevant for a serverless, static-data visual frontend portfolio MVP.

## Task Breakdown / Implementation Checklist

- [x] Project Initialization (Next.js, Tailwind, Framer Motion)
- [x] Atomic Design Systems Check (Imports isolated SVGs/Atoms from `all images/`)
- [x] Zustand Store Setup 
- [x] Base Desktop Layout (Background, Menu Bar)
- [x] Base Dock Component (GSAP implementations)
- [x] Window Shell Mechanism (Draggable)
- [x] Application Routes inside Windows (About, Projects, Resume)

## Phase 5: Polish & Interactions (Days 8-10)
- [x] Implement global GSAP timelines for site initialization (Boot sequence)
- [x] Tie toggleMaximizeWindow, toggleMinimizeWindow to TrafficLights
- [x] Handle responsive resizing for Window layers
- [x] Post-build Lighthouse checks

## Socratic Verification / Verification Checklist
- Are we building any backend? **NO** -> Scope strictly maintained on frontend visual orchestration.
- Are assets pre-prepared? **YES** -> Relying entirely on Figma exports found in `all images/`.
- Is mobile-optimization prioritized in the OS View? **NO** -> Mobile needs a standard scrolling fallback to be developed in parallel to bypass OS constraints.
