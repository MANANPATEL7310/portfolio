import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter, Send } from "lucide-react";
import { socials, profile } from "../data/portfolioData";
import { SectionHeader } from "./ui/SectionShell";

const links = [
  {
    key: "email",
    label: "email",
    value: socials.email,
    href: `mailto:${socials.email}`,
    Icon: Mail,
  },
  {
    key: "linkedin",
    label: "linkedin",
    value: socials.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
    href: socials.linkedin,
    Icon: Linkedin,
  },
  {
    key: "github",
    label: "github",
    value: socials.github.replace(/^https?:\/\/(www\.)?/, ""),
    href: socials.github,
    Icon: Github,
  },
  {
    key: "twitter",
    label: "twitter",
    value: socials.twitter.replace(/^https?:\/\/(www\.)?/, ""),
    href: socials.twitter,
    Icon: Twitter,
  },
];

export default function ContactSection() {
  return (
    <footer
      id="contact"
      aria-label="Contact"
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeader command="$ ./contact --connect" />

        <div className="glass overflow-hidden rounded-xl shadow-elev-2">
          {/* Prompt header */}
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-base-900/60 px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-neon-green/70" />
            <span className="ml-3 font-mono text-step-0 text-content-secondary">
              {profile.handle}:~$ echo "let's build something"
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="font-mono text-step-5 font-bold text-content-primary sm:text-step-6">
              <span className="text-neon-green">&gt;</span> Let&apos;s connect.
            </h2>
            <p className="mt-3 max-w-xl font-sans text-step-2 leading-relaxed text-content-primary/75">
              {profile.availability}. Whether it&apos;s an internship, a
              collaboration, or just talking shop about building great software —
              my inbox is open.
            </p>

            {/* Social links */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {links.map((link, i) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  target={link.key === "email" ? undefined : "_blank"}
                  rel={link.key === "email" ? undefined : "noreferrer"}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group flex items-center gap-3 rounded-lg border border-white/10 bg-base-900/50 px-4 py-3 transition-all duration-300 ease-hover hover:-translate-y-0.5 hover:border-neon-green/40 hover:bg-neon-green/[0.04] hover:shadow-elev-2"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neon-green/25 bg-neon-green/10 text-neon-green transition-colors group-hover:bg-neon-green/20">
                    <link.Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-step-0 uppercase tracking-[0.15em] text-neon-green/70">
                      {link.label}
                    </span>
                    <span className="block truncate font-mono text-step-1 text-content-primary/75 group-hover:text-content-primary">
                      {link.value}
                    </span>
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Closing CTA */}
            <a
              href={`mailto:${socials.email}`}
              className="btn-reticle mt-7 inline-flex items-center gap-2 rounded-lg border border-neon-green/40 bg-neon-green/10 px-5 py-2.5 font-mono text-step-1 font-medium text-neon-green hover:bg-neon-green/20 hover:shadow-neon"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              say hello
            </a>
          </div>
        </div>

        {/* Terminal signoff */}
        <p className="mt-8 text-center font-mono text-step-0 text-content-secondary/70">
          <span className="text-neon-green/60">{profile.handle}:~$</span>{" "}
          exit 0 — built with React, Tailwind &amp; Framer Motion by{" "}
          {profile.name}
          <span className="ml-1 animate-blink text-neon-lime" aria-hidden="true">
            ▊
          </span>
        </p>
      </motion.div>
    </footer>
  );
}
