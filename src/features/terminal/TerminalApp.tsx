'use client';

import { useEffect, useMemo, useState } from "react";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function TerminalApp() {
  const profile = usePortfolioDataStore((state) => state.profile);
  const commands = profile.terminal.commands;
  const techStackRows = useMemo(
    () =>
      Object.entries(profile.techStack).map(([category, technologies]) => ({
        category: category.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()),
        technologies: technologies.join(", "),
      })),
    [profile.techStack],
  );
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [completedCommands, setCompletedCommands] = useState<string[]>([]);

  useEffect(() => {
    if (activeCommandIndex >= commands.length) {
      return;
    }

    const activeCommand = commands[activeCommandIndex];

    if (typedLength < activeCommand.command.length) {
      const timer = window.setTimeout(() => {
        setTypedLength((value) => value + 1);
      }, 38);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setCompletedCommands((value) => [...value, activeCommand.id]);
      setActiveCommandIndex((value) => value + 1);
      setTypedLength(0);
    }, 360);

    return () => window.clearTimeout(timer);
  }, [activeCommandIndex, commands, typedLength]);

  const showTechstack = completedCommands.includes("show-techstack");
  const showGithub = completedCommands.includes("github-stats");

  return (
    <div className="h-full overflow-auto bg-white px-6 py-8 font-mono text-[16px] text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="space-y-6">
        {commands.map((command, index) => {
          const isActive = index === activeCommandIndex;
          const isComplete = completedCommands.includes(command.id);
          const visibleCommand = isComplete
            ? command.command
            : isActive
              ? command.command.slice(0, typedLength)
              : "";

          if (!visibleCommand && !isComplete) {
            return null;
          }

          return (
            <div key={command.id} className="space-y-4">
              <p className="text-[18px] font-semibold text-[#171717] dark:text-white/90">
                {profile.terminal.prompt} {visibleCommand}
                {isActive && !isComplete ? <span className="animate-pulse">|</span> : null}
              </p>

              {command.type === "techstack" && showTechstack ? (
                <div className="rounded-xl border border-black/8 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-black/22">
                  <div className="grid grid-cols-[170px_1fr] gap-y-4 text-[15px]">
                    <p className="text-black/75 dark:text-white/80">Category</p>
                    <p className="text-black/75 dark:text-white/80">Technologies</p>
                    <div className="col-span-2 border-t border-dashed border-black/20 dark:border-white/20" />
                    {techStackRows.map((row) => (
                      <TerminalRow key={row.category} category={row.category} technologies={row.technologies} />
                    ))}
                    <div className="col-span-2 border-t border-dashed border-black/20 pt-4 text-emerald-500 dark:border-white/20 dark:text-emerald-400">
                      ✓ {techStackRows.length} of {techStackRows.length} stacks loaded successfully (100%)
                    </div>
                    <p className="col-span-2 text-black/72 dark:text-white/75">▸ Render time: 6ms</p>
                  </div>
                </div>
              ) : null}

              {command.type === "github" && showGithub ? (
                <div className="rounded-xl border border-black/8 bg-black/[0.02] p-5 text-[15px] dark:border-white/10 dark:bg-black/22">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TerminalStat label="Repositories" value={String(profile.terminal.githubStats.repos)} />
                    <TerminalStat label="Stars" value={String(profile.terminal.githubStats.stars)} />
                    <TerminalStat label="Contributions" value={profile.terminal.githubStats.contributions} />
                    <TerminalStat label="Current focus" value={profile.terminal.githubStats.focus} />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TerminalRow({
  category,
  technologies,
}: {
  category: string;
  technologies: string;
}) {
  return (
    <>
      <p className="text-emerald-500 dark:text-emerald-400">✓ {category}</p>
      <p className="text-[#171717] dark:text-white/90">{technologies}</p>
    </>
  );
}

function TerminalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/4">
      <p className="text-[12px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">{label}</p>
      <p className="mt-2 text-[15px] leading-6 text-[#171717] dark:text-white/88">{value}</p>
    </div>
  );
}
