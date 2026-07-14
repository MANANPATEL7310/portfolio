import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileDown, Terminal } from "lucide-react";
import { navLinks, profile } from "../data/portfolioData";
import { useScrollSpy } from "../hooks/useScrollSpy";

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sectionIds);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-xl border border-neon-green/15 bg-base-800/70 px-4 py-3 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:px-6">
        {/* Terminal prompt brand */}
        <button
          onClick={() => handleNav("#about")}
          className="group flex items-center gap-2 font-mono text-sm text-white/90 transition-colors hover:text-neon-green"
          aria-label={`${profile.handle} — back to top`}
        >
          <Terminal className="h-4 w-4 text-neon-green" aria-hidden="true" />
          <span className="hidden sm:inline">
            {profile.handle}
            <span className="text-white/40">:~$</span>
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
                  onClick={() => handleNav(link.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-md px-3 py-1.5 font-mono text-sm transition-colors ${
                    isActive
                      ? "text-neon-green"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="text-neon-green/40">#</span>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-1 -bottom-0.5 h-px bg-neon-green shadow-neon"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
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
                handleNav("#contact");
              }
            }}
            target={profile.resumeUrl ? "_blank" : undefined}
            rel={profile.resumeUrl ? "noreferrer" : undefined}
            className="hidden items-center gap-1.5 rounded-md border border-neon-green/40 bg-neon-green/10 px-3 py-1.5 font-mono text-xs font-medium text-neon-green transition-all hover:bg-neon-green/20 hover:shadow-neon sm:flex"
          >
            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
            resume
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-1.5 text-white/80 transition-colors hover:text-neon-green md:hidden"
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
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-xl border border-neon-green/15 bg-base-800/95 p-2 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = active === id;
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNav(link.href)}
                      className={`w-full rounded-md px-3 py-2.5 text-left font-mono text-sm transition-colors ${
                        isActive
                          ? "bg-neon-green/10 text-neon-green"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
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
                      handleNav("#contact");
                    }
                  }}
                  target={profile.resumeUrl ? "_blank" : undefined}
                  rel={profile.resumeUrl ? "noreferrer" : undefined}
                  className="mt-1 flex items-center gap-2 rounded-md border border-neon-green/40 bg-neon-green/10 px-3 py-2.5 font-mono text-sm text-neon-green"
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
