'use client';

import { motion } from 'framer-motion';
import { LucideIcon, FolderOpen, Info, FileText, Trash2, Heart, Image as ImageIcon, MapPin, Users } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarSection {
  heading?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  width?: number;
}

const iconMap: Record<string, LucideIcon> = {
  'folder-open': FolderOpen,
  'info': Info,
  'file-text': FileText,
  'trash-2': Trash2,
  'trash': Trash2,
  'heart': Heart,
  'image': ImageIcon,
  'map-pin': MapPin,
  'users': Users,
};

export function Sidebar({ sections, width = 206 }: SidebarProps) {
  return (
    <aside
      className="hidden shrink-0 border-r border-black/6 bg-[#eef1f5] px-3 py-5 md:block dark:border-white/10 dark:bg-[#34343a]"
      style={{ width }}
    >
      {sections.map((section, sectionIndex) => (
        <div key={section.heading || `section-${sectionIndex}`} className={sectionIndex > 0 ? 'mt-10' : ''}>
          {section.heading && (
            <p className="px-3 text-[13px] font-semibold text-black/25 dark:text-white/28">
              {section.heading}
            </p>
          )}
          <div className="mt-2 space-y-1">
            {section.items.map((item) => {
              const Icon = iconMap[item.icon] || FolderOpen;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    item.onClick?.();
                  }}
                  whileHover="hover"
                  initial="initial"
                  className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] transition ${
                    item.active
                      ? 'bg-black/8 text-[#1b1b1d] dark:bg-white/10 dark:text-white'
                      : 'text-black/78 hover:bg-black/4 dark:text-white/82 dark:hover:bg-white/6'
                  }`}
                >
                  <Icon className="h-4 w-4 text-blue-400 transition-transform duration-200 group-hover:scale-110" />
                  {item.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
