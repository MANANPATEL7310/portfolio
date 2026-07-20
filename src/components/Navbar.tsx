import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileDown, Terminal } from "lucide-react";
import { navLinks, profile } from "../data/portfolioData";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { triggerNavBeam } from "../lib/navBeam";

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));



export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sectionIds);

  // Nav clicks fire the "light beam" flourish (NavBeam) AND scroll concurrently
  // — the beam rides along with the scroll rather than blocking it. `origin` is
  // the clicked element, so the beam launches from its on-screen position.
  const handleNav = (
    href: string,
    origin?: EventTarget & Element
  ) => {
    setOpen(false);
    const id = href.replace("#", "");
    if (origin) triggerNavBeam(origin, id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-xl px-4 py-3 sm:px-6">
        {/* Terminal prompt brand */}
        <button
          onClick={(e) => handleNav("#about", e.currentTarget)}
          className="group flex items-center gap-2 font-mono text-step-1 text-content-primary/90 transition-colors hover:text-neon-green"
          aria-label={`${profile.handle} — back to top`}
          data-glitch
        >
          <Terminal className="h-4 w-4 text-neon-green" aria-hidden="true" />
          <span className="hidden sm:inline">
            {profile.handle}
            <span className="text-content-secondary/60">:~$</span>
          </span>
          <span className="sm:hidden">{profile.handle.split("@")[0]}$</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={link.href}>
                <button
                  onClick={(e) => handleNav(link.href, e.currentTarget)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-lg px-3 py-1.5 font-mono text-step-1 transition-colors duration-300 ease-hover ${
                    isActive
                      ? "text-neon-green"
                      : "text-content-secondary hover:text-content-primary"
                  }`}
                >
                  {/* Sliding glowing pill that animates between links */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg border border-neon-green/40 bg-neon-green/10 shadow-neon"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="text-neon-green/40">#</span>
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href={profile.resumeUrl || undefined}
            onClick={(e) => {
              if (!profile.resumeUrl) {
                e.preventDefault();
                handleNav("#contact", e.currentTarget);
              }
            }}
            target={profile.resumeUrl ? "_blank" : undefined}
            rel={profile.resumeUrl ? "noreferrer" : undefined}
            className="btn-reticle hidden items-center gap-1.5 rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-1.5 font-mono text-step-0 font-medium text-neon-green hover:bg-neon-green/20 hover:shadow-neon sm:flex"
          >
            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
            resume
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-1.5 text-content-primary/80 transition-colors hover:text-neon-green md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-xl p-2 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = active === id;
                return (
                  <li key={link.href}>
                    <button
                      onClick={(e) => handleNav(link.href, e.currentTarget)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left font-mono text-step-1 transition-colors ${
                        isActive
                          ? "bg-neon-green/10 text-neon-green"
                          : "text-content-primary/70 hover:bg-white/5 hover:text-content-primary"
                      }`}
                    >
                      <span className="text-neon-green/40">#</span>
                      {link.label}
                    </button>
                  </li>
                );
              })}
              <li>
                <a
                  href={profile.resumeUrl || undefined}
                  onClick={(e) => {
                    if (!profile.resumeUrl) {
                      e.preventDefault();
                      handleNav("#contact", e.currentTarget);
                    }
                    setOpen(false);
                  }}
                  target={profile.resumeUrl ? "_blank" : undefined}
                  rel={profile.resumeUrl ? "noreferrer" : undefined}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-2.5 font-mono text-step-1 text-neon-green"
                >
                  <FileDown className="h-4 w-4" aria-hidden="true" />
                  resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
