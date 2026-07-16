import { projects } from "../data/portfolioData";
import SectionShell from "./ui/SectionShell";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <SectionShell id="projects" command="$ ls projects/" title="Projects">
      <div className="mb-6 font-mono text-step-1 text-content-secondary">
        <span className="text-neon-green">total {projects.length}</span> —
        selected full-stack builds, shipped end to end.
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
