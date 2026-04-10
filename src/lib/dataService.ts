import blogsJson from "../../data/blogs.json";
import galleryJson from "../../data/gallery.json";
import profileJson from "../../data/profile.json";
import projectsJson from "../../data/projects.json";
import settingsJson from "../../data/settings.json";
import sidebarJson from "../../data/sidebar.json";
import socialsJson from "../../data/socials.json";
import trashJson from "../../data/trash.json";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedThemeMode = "dark" | "light";
export type WindowViewMode = "finder" | "showcase";
export type WindowId =
  | "projects"
  | "browser"
  | "resume"
  | "education"
  | "photos"
  | "about"
  | "contact"
  | "blog"
  | "terminal"
  | "settings"
  | "trash"
  | `browser:${string}`
  | `project:${string}`
  | `project-file:${string}:${string}`
  | `trash-file:${string}`;

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

export interface ResumeData {
  viewerTitle: string;
  fileSrc: string;
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

export type TrashItemType = "folder" | "image" | "text" | "link";

export interface TrashItem {
  id: string;
  type: TrashItemType;
  name: string;
  icon: string;
  windowTitle?: string;
  src?: string;
  url?: string;
  content?: string[];
  deletedAt: string;
  summary: string;
  tags: string[];
}

export interface TrashData {
  title: string;
  subtitle: string;
  emptyMessage: string;
  items: TrashItem[];
}

export interface DockAppSetting {
  id: string;
  label: string;
  title?: string;
  icon: string;
  iconSize?: "standard" | "compact";
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

export interface WallpaperOption {
  id: string;
  label: string;
  type: "static" | "animated";
  src?: string;
  posterSrc?: string;
  renderer?: "aurora-drift" | "glass-wave";
}

export interface BrowserBookmark {
  id: string;
  label: string;
  description: string;
  url: string;
  icon: string;
}

export interface BrowserSettings {
  homeTitle: string;
  addressPlaceholder: string;
  profile: "safari";
  externalStartUrl: string;
  bookmarks: BrowserBookmark[];
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
  wallpapers: WallpaperOption[];
  browser: BrowserSettings;
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
export const getTrash = (): TrashData => trashJson as TrashData;
export const getTrashItem = (id: string): TrashItem | undefined => getTrash().items.find((item) => item.id === id);
export const getSettings = (): SettingsData => settingsJson as SettingsData;
export const getSidebars = (): SidebarData => sidebarJson as SidebarData;
export const getMenuItems = (): MenuItemSetting[] => getSettings().menuItems;
export const getDockApps = (): DockAppSetting[] => getSettings().dockApps;
export const getDesktopItems = (): DesktopItemSetting[] => [
  ...getSettings().desktopItems,
  ...getDesktopProjectItems(),
];
export const getWallpaper = (id: string) => getSettings().wallpapers.find((w) => w.id === id) ?? getSettings().wallpapers[0];

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
export const getTrashFileWindowId = (itemId: string) => `trash-file:${itemId}` as const;
export const getBrowserWindowId = (sessionId: string) => `browser:${sessionId}` as const;

export const getProjectFile = (projectId: string, fileId: string) =>
  getProjectById(projectId)?.files.find((file) => file.id === fileId);

export const getDefaultWindowTitle = (id: string) => {
  const parsed = parseWindowId(id);

  if (parsed.kind === "project") {
    return getProjectById(parsed.projectId)?.titleBar ?? "Project";
  }

  if (parsed.kind === "browser") {
    return getSettings().browser.homeTitle;
  }

  if (parsed.kind === "project-file") {
    const file = getProjectFile(parsed.projectId, parsed.fileId);
    return file?.windowTitle ?? file?.name ?? "File Preview";
  }

  if (parsed.kind === "trash-file") {
    const item = getTrashItem(parsed.itemId);
    return item?.windowTitle ?? item?.name ?? "Archive Item";
  }

  if (parsed.appId === "resume") {
    return getProfile().resume.viewerTitle;
  }

  if (parsed.appId === "browser" || parsed.appId === "blog") {
    return getSettings().browser.homeTitle;
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

  if (parsed.kind === "browser") {
    return getWindowDefault("browser");
  }

  if (parsed.kind === "project-file") {
    const file = getProjectFile(parsed.projectId, parsed.fileId);
    if (file?.type === "image") {
      return getWindowDefault("projectPreview");
    }

    return getWindowDefault("projectFile");
  }

  if (parsed.kind === "trash-file") {
    const item = getTrashItem(parsed.itemId);
    if (item?.type === "image") {
      return getWindowDefault("trashPreview");
    }

    return getWindowDefault("trashFile");
  }

  if (parsed.appId === "browser" || parsed.appId === "blog") {
    return getWindowDefault("browser");
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
    ...getDockApps(),
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

  const trashItems = getTrash().items.map((item) => ({
    id: getTrashFileWindowId(item.id),
    title: item.windowTitle ?? item.name,
    keywords: [
      item.name.toLowerCase(),
      item.summary.toLowerCase(),
      ...item.tags.map((tag) => tag.toLowerCase()),
    ],
  }));

  return [...appItems, ...projects, ...trashItems];
};

export function parseWindowId(id: string):
  | { kind: "app"; appId: WindowId }
  | { kind: "browser"; sessionId: string }
  | { kind: "project"; projectId: string }
  | { kind: "project-file"; projectId: string; fileId: string }
  | { kind: "trash-file"; itemId: string } {
  if (id.startsWith("browser:")) {
    return { kind: "browser", sessionId: id.replace("browser:", "") };
  }

  if (id.startsWith("trash-file:")) {
    const [, itemId] = id.split(":");
    return { kind: "trash-file", itemId };
  }

  if (id.startsWith("project-file:")) {
    const [, projectId, fileId] = id.split(":");
    return { kind: "project-file", projectId, fileId };
  }

  if (id.startsWith("project:")) {
    return { kind: "project", projectId: id.replace("project:", "") };
  }

  return { kind: "app", appId: id as WindowId };
}
