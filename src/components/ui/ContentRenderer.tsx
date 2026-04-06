'use client';

import { ProjectData, BlogPost, GalleryImage, AboutSection, ProjectFile } from '@/lib/dataService';
import Image from 'next/image';
import { openInBrowser } from '@/lib/openInBrowser';

export type ContentType = 'project' | 'blog' | 'about' | 'gallery' | 'file-folder' | 'file-image' | 'file-text' | 'file-link' | 'file-figma';

interface ContentRendererProps {
  type: ContentType;
  data: unknown;
}

export function ContentRenderer({ type, data }: ContentRendererProps) {
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-black/45 dark:text-white/45">
        No content available.
      </div>
    );
  }

  switch (type) {
    case 'project':
      return <ProjectContent data={data as ProjectData} />;
    case 'blog':
      return <BlogContent data={data as BlogPost} />;
    case 'about':
      return <AboutContent data={data as AboutSection} />;
    case 'gallery':
      return <GalleryContent data={data as GalleryImage} />;
    case 'file-folder':
      return <FolderContent data={data as ProjectData} />;
    case 'file-image':
      return <ImageContent data={data as ProjectFile} />;
    case 'file-figma':
      return <FigmaContent data={data as ProjectFile} />;
    case 'file-text':
      return <TextContent data={data as ProjectFile} />;
    case 'file-link':
      return <LinkContent data={data as ProjectFile} />;
    default:
      return (
        <div className="flex h-full items-center justify-center text-sm text-black/45 dark:text-white/45">
          Unknown content type.
        </div>
      );
  }
}

function ProjectContent({ data }: { data: ProjectData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#18181b] dark:text-white">{data.name}</h2>
      <p className="text-[15px] leading-6 text-black/68 dark:text-white/62">{data.description}</p>
      <div className="flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/[0.05] px-3 py-1 text-xs font-medium text-black/65 dark:bg-white/8 dark:text-white/65"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function BlogContent({ data }: { data: BlogPost }) {
  return (
    <article className="space-y-4">
      <div className="relative h-56 overflow-hidden rounded-[1.8rem] border border-black/6 dark:border-white/10">
        <Image src={data.thumbnail} alt={data.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <p className="text-[15px] text-black/55 dark:text-white/62">
        {new Date(data.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <h2 className="text-[32px] font-semibold leading-[1.15] text-[#18181b] dark:text-white">{data.title}</h2>
      <div className="mt-6 space-y-5 text-[17px] leading-8 text-black/78 dark:text-white/78">
        {data.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

function AboutContent({ data }: { data: AboutSection }) {
  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold leading-tight text-[#151515] dark:text-white">{data.title}</h1>
      <div className="mt-6 space-y-6 text-[18px] leading-[1.45] text-black/82 dark:text-white/82">
        {data.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function GalleryContent({ data }: { data: GalleryImage }) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.8rem] border border-black/6 dark:border-white/10">
        <Image src={data.src} alt={data.title} fill className="object-contain" sizes="90vw" />
      </div>
      <div className="flex items-center justify-between gap-4 px-2">
        <div>
          <p className="text-lg font-semibold text-[#171717] dark:text-white">{data.title}</p>
          <p className="text-sm text-black/65 dark:text-white/65">
            {new Date(data.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function FolderContent({ data }: { data: ProjectData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#171717] dark:text-white/92">{data.name}</h3>
      <div className="grid grid-cols-2 gap-4">
        {data.files.map((file) => (
          <div
            key={file.id}
            className="flex flex-col items-center gap-2 rounded-2xl border border-black/6 p-4 dark:border-white/10"
          >
            <div className="relative h-16 w-16">
              <Image src={file.icon} alt={file.name} fill className="object-contain" sizes="64px" />
            </div>
            <span className="text-sm text-[#171717] dark:text-white/80">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageContent({ data }: { data: ProjectFile }) {
  if (!data.src) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-black/45 dark:text-white/45">
        No image source available.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="relative w-full overflow-hidden rounded-[18px] border border-black/8 bg-white dark:border-white/10 dark:bg-[#10131d]">
        <Image src={data.src} alt={data.name} fill className="object-contain" sizes="(min-width: 1024px) 70vw, 100vw" />
      </div>
      <p className="mt-4 text-sm text-black/65 dark:text-white/65">{data.name}</p>
    </div>
  );
}

function FigmaContent({ data }: { data: ProjectFile }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="rounded-[1.6rem] border border-black/8 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/4">
        <div className="relative mx-auto aspect-square w-32">
          {data.src ? (
            <Image src={data.src} alt={data.name} fill className="object-contain" sizes="128px" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-black/45 dark:text-white/45">
              Figma preview
            </div>
          )}
        </div>
      </div>
      <h2 className="mt-6 text-[26px] font-semibold leading-tight text-[#171717] dark:text-white/92">{data.name}</h2>
    </div>
  );
}

function TextContent({ data }: { data: ProjectFile }) {
  return (
    <div className="max-w-[420px] space-y-6 p-6">
      <h2 className="mt-2 text-[26px] font-semibold leading-tight text-[#171717] dark:text-white/92">{data.name}</h2>
      {data.content ? (
        <div className="space-y-7 text-[18px] leading-[1.35] text-[#171717] dark:text-white/92">
          {data.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="text-black/45 dark:text-white/45">No content available.</p>
      )}
    </div>
  );
}

function LinkContent({ data }: { data: ProjectFile }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-[#171717] dark:text-white">{data.name}</p>
      {data.url ? (
        <button
          type="button"
          onClick={() => openInBrowser(data.url!, { title: data.name })}
          className="mt-4 text-sky-500 hover:underline dark:text-sky-400"
        >
          Open link →
        </button>
      ) : (
        <p className="mt-4 text-sm text-black/45 dark:text-white/45">No URL provided.</p>
      )}
    </div>
  );
}
