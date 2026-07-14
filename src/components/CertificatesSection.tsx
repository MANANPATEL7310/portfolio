import { motion } from "framer-motion";
import { BadgeCheck, FileBadge } from "lucide-react";
import { certificates } from "../data/portfolioData";
import SectionShell from "./ui/SectionShell";

export default function CertificatesSection() {
  const hasCerts = certificates.length > 0;

  return (
    <SectionShell
      id="certificates"
      command="$ ls certificates/"
      title="Certificates"
    >
      {hasCerts ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <motion.article
              key={`${cert.name}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group flex flex-col rounded-xl border border-white/10 bg-base-800/40 p-5 backdrop-blur-sm transition-all hover:border-neon-green/30 hover:shadow-neon"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-neon-green/30 bg-neon-green/10">
                  <BadgeCheck
                    className="h-4.5 w-4.5 text-neon-green"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                  .cert
                </span>
              </div>
              <h3 className="font-mono text-base font-semibold text-white transition-colors group-hover:text-neon-green">
                {cert.name || "Untitled certificate"}
              </h3>
              <p className="mt-1 font-mono text-xs text-neon-cyan/70">
                {cert.issuer || "Issuer pending"}
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-white/65">
                {cert.focus || "Details coming soon."}
              </p>
            </motion.article>
          ))}
        </div>
      ) : (
        // Graceful empty state
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-base-800/30 px-6 py-14 text-center">
          <FileBadge className="h-8 w-8 text-white/30" aria-hidden="true" />
          <p className="mt-3 font-mono text-sm text-white/50">
            $ no certificates listed yet
          </p>
          <p className="mt-1 font-sans text-sm text-white/40">
            New credentials will appear here as they're earned.
          </p>
        </div>
      )}
    </SectionShell>
  );
}
