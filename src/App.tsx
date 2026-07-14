import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import EducationSection from "./components/EducationSection";
import CertificatesSection from "./components/CertificatesSection";
import ContactSection from "./components/ContactSection";

import SystemBackground from "./components/background/system/SystemBackground";
import SystemLabels from "./components/background/SystemLabels";
import ScanlineOverlay from "./components/background/ScanlineOverlay";
import GrainOverlay from "./components/background/GrainOverlay";
import GlitchController from "./components/background/GlitchController";

import NavBeam from "./components/NavBeam";
import CustomCursor from "./components/CustomCursor";
import CircuitDivider from "./components/ui/CircuitDivider";

export default function App() {
  return (
    <div className="relative min-h-screen bg-base-900 text-content-primary">
      {/* Desktop-only custom crosshair/reticle cursor */}
      <CustomCursor />

      {/* Navbar → section "light beam" navigation flourish (nav clicks only) */}
      <NavBeam />

      {/* Rare glitch micro-distortions on [data-glitch] elements */}
      <GlitchController />

      {/* ── Ambient background layers ─────────────────────────────────────
          The unified "AI Cyber-Defense OS" engine (fog, hex streams, neural
          network, security grid, particles, AI core, scan beam, ripples) runs
          on a single canvas inside <SystemBackground />. Depth gradient,
          vignette, scanlines and floating labels sit around it. Composed once,
          fixed behind all content, non-interactive.                         */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Base radial depth gradient (Layer 1) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#0A0A0A_0%,#030303_60%)]" />
        {/* Unified procedural engine — Layers 2–6, 8, 9, 11, 12 */}
        <SystemBackground />
        {/* Scanlines + slow green fog blooms (Layer 16) */}
        <ScanlineOverlay />
        {/* Vignette to keep edges dark and center readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,3,3,0.85)_100%)]" />
      </div>

      {/* Floating system telemetry labels (Layer 7) — DOM, above canvas bg */}
      <SystemLabels />

      {/* Grain / film-noise texture — always on, above bg, below content */}
      <GrainOverlay />

      {/* ── Foreground content ───────────────────────────────────────────── */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <CircuitDivider />
          <ProjectsSection />
          <CircuitDivider />
          <SkillsSection />
          <CircuitDivider />
          <EducationSection />
          <CircuitDivider />
          <CertificatesSection />
          <CircuitDivider />
          <ContactSection />
        </main>
      </div>
    </div>
  );
}
