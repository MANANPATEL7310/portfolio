import { create } from "zustand";

import {
  getBlogs,
  getGallery,
  getProfile,
  getProjects,
  getSettings,
  getSocials,
  type BlogPost,
  type GalleryImage,
  type ProfileData,
  type ProjectData,
  type SettingsData,
  type SocialLinks,
} from "@/lib/dataService";

interface PortfolioDataState {
  projects: ProjectData[];
  blogs: BlogPost[];
  socials: SocialLinks;
  profile: ProfileData;
  gallery: GalleryImage[];
  settings: SettingsData;
}

export const usePortfolioDataStore = create<PortfolioDataState>(() => ({
  projects: getProjects(),
  blogs: getBlogs(),
  socials: getSocials(),
  profile: getProfile(),
  gallery: getGallery(),
  settings: getSettings(),
}));
