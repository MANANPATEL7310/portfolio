'use client';

import Image from "next/image";
import { ArrowUpRight, MoonStar, Sparkles, SunMedium } from "lucide-react";
import { useEffect } from "react";

import {
  aboutCopy,
  blogPosts,
  contactActions,
  galleryMoments,
  portfolioAssets,
  portfolioIdentity,
  projects,
  techStackRows,
} from "@/data/portfolio";
import { useSystemStore } from "@/store/useSystemStore";

export function MobilePortfolio() {
  const theme = useSystemStore((state) => state.theme);
  const setTheme = useSystemStore((state) => state.setTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <Image
          src={portfolioAssets.wallpaperImage}
          alt="Desktop wallpaper"
          fill
          priority
          className={`object-cover transition duration-500 ${
            theme === "light" ? "scale-105 saturate-[0.8] brightness-[1.15]" : ""
          }`}
          sizes="100vw"
        />
        <div className="desktop-overlay absolute inset-0" />
        <div className={`absolute inset-0 ${theme === "light" ? "bg-white/24" : "bg-slate-950/32"}`} />
      </div>

      <div className="relative z-10 px-4 pb-16 pt-4">
        <header className="window-surface mx-auto flex max-w-md items-center justify-between rounded-2xl px-4 py-3 backdrop-blur-2xl">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">Portfolio</p>
            <p className="text-lg font-semibold text-white">{portfolioIdentity.fullTitle}</p>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full bg-white/10 p-2 text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
        </header>

        <section className="mx-auto mt-6 max-w-md rounded-[2rem] border border-white/15 bg-slate-950/35 p-6 backdrop-blur-2xl">
          <p className="text-lg text-white/78">{portfolioIdentity.greeting}</p>
          <h1
            className="mt-1 text-[4rem] leading-none text-white"
            style={{ fontFamily: "var(--font-script)" }}
          >
            {portfolioIdentity.signature}
          </h1>
          <p className="mt-4 max-w-[28ch] text-sm leading-6 text-white/75">
            {portfolioIdentity.role}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {projects.slice(0, 2).map((project) => (
              <article key={project.slug} className="rounded-2xl bg-white/8 p-3">
                <div className="relative h-24 overflow-hidden rounded-xl">
                  <Image src={project.heroImage} alt={project.shortLabel} fill className="object-cover" sizes="50vw" />
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{project.shortLabel}</p>
                <p className="mt-1 text-xs text-white/60">{project.stack.join(" • ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-5 max-w-md rounded-[1.75rem] border border-white/15 bg-slate-950/35 p-5 backdrop-blur-2xl">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-white/55">
            <Sparkles className="h-4 w-4" />
            Highlights
          </div>
          <div className="mt-4 grid auto-rows-[86px] grid-cols-2 gap-2">
            {galleryMoments.slice(0, 4).map((moment, index) => (
              <div key={index} className={`relative overflow-hidden rounded-2xl ${index === 0 ? "col-span-2" : ""}`}>
                <Image src={moment.image} alt="Moment" fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-5 max-w-md rounded-[1.75rem] border border-white/15 bg-slate-950/35 p-5 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <Image src={portfolioAssets.avatarImage} alt="Adrian" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/55">About</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Meet the developer behind the code</h2>
            </div>
          </div>
          <div className="mt-4 space-y-4 text-sm leading-6 text-white/75">
            {aboutCopy.slice(1, 3).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-5 max-w-md rounded-[1.75rem] border border-white/15 bg-slate-950/35 p-5 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-white/55">Tech Stack</p>
          <div className="mt-4 space-y-3">
            {techStackRows.map((row) => (
              <div key={row.category} className="rounded-2xl bg-white/6 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-400">{row.category}</p>
                <p className="mt-1 text-sm text-white/72">{row.technologies}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-5 max-w-md rounded-[1.75rem] border border-white/15 bg-slate-950/35 p-5 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-white/55">Writing</p>
          <div className="mt-4 space-y-4">
            {blogPosts.slice(0, 2).map((post) => (
              <article key={post.title} className="grid grid-cols-[68px_1fr] gap-3">
                <Image src={post.image} alt={post.title} className="h-[68px] w-[68px] rounded-2xl object-cover" />
                <div>
                  <p className="text-xs text-white/45">{post.date}</p>
                  <h3 className="mt-1 text-sm font-semibold leading-5 text-white">{post.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-5 max-w-md rounded-[1.75rem] border border-white/15 bg-slate-950/35 p-5 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-white/55">Contact</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {contactActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                className={`rounded-2xl bg-gradient-to-br ${action.colorClass} px-4 py-4 text-sm font-semibold text-white`}
              >
                <span className="flex items-center justify-between">
                  {action.label}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
