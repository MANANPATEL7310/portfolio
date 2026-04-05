import Image from "next/image";
import { Copy, Plus, Search, Shield, Sidebar, Upload } from "lucide-react";

import { blogPosts } from "@/data/portfolio";

export function BlogApp() {
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
          <h1 className="text-[24px] font-semibold text-rose-500">My Developer Blog</h1>

          <div className="mt-8 space-y-9">
            {blogPosts.map((post) => (
              <article key={post.title} className="grid grid-cols-[108px_1fr] gap-5">
                <Image src={post.image} alt={post.title} className="h-28 w-28 rounded-2xl object-cover" />
                <div>
                  <p className="text-[15px] text-black/55 dark:text-white/62">{post.date}</p>
                  <h2 className="mt-2 text-[22px] font-semibold leading-[1.25] text-[#18181b] dark:text-white">
                    {post.title}
                  </h2>
                  <a href="#" className="mt-4 inline-block text-[16px] text-sky-400">
                    Check out the full post
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
