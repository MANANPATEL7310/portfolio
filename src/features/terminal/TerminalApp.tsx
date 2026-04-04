import { techStackRows } from "@/data/portfolio";

export function TerminalApp() {
  return (
    <div className="h-full bg-[#1f1f22] px-6 py-8 font-mono text-[16px] text-white">
      <div className="space-y-6">
        <p className="text-[18px] font-semibold text-white/90">@adrian % show techstack</p>

        <div className="rounded-xl border border-white/10 bg-black/22 p-5">
          <div className="grid grid-cols-[170px_1fr] gap-y-4 text-[15px]">
            <p className="text-white/80">Category</p>
            <p className="text-white/80">Technologies</p>
            <div className="col-span-2 border-t border-dashed border-white/20" />
            {techStackRows.map((row) => (
              <TerminalRow key={row.category} category={row.category} technologies={row.technologies} />
            ))}
            <div className="col-span-2 border-t border-dashed border-white/20 pt-4 text-emerald-400">
              ✓ 5 of 5 stacks loaded successfully (100%)
            </div>
            <p className="col-span-2 text-white/75">▸ Render time: 6ms</p>
          </div>
        </div>

        <p className="text-[18px] text-white/90">@adrian % github stats</p>
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
      <p className="text-emerald-400">✓ {category}</p>
      <p className="text-white/90">{technologies}</p>
    </>
  );
}
