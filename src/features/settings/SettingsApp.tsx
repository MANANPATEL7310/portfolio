'use client';

import { useState } from 'react';
import { Image as ImageIcon, Monitor, Moon, Sun, Type } from 'lucide-react';
import Image from 'next/image';

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';

export function SettingsApp() {
  const profile = usePortfolioDataStore((state) => state.profile);
  const settings = usePortfolioDataStore((state) => state.settings);
  const wallpapers = settings.wallpapers;

  const actualTheme = useSystemStore((state) => state.theme);
  const theme = getResolvedTheme(actualTheme, useSystemStore((state) => state.systemTheme));
  const setTheme = useSystemStore((state) => state.setTheme);
  const setWallpaper = useSystemStore((state) => state.setWallpaper);
  const currentWallpaper = useSystemStore((state) => state.wallpaper);

  const [activeTab, setActiveTab] = useState<'appearance' | 'general'>('appearance');

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      {/* Sidebar */}
      <aside className="hidden w-[200px] shrink-0 border-r border-black/6 bg-[#f5f5f7] px-4 py-5 md:block dark:border-white/10 dark:bg-[#2d2d30]">
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[15px] transition ${
              activeTab === 'general'
                ? 'bg-black/8 text-[#1b1b1d] dark:bg-white/10 dark:text-white'
                : 'text-black/70 hover:bg-black/4 dark:text-white/70 dark:hover:bg-white/6'
            }`}
          >
            <Monitor className="h-4 w-4" />
            General
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[15px] transition ${
              activeTab === 'appearance'
                ? 'bg-black/8 text-[#1b1b1d] dark:bg-white/10 dark:text-white'
                : 'text-black/70 hover:bg-black/4 dark:text-white/70 dark:hover:bg-white/6'
            }`}
          >
            <Sun className="h-4 w-4" />
            Appearance
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-14 items-center border-b border-black/6 px-6 dark:border-white/10">
          <span className="text-[18px] font-semibold text-[#2c2c2f] dark:text-white/92">Settings</span>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-[600px]">
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                {/* Theme Section */}
                <section>
                  <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-white shadow-md">
                        <Sun className="h-7 w-7 text-blue-500" />
                      </div>
                      <span className="text-[14px] font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 shadow-md">
                        <Moon className="h-7 w-7 text-white" />
                      </div>
                      <span className="text-[14px] font-medium">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition ${
                        actualTheme === 'system'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100 shadow-md dark:from-purple-900/40 dark:to-blue-900/40">
                        <Monitor className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-[14px] font-medium">Auto</span>
                    </button>
                  </div>
                </section>

                {/* Wallpaper Section */}
                <section>
                  <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    Desktop Wallpaper
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {wallpapers.map((wallpaper) => (
                      <button
                        key={wallpaper.id}
                        onClick={() => setWallpaper(wallpaper.id)}
                        className={`group relative aspect-video overflow-hidden rounded-xl border-2 transition ${
                          currentWallpaper === wallpaper.id
                            ? 'border-blue-500'
                            : 'border-transparent hover:border-black/20 dark:hover:border-white/20'
                        }`}
                        >
                        <Image
                          src={wallpaper.posterSrc ?? wallpaper.src ?? '/portfolio/wallpaper.png'}
                          alt={wallpaper.label}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-medium text-white">{wallpaper.label}</span>
                            {wallpaper.type === 'animated' ? (
                              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                                Animated
                              </span>
                            ) : null}
                          </div>
                        </div>
                        {currentWallpaper === wallpaper.id && (
                          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Desktop Icons Section */}
                <section>
                  <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    Desktop Icons
                  </h3>
                  <div className="flex items-center gap-3 rounded-xl bg-black/[0.02] p-4 dark:bg-white/5">
                    <span className="text-sm text-black/70 dark:text-white/70">Show icon labels</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 transition after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-gray-700" />
                    </label>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-8">
                <section>
                  <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    About
                  </h3>
                  <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl text-white">
                        🖥️
                      </div>
                      <div>
                        <h4 className="text-[16px] font-semibold">macOS Portfolio</h4>
                        <p className="text-[14px] text-black/60 dark:text-white/60">Version 1.0</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-[14px] text-black/70 dark:text-white/70">
                      <p>Created by {profile.name}</p>
                      <p>A portfolio experience built with Next.js, React & Tailwind CSS</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    Default Apps
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <Type className="h-4 w-4 text-black/60 dark:text-white/60" />
                        <span className="text-[14px]">Browser</span>
                      </div>
                      <span className="text-[14px] text-black/50 dark:text-white/50">{settings.browser.profile === 'safari' ? 'Safari' : settings.browser.profile}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="h-4 w-4 text-black/60 dark:text-white/60" />
                        <span className="text-[14px]">Image Viewer</span>
                      </div>
                      <span className="text-[14px] text-black/50 dark:text-white/50">Preview</span>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
