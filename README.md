# Manan Patel — Terminal-Cyber Portfolio

A single-page, scrollable, recruiter-friendly portfolio with a terminal /
futuristic cyber-SOC dark theme. Built with **Vite + React + TypeScript**,
**Tailwind CSS**, **Framer Motion**, and **lucide-react**.

## Quick start

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build → dist/
npm run preview  # preview the production build
```

## Editing content — one file, whole site

All content lives in **`src/data/portfolioData.ts`**. There are **no hardcoded
strings in the components** — every name, bio, project, skill, certificate, and
social link is read from that data store. Edit it and the entire site updates:

- `profile` — name, greeting, role, bio, status, availability, metrics, about blocks
- `projects` — the project cards (SnapCast, Converso, PrepWise, Bookwise)
- `skills` — skill categories rendered as a `tree` output
- `githubStats` — the animated repo / stars / contributions counters
- `education` — overview, relevant learning, current path, roadmap
- `certificates` — certificate list (empty state handled gracefully)
- `socials` — email + social links
- `navLinks` — navbar items / scroll-spy sections

Add a real resume link via `profile.resumeUrl` to activate the navbar download
CTA (otherwise it smooth-scrolls to the contact section).

## Structure

```
src/
  data/portfolioData.ts        # single source of truth
  hooks/
    useScrollSpy.ts            # active nav-link highlighting
    useTypewriter.ts           # hero greeting typing effect
  components/
    Navbar, HeroSection, AboutSection,
    ProjectsSection, ProjectCard, SkillsSection,
    EducationSection, CertificatesSection, ContactSection
    ui/SectionShell.tsx        # shared terminal section wrapper
    background/                # BinaryRain, NetworkNodes, ParticleField,
                               # HexGrid, ScanlineOverlay (composed once in App)
  App.tsx, main.tsx, index.css
```

## Notes

- Background animation layers are canvas/CSS based, composed once behind all
  content (`position: fixed`, low z-index, `pointer-events: none`).
- Fully responsive with a mobile hamburger menu (closes on nav).
- Respects `prefers-reduced-motion` — ambient animation and the typewriter
  freeze/skip for users who ask for reduced motion.
- Static, client-side only — deploy to Vercel or Netlify (`dist/`).
