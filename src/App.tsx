import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import EducationSection from "./components/EducationSection";
import CertificatesSection from "./components/CertificatesSection";
import ContactSection from "./components/ContactSection";

import BinaryRain from "./components/background/BinaryRain";
import NetworkNodes from "./components/background/NetworkNodes";
import ParticleField from "./components/background/ParticleField";
import HexGrid from "./components/background/HexGrid";
import ScanlineOverlay from "./components/background/ScanlineOverlay";

export default function App() {
  return (
    <div className="relative min-h-screen bg-base-900 text-white">
      {/* ── Ambient background layers ─────────────────────────────────────
          Composed once, fixed behind all content, non-interactive.       */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Base radial depth gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#0A0A0A_0%,#030303_60%)]" />
        <HexGrid />
        <NetworkNodes />
        <BinaryRain />
        <ParticleField />
        <ScanlineOverlay />
        {/* Vignette to keep edges dark and center readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,3,3,0.85)_100%)]" />
      </div>

      {/* ── Foreground content ───────────────────────────────────────────── */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <EducationSection />
          <CertificatesSection />
          <ContactSection />
        </main>
      </div>
    </div>
  );
}
