'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import { Copy, Plus, Search, Shield, Sidebar, Upload } from "lucide-react";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function BlogApp() {
  const blogs = usePortfolioDataStore((state) => state.blogs);
  const copy = usePortfolioDataStore((state) => state.settings.copy);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const selectedBlog = useMemo(
    () => blogs.find((post) => post.id === selectedBlogId) ?? null,
    [blogs, selectedBlogId],
  );

  return (
    <div className="flex h-full flex-col bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="flex h-14 items-center gap-3 border-b border-black/6 bg-white/88 px-4 text-black/40 dark:border-white/10 dark:bg-[#262633] dark:text-white/58">
        <Sidebar className="h-4 w-4" />
        <Search className="h-4 w-4" />
        <Shield className="h-4 w-4" />
        <div className="ml-2 flex h-10 flex-1 items-center rounded-xl bg-black/6 px-4 text-[13px] text-black/28 dark:bg-white/8 dark:text-inherit">
          Search or enter website name
        </div>
        <Upload className="h-4 w-4" />
        <Plus className="h-5 w-5" />
        <Copy className="h-5 w-5" />
      </div>

      <div className="hide-scrollbar flex-1 overflow-auto px-8 py-10">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[24px] font-semibold text-rose-500">{copy.blogHeading}</h1>
            {selectedBlog ? (
              <button
                onClick={() => setSelectedBlogId(null)}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/6"
              >
                Back to all posts
              </button>
            ) : null}
          </div>

          {selectedBlog ? (
            <article className="mt-8">
              <div className="relative h-56 overflow-hidden rounded-[1.8rem] border border-black/6 dark:border-white/10">
                <Image src={selectedBlog.thumbnail} alt={selectedBlog.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <p className="mt-6 text-[15px] text-black/55 dark:text-white/62">
                {new Date(selectedBlog.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h2 className="mt-2 text-[32px] font-semibold leading-[1.15] text-[#18181b] dark:text-white">
                {selectedBlog.title}
              </h2>
              <div className="mt-6 space-y-5 text-[17px] leading-8 text-black/78 dark:text-white/78">
                {selectedBlog.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ) : (
            <div className="mt-8 space-y-9">
              {blogs.length === 0 ? (
                <div className="rounded-[1.6rem] border border-black/6 px-6 py-10 text-center text-[16px] text-black/55 dark:border-white/10 dark:text-white/55">
                  {copy.blogEmpty}
                </div>
              ) : (
                blogs.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedBlogId(post.id)}
                    className="grid w-full grid-cols-[108px_1fr] gap-5 text-left"
                  >
                    <Image src={post.thumbnail} alt={post.title} width={112} height={112} className="h-28 w-28 rounded-2xl object-cover" />
                    <div>
                      <p className="text-[15px] text-black/55 dark:text-white/62">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h2 className="mt-2 text-[22px] font-semibold leading-[1.25] text-[#18181b] dark:text-white">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-[16px] text-black/68 dark:text-white/65">{post.excerpt}</p>
                      <span className="mt-4 inline-block text-[16px] text-sky-500">
                        {copy.blogCta}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
