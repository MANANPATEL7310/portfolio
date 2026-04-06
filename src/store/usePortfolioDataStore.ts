import { create } from "zustand";

import {
  getBlogs,
  getGallery,
  getProfile,
  getProjects,
  getSettings,
  getSocials,
  getTrash,
  type BlogPost,
  type GalleryImage,
  type ProfileData,
  type ProjectData,
  type SettingsData,
  type SocialLinks,
  type TrashData,
} from "@/lib/dataService";

interface PortfolioDataState {
  projects: ProjectData[];
  blogs: BlogPost[];
  socials: SocialLinks;
  profile: ProfileData;
  gallery: GalleryImage[];
  trash: TrashData;
  settings: SettingsData;
}

export const usePortfolioDataStore = create<PortfolioDataState>(() => ({
  projects: getProjects(),
  blogs: getBlogs(),
  socials: getSocials(),
  profile: getProfile(),
  gallery: getGallery(),
  trash: getTrash(),
  settings: getSettings(),
}));
