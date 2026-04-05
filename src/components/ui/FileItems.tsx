'use client';

import Image from 'next/image';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';
import { getProjectFileWindowId, ProjectFile } from '@/lib/dataService';

interface FileItemProps {
  file: ProjectFile;
  projectId: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function FolderItem({ file, projectId, selected, onSelect }: FileItemProps) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const project = usePortfolioDataStore((state) => state.projects.find((p) => p.id === projectId));

  const handleOpen = () => {
    if (file.content && project) {
      openWindow(
        getProjectFileWindowId(projectId, file.id),
        file.windowTitle || file.name
      );
    }
  };

  return (
    <FileButton selected={selected} onClick={onSelect} onDoubleClick={handleOpen}>
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src={file.icon}
          alt={file.name}
          width={96}
          height={96}
          className="max-h-24 w-auto object-contain"
          sizes="96px"
        />
      </div>
      <span>{file.name}</span>
    </FileButton>
  );
}

export function ImageItem({ file, projectId, selected, onSelect }: FileItemProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleOpen = () => {
    if (file.src) {
      openWindow(
        getProjectFileWindowId(projectId, file.id),
        file.windowTitle || file.name
      );
    }
  };

  return (
    <FileButton selected={selected} onClick={onSelect} onDoubleClick={handleOpen}>
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src={file.src || file.icon}
          alt={file.name}
          width={96}
          height={96}
          className="max-h-24 w-auto rounded-2xl border border-black/6 bg-white object-contain shadow-lg dark:border-white/10"
          sizes="96px"
        />
      </div>
      <span>{file.name}</span>
    </FileButton>
  );
}

export function TextItem({ file, projectId, selected, onSelect }: FileItemProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleOpen = () => {
    openWindow(
      getProjectFileWindowId(projectId, file.id),
      file.windowTitle || file.name
    );
  };

  return (
    <FileButton selected={selected} onClick={onSelect} onDoubleClick={handleOpen}>
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src={file.icon}
          alt={file.name}
          width={96}
          height={96}
          className="max-h-24 w-auto object-contain"
          sizes="96px"
        />
      </div>
      <span>{file.name}</span>
    </FileButton>
  );
}

export function LinkItem({ file, selected, onSelect }: FileItemProps) {
  const handleOpen = () => {
    if (file.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <FileButton selected={selected} onClick={onSelect} onDoubleClick={handleOpen}>
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src={file.icon}
          alt={file.name}
          width={96}
          height={96}
          className="max-h-24 w-auto object-contain"
          sizes="96px"
        />
      </div>
      <span>{file.name}</span>
    </FileButton>
  );
}

export function FigmaItem({ file, projectId, selected, onSelect }: FileItemProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleOpen = () => {
    openWindow(
      getProjectFileWindowId(projectId, file.id),
      file.windowTitle || file.name
    );
  };

  return (
    <FileButton selected={selected} onClick={onSelect} onDoubleClick={handleOpen}>
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src={file.icon}
          alt={file.name}
          width={96}
          height={96}
          className="max-h-24 w-auto object-contain"
          sizes="96px"
        />
      </div>
      <span>{file.name}</span>
    </FileButton>
  );
}

interface FileButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

function FileButton({ children, selected, onClick, onDoubleClick }: FileButtonProps) {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`group flex flex-col items-center gap-3 rounded-2xl px-4 py-3 text-center text-[17px] text-[#1b1b1d] transition dark:text-white/92 ${
        selected ? 'bg-black/[0.04] dark:bg-white/6' : ''
      }`}
    >
      <div className="transition duration-200 group-hover:scale-[1.03]">{children}</div>
    </button>
  );
}

export function FileRenderer({
  file,
  projectId,
  selected,
  onSelect,
}: FileItemProps) {
  switch (file.type) {
    case 'folder':
      return <FolderItem file={file} projectId={projectId} selected={selected} onSelect={onSelect} />;
    case 'image':
      return <ImageItem file={file} projectId={projectId} selected={selected} onSelect={onSelect} />;
    case 'text':
      return <TextItem file={file} projectId={projectId} selected={selected} onSelect={onSelect} />;
    case 'link':
      return <LinkItem file={file} projectId={projectId} selected={selected} onSelect={onSelect} />;
    case 'figma':
      return <FigmaItem file={file} projectId={projectId} selected={selected} onSelect={onSelect} />;
    default:
      return <TextItem file={file} projectId={projectId} selected={selected} onSelect={onSelect} />;
  }
}
