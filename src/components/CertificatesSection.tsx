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
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group glass glass-hover flex flex-col rounded-xl p-5 shadow-elev-1"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-neon-green/30 bg-neon-green/10">
                  <BadgeCheck
                    className="h-4.5 w-4.5 text-neon-green"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-content-secondary/60">
                  .cert
                </span>
              </div>
              <h3 className="font-mono text-step-2 font-semibold text-content-primary transition-colors group-hover:text-neon-green">
                {cert.name || "Untitled certificate"}
              </h3>
              <p className="mt-1 font-mono text-step-0 text-neon-cyan/70">
                {cert.issuer || "Issuer pending"}
              </p>
              <p className="mt-3 font-sans text-step-1 leading-relaxed text-content-primary/70">
                {cert.focus || "Details coming soon."}
              </p>
            </motion.article>
          ))}
        </div>
      ) : (
        // Graceful empty state
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-base-800/30 px-6 py-14 text-center">
          <FileBadge className="h-8 w-8 text-content-secondary/50" aria-hidden="true" />
          <p className="mt-3 font-mono text-step-1 text-content-secondary">
            $ no certificates listed yet
          </p>
          <p className="mt-1 font-sans text-step-1 text-content-secondary/70">
            New credentials will appear here as they're earned.
          </p>
        </div>
      )}
    </SectionShell>
  );
}
