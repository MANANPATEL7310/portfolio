import { motion } from "framer-motion";
import { MapPin, Circle, ArrowDownRight } from "lucide-react";
import { profile } from "../data/portfolioData";
import { useTypewriter } from "../hooks/useTypewriter";

export default function HeroSection() {
  const { typed, done } = useTypewriter(profile.greeting, { speed: 42 });

  return (
    <section
      id="about"
      aria-label="Introduction"
      className="relative mx-auto flex min-h-[92vh] w-full max-w-6xl scroll-mt-24 flex-col justify-center px-5 pb-16 pt-32 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full rounded-2xl border border-neon-green/15 bg-base-800/40 p-6 backdrop-blur-sm sm:p-10"
      >
        {/* Terminal window chrome */}
        <div className="mb-6 flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-neon-green/70" />
          <span className="ml-3 font-mono text-xs text-white/40">
            {profile.handle}:~$ whoami
          </span>
        </div>

        {/* Typed greeting */}
        <h1 className="min-h-[3.5rem] font-mono text-2xl font-bold leading-tight text-white sm:min-h-[4.5rem] sm:text-4xl md:text-5xl">
          <span className="text-neon-green">{typed}</span>
          <span
            className={`ml-0.5 inline-block w-[0.55ch] ${
              done ? "animate-blink" : ""
            } text-neon-lime`}
            aria-hidden="true"
          >
            ▊
          </span>
        </h1>

        {/* Role */}
        <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-white/80 sm:text-xl">
          {profile.role}
        </p>

        {/* Bio */}
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-white/60">
          {profile.bio}
        </p>

        {/* Status + location + availability */}
        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-sm">
          <span className="inline-flex items-center gap-1.5 text-white/50">
            <MapPin className="h-4 w-4 text-neon-cyan" aria-hidden="true" />
            {profile.location}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-white/50">{profile.status}</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 text-neon-green">
            <Circle
              className="h-2 w-2 animate-pulse-glow fill-neon-green text-neon-green"
              aria-hidden="true"
            />
            {profile.availability}
          </span>
        </div>

        {/* Metrics as terminal key: value output */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {profile.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
              className="rounded-lg border border-white/10 bg-base-900/60 p-4 font-mono transition-colors hover:border-neon-green/30"
            >
              <div className="text-xs uppercase tracking-wider text-neon-green/70">
                {m.label}
              </div>
              <div className="mt-1 text-sm text-white/85">
                <span className="text-white/30">&gt; </span>
                {m.value}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#projects"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("projects")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 inline-flex items-center gap-2 self-start font-mono text-xs text-white/40 transition-colors hover:text-neon-green"
      >
        <ArrowDownRight className="h-4 w-4 animate-pulse-glow" aria-hidden="true" />
        scroll to explore
      </motion.a>
    </section>
  );
}
