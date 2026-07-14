import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter, Send } from "lucide-react";
import { socials, profile } from "../data/portfolioData";

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
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="mb-9 flex items-center gap-3">
          <span className="select-none font-mono text-sm text-neon-green/80">
            $ ./contact --connect
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-green/30 to-transparent" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-neon-green/15 bg-base-800/50 backdrop-blur-sm">
          {/* Prompt header */}
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-base-900/60 px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-neon-green/70" />
            <span className="ml-3 font-mono text-xs text-white/40">
              {profile.handle}:~$ echo "let's build something"
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="font-mono text-2xl font-bold text-white sm:text-3xl">
              <span className="text-neon-green">&gt;</span> Let&apos;s connect.
            </h2>
            <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-white/70">
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
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="group flex items-center gap-3 rounded-lg border border-white/10 bg-base-900/50 px-4 py-3 transition-all hover:border-neon-green/40 hover:bg-neon-green/[0.04]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-neon-green/25 bg-neon-green/10 text-neon-green transition-colors group-hover:bg-neon-green/20">
                    <link.Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-xs uppercase tracking-wider text-neon-green/70">
                      {link.label}
                    </span>
                    <span className="block truncate font-mono text-sm text-white/75 group-hover:text-white">
                      {link.value}
                    </span>
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Closing CTA */}
            <a
              href={`mailto:${socials.email}`}
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-neon-green/40 bg-neon-green/10 px-5 py-2.5 font-mono text-sm font-medium text-neon-green transition-all hover:bg-neon-green/20 hover:shadow-neon"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              say hello
            </a>
          </div>
        </div>

        {/* Terminal signoff */}
        <p className="mt-8 text-center font-mono text-xs text-white/35">
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
