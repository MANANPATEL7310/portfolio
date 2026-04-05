import blogsJson from "../../data/blogs.json";
import galleryJson from "../../data/gallery.json";
import profileJson from "../../data/profile.json";
import projectsJson from "../../data/projects.json";
import settingsJson from "../../data/settings.json";
import sidebarJson from "../../data/sidebar.json";
import socialsJson from "../../data/socials.json";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedThemeMode = "dark" | "light";
export type WindowViewMode = "finder" | "showcase";
export type WindowId =
  | "projects"
  | "resume"
  | "photos"
  | "about"
  | "contact"
  | "blog"
  | "terminal"
  | `project:${string}`
  | `project-file:${string}:${string}`;

export type ProjectFileType = "folder" | "image" | "text" | "link" | "figma";

export interface ProjectFile {
  id: string;
  type: ProjectFileType;
  name: string;
  icon: string;
  windowTitle?: string;
  src?: string;
  url?: string;
  content?: string[];
}

export interface ProjectData {
  id: string;
  slug: string;
  name: string;
  desktopLabel: string;
  folderLabel: string;
  titleBar: string;
  icon: string;
  thumbnail: string;
  liveUrl: string;
  githubUrl: string;
  websiteLabel: string;
  description: string;
  tags: string[];
  desktopPosition: { x: number; y: number };
  files: ProjectFile[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  content: string[];
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  twitter: string;
  github: string;
  calendar: string;
  actions: Array<{
    id: string;
    label: string;
    icon: string;
    colorClass: string;
  }>;
}

export interface AboutSection {
  id: string;
  label: string;
  icon: string;
  title: string;
  content: string[];
}

export interface ResumeExperience {
  company: string;
  period: string;
  description: string;
}

export interface ResumeEducation {
  school: string;
  period: string;
  degree: string;
}

export interface ResumeData {
  viewerTitle: string;
  pageCount: number;
  zoomLevels: number[];
  identity: {
    name: string;
    headline: string[];
  };
  profile: string;
  contact: string[];
  experience: ResumeExperience[];
  skills: string[];
  education: ResumeEducation[];
}

export interface TerminalCommand {
  id: string;
  command: string;
  type: "techstack" | "github";
}

export interface ProfileData {
  name: string;
  fullTitle: string;
  greeting: string;
  signature: string;
  role: string;
  location: string;
  email: string;
  avatar: string;
  bio: string;
  skills: string[];
  techStack: Record<string, string[]>;
  aboutSections: AboutSection[];
  resume: ResumeData;
  terminal: {
    prompt: string;
    commands: TerminalCommand[];
    githubStats: {
      repos: number;
      stars: number;
      contributions: string;
      focus: string;
    };
  };
}

export interface GalleryImage {
  id: string;
  src: string;
  date: string;
  title: string;
  layout: string;
  collections: string[];
}

export interface DockAppSetting {
  id: string;
  label: string;
  title?: string;
  icon: string;
  openMode?: WindowViewMode;
}

export interface MenuItemSetting {
  id: string;
  label: string;
  title?: string;
  openMode?: WindowViewMode;
}

export interface DesktopItemSetting {
  id: string;
  label: string;
  title: string;
  icon: string;
  desktopPosition: { x: number; y: number };
}

export interface SpotlightItem {
  id: string;
  title: string;
  keywords: string[];
  viewMode?: WindowViewMode;
}

export interface SettingsData {
  themeDefault: ThemeMode;
  copy: {
    blogHeading: string;
    blogCta: string;
    contactHeading: string;
    contactIntro: string;
    photosEmpty: string;
    blogEmpty: string;
  };
  wallpapers: Record<ResolvedThemeMode, string>;
  windowDefaults: Record<string, { width: number; height: number; x: number; y: number }>;
  menuItems: MenuItemSetting[];
  dockApps: DockAppSetting[];
  desktopItems: DesktopItemSetting[];
}

export interface SidebarAction {
  type: "window" | "placeholder";
  windowId?: string;
  title?: string;
  viewMode?: WindowViewMode;
}

export interface SidebarItemData {
  id: string;
  label: string;
  icon: string;
  action?: SidebarAction;
}

export interface SidebarGroup {
  heading: string;
  items: SidebarItemData[];
  sectionLabel?: string;
}

export interface SidebarData {
  finder: SidebarGroup;
  photos: SidebarGroup;
}

export const getProjects = (): ProjectData[] => projectsJson as ProjectData[];
export const getProjectById = (id: string): ProjectData | undefined =>
  getProjects().find((project) => project.id === id || project.slug === id);
export const getBlogs = (): BlogPost[] => blogsJson as BlogPost[];
export const getBlogById = (id: string): BlogPost | undefined =>
  getBlogs().find((post) => post.id === id);
export const getProfile = (): ProfileData => profileJson as ProfileData;
export const getSocials = (): SocialLinks => socialsJson as SocialLinks;
export const getGallery = (): GalleryImage[] => galleryJson as GalleryImage[];
export const getSettings = (): SettingsData => settingsJson as SettingsData;
export const getSidebars = (): SidebarData => sidebarJson as SidebarData;
export const getMenuItems = (): MenuItemSetting[] => getSettings().menuItems;
export const getDockApps = (): DockAppSetting[] => getSettings().dockApps;
export const getDesktopItems = (): DesktopItemSetting[] => [
  ...getSettings().desktopItems,
  ...getDesktopProjectItems(),
];
export const getWallpaper = (theme: ResolvedThemeMode) => getSettings().wallpapers[theme];

export const getDesktopProjectItems = () =>
  getProjects().map((project) => ({
    id: getProjectWindowId(project.id),
    label: project.desktopLabel,
    title: project.titleBar,
    icon: project.icon,
    desktopPosition: project.desktopPosition,
  }));

export const getWindowDefault = (key: string) =>
  getSettings().windowDefaults[key] ?? { width: 800, height: 500, x: 80, y: 80 };

export const getProjectWindowId = (projectId: string) => `project:${projectId}` as const;
export const getProjectFileWindowId = (projectId: string, fileId: string) =>
  `project-file:${projectId}:${fileId}` as const;

export const getProjectFile = (projectId: string, fileId: string) =>
  getProjectById(projectId)?.files.find((file) => file.id === fileId);

export const getDefaultWindowTitle = (id: string) => {
  const parsed = parseWindowId(id);

  if (parsed.kind === "project") {
    return getProjectById(parsed.projectId)?.titleBar ?? "Project";
  }

  if (parsed.kind === "project-file") {
    const file = getProjectFile(parsed.projectId, parsed.fileId);
    return file?.windowTitle ?? file?.name ?? "File Preview";
  }

  if (parsed.appId === "resume") {
    return getProfile().resume.viewerTitle;
  }

  const settingTitle =
    getMenuItems().find((item) => item.id === parsed.appId)?.title ??
    getDockApps().find((item) => item.id === parsed.appId)?.title;

  return settingTitle ?? parsed.appId;
};

export const getWindowDefaultsForId = (id: string) => {
  const parsed = parseWindowId(id);

  if (parsed.kind === "project") {
    return getWindowDefault("projectFolder");
  }

  if (parsed.kind === "project-file") {
    const file = getProjectFile(parsed.projectId, parsed.fileId);
    if (file?.type === "image") {
      return getWindowDefault("projectPreview");
    }

    return getWindowDefault("projectFile");
  }

  return getWindowDefault(parsed.appId);
};

export const getSpotlightItems = (): SpotlightItem[] => {
  const projects = getProjects().map((project) => ({
    id: getProjectWindowId(project.id),
    title: project.titleBar,
    keywords: [
      project.name.toLowerCase(),
      project.folderLabel.toLowerCase(),
      ...project.tags.map((tag) => tag.toLowerCase()),
    ],
  }));

  const appItems = [
    ...getMenuItems(),
    ...getDockApps().filter((item) => item.id !== "trash"),
  ].reduce<SpotlightItem[]>((items, app) => {
    if (items.some((item) => item.id === app.id)) {
      return items;
    }

    items.push({
      id: app.id,
      title: app.title ?? app.label,
      keywords: [app.label.toLowerCase(), (app.title ?? app.label).toLowerCase()],
      viewMode: app.openMode,
    });
    return items;
  }, []);

  return [...appItems, ...projects];
};

export function parseWindowId(id: string):
  | { kind: "app"; appId: WindowId }
  | { kind: "project"; projectId: string }
  | { kind: "project-file"; projectId: string; fileId: string } {
  if (id.startsWith("project-file:")) {
    const [, projectId, fileId] = id.split(":");
    return { kind: "project-file", projectId, fileId };
  }

  if (id.startsWith("project:")) {
    return { kind: "project", projectId: id.replace("project:", "") };
  }

  return { kind: "app", appId: id as WindowId };
}
