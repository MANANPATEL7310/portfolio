import { projects, type ProjectSlug } from "@/data/portfolio";

export function ProjectNoteApp({ slug }: { slug: ProjectSlug }) {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-[#1f1f22] px-8 py-7 text-white">
      <div className="max-w-[340px] space-y-7 text-[18px] leading-[1.35] text-white/92">
        {project.tldr.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
