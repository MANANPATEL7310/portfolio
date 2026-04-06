'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  ExternalLink,
  Home,
  RefreshCw,
  Search,
  Shield,
  Sidebar,
  Upload,
} from 'lucide-react';

import { BROWSER_HOME_URL, getBrowserBlogUrl, getBrowserDisplayTitle, normalizeBrowserUrl, parseBrowserUrl } from '@/lib/browser';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';

export function BrowserApp({ windowId }: { windowId: string }) {
  const settings = usePortfolioDataStore((state) => state.settings);
  const blogs = usePortfolioDataStore((state) => state.blogs);
  const projects = usePortfolioDataStore((state) => state.projects);
  const browserSession = useWindowStore((state) => state.browserSessions[windowId]);
  const ensureBrowserSession = useWindowStore((state) => state.ensureBrowserSession);
  const navigateBrowserWindow = useWindowStore((state) => state.navigateBrowserWindow);
  const goBrowserBack = useWindowStore((state) => state.goBrowserBack);
  const goBrowserForward = useWindowStore((state) => state.goBrowserForward);
  const reloadBrowserWindow = useWindowStore((state) => state.reloadBrowserWindow);
  const setBrowserStatus = useWindowStore((state) => state.setBrowserStatus);
  const setBrowserTitle = useWindowStore((state) => state.setBrowserTitle);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [addressValue, setAddressValue] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    ensureBrowserSession(windowId, BROWSER_HOME_URL, settings.browser.homeTitle);
  }, [ensureBrowserSession, settings.browser.homeTitle, windowId]);

  const currentUrl = browserSession?.url ?? BROWSER_HOME_URL;
  const parsedUrl = parseBrowserUrl(currentUrl);
  const canGoBack = Boolean(browserSession && browserSession.historyIndex > 0);
  const canGoForward = Boolean(browserSession && browserSession.historyIndex < browserSession.history.length - 1);
  const selectedBlog = parsedUrl.kind === 'blog' ? blogs.find((post) => post.id === parsedUrl.blogId) ?? null : null;

  useEffect(() => {
    if (!browserSession) {
      return;
    }

    if (parsedUrl.kind === 'home' && browserSession.title !== settings.browser.homeTitle) {
      setBrowserTitle(windowId, settings.browser.homeTitle);
      return;
    }

    if (parsedUrl.kind === 'blog' && selectedBlog && browserSession.title !== selectedBlog.title) {
      setBrowserTitle(windowId, selectedBlog.title);
      return;
    }

    if (parsedUrl.kind === 'external') {
      const nextTitle = getBrowserDisplayTitle(currentUrl, browserSession.title);
      if (browserSession.title !== nextTitle) {
        setBrowserTitle(windowId, nextTitle);
      }
    }
  }, [browserSession, currentUrl, parsedUrl.kind, selectedBlog, setBrowserTitle, settings.browser.homeTitle, windowId]);

  useEffect(() => {
    if (!browserSession || parsedUrl.kind !== 'external') {
      return;
    }

    setBrowserStatus(windowId, 'loading');
    const timer = window.setTimeout(() => {
      setBrowserStatus(windowId, 'blocked');
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [browserSession, parsedUrl.kind, setBrowserStatus, windowId]);

  if (!browserSession) {
    return (
      <div className="flex h-full items-center justify-center bg-white text-sm text-black/45 dark:bg-[#1f1f22] dark:text-white/45">
        Launching Safari...
      </div>
    );
  }

  const handleAddressSubmit = () => {
    const nextUrl = normalizeBrowserUrl(addressValue || currentUrl);
    if (nextUrl === browserSession.url) {
      reloadBrowserWindow(windowId);
      return;
    }
    navigateBrowserWindow(windowId, nextUrl);
    setIsEditingAddress(false);
  };

  const resolvedAddressValue =
    isEditingAddress
      ? addressValue
      : browserSession.url === BROWSER_HOME_URL
        ? settings.browser.homeTitle
        : browserSession.url;

  const beginEditingAddress = () => {
    setIsEditingAddress(true);
    setAddressValue(browserSession.url === BROWSER_HOME_URL ? '' : browserSession.url);
  };

  const endEditingAddress = () => {
    setIsEditingAddress(false);
    setAddressValue('');
  };

  return (
    <div className="flex h-full flex-col bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="flex h-14 items-center gap-3 border-b border-black/6 bg-white/88 px-4 text-black/40 dark:border-white/10 dark:bg-[#262633] dark:text-white/58">
        <button
          onClick={() => goBrowserBack(windowId)}
          disabled={!canGoBack}
          className="rounded-md p-1 transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/8"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => goBrowserForward(windowId)}
          disabled={!canGoForward}
          className="rounded-md p-1 transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/8"
          aria-label="Forward"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigateBrowserWindow(windowId, BROWSER_HOME_URL, { title: settings.browser.homeTitle })}
          className="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/8"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </button>
        <button
          onClick={() => reloadBrowserWindow(windowId)}
          className="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/8"
          aria-label="Reload"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <Sidebar className="h-4 w-4" />
        <Shield className="h-4 w-4" />
        <form
          className="ml-1 flex h-10 flex-1 items-center rounded-xl bg-black/6 px-4 text-[13px] text-black/45 dark:bg-white/8 dark:text-inherit"
          onSubmit={(event) => {
            event.preventDefault();
            handleAddressSubmit();
          }}
        >
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <input
            ref={addressInputRef}
            value={resolvedAddressValue}
            onChange={(event) => setAddressValue(event.target.value)}
            onFocus={() => {
              beginEditingAddress();
              addressInputRef.current?.select();
            }}
            onBlur={endEditingAddress}
            placeholder={settings.browser.addressPlaceholder}
            className="w-full bg-transparent outline-none placeholder:text-black/28 dark:placeholder:text-white/26"
          />
        </form>
        <button
          onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
          className="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/8"
          aria-label="Open externally"
          disabled={parsedUrl.kind !== 'external'}
        >
          <Upload className="h-4 w-4" />
        </button>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(currentUrl);
            } catch {}
          }}
          className="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/8"
          aria-label="Copy link"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {parsedUrl.kind === 'home' ? (
          <BrowserHome
            bookmarks={settings.browser.bookmarks}
            projects={projects}
            blogs={blogs}
            onOpenUrl={(url, title) => navigateBrowserWindow(windowId, url, { title })}
          />
        ) : parsedUrl.kind === 'blog' && selectedBlog ? (
          <BrowserArticle
            title={selectedBlog.title}
            date={selectedBlog.date}
            thumbnail={selectedBlog.thumbnail}
            content={selectedBlog.content}
            onBack={() => navigateBrowserWindow(windowId, BROWSER_HOME_URL, { title: settings.browser.homeTitle })}
          />
        ) : (
          <BrowserWebView
            key={`${browserSession.url}-${browserSession.reloadKey}`}
            title={browserSession.title}
            url={browserSession.url}
            status={browserSession.status}
            onReady={() => setBrowserStatus(windowId, 'ready')}
          />
        )}
      </div>
    </div>
  );
}

function BrowserHome({
  bookmarks,
  projects,
  blogs,
  onOpenUrl,
}: {
  bookmarks: { id: string; label: string; description: string; url: string; icon: string }[];
  projects: Array<{ id: string; name: string; thumbnail: string; description: string; liveUrl: string; tags: string[] }>;
  blogs: Array<{ id: string; title: string; date: string; thumbnail: string; excerpt: string }>;
  onOpenUrl: (url: string, title?: string) => void;
}) {
  return (
    <div className="hide-scrollbar h-full overflow-auto bg-white px-8 py-8 dark:bg-[#1f1f22]">
      <div className="mx-auto max-w-[1080px] space-y-10">
        <section className="rounded-[2rem] border border-black/6 bg-[linear-gradient(135deg,#f8fbff,#eef4ff)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(38,38,51,1),rgba(28,28,37,1))]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">Safari</p>
          <h1 className="mt-3 text-[42px] font-semibold tracking-[-0.04em] text-[#171717] dark:text-white">
            Start browsing inside the portfolio.
          </h1>
          <p className="mt-4 max-w-[640px] text-[17px] leading-7 text-black/65 dark:text-white/65">
            Open live projects, read articles, or jump into bookmarked links without leaving the macOS-style shell.
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[20px] font-semibold text-[#171717] dark:text-white">Favorites</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => onOpenUrl(bookmark.url, bookmark.label)}
                className="rounded-[1.6rem] border border-black/6 bg-white p-5 text-left shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 dark:border-white/10 dark:bg-[#24242a]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-black/[0.04] dark:bg-white/8">
                    <Image src={bookmark.icon} alt={bookmark.label} fill className="object-cover" sizes="44px" />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-[#171717] dark:text-white">{bookmark.label}</p>
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-6 text-black/62 dark:text-white/62">{bookmark.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[20px] font-semibold text-[#171717] dark:text-white">Featured Projects</h2>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onOpenUrl(project.liveUrl, project.name)}
                className="grid overflow-hidden rounded-[1.7rem] border border-black/6 bg-white text-left shadow-[0_18px_44px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 lg:grid-cols-[220px_1fr] dark:border-white/10 dark:bg-[#24242a]"
              >
                <div className="relative min-h-[190px]">
                  <Image src={project.thumbnail} alt={project.name} fill className="object-cover" sizes="(min-width: 1024px) 20vw, 100vw" />
                </div>
                <div className="flex min-h-[190px] flex-col p-5">
                  <h3 className="text-[24px] font-semibold text-[#171717] dark:text-white">{project.name}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-black/62 dark:text-white/62">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-medium text-black/62 dark:bg-white/8 dark:text-white/62"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-[#171717] dark:text-white">Latest Writing</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            {blogs.map((post) => (
              <button
                key={post.id}
                onClick={() => onOpenUrl(getBrowserBlogUrl(post.id), post.title)}
                className="overflow-hidden rounded-[1.6rem] border border-black/6 bg-white text-left shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 dark:border-white/10 dark:bg-[#24242a]"
              >
                <div className="relative h-44">
                  <Image src={post.thumbnail} alt={post.title} fill className="object-cover" sizes="(min-width: 1024px) 28vw, 100vw" />
                </div>
                <div className="p-5">
                  <p className="text-sm text-black/50 dark:text-white/52">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <h3 className="mt-3 text-[20px] font-semibold leading-[1.25] text-[#171717] dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-6 text-black/62 dark:text-white/62">{post.excerpt}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BrowserArticle({
  title,
  date,
  thumbnail,
  content,
  onBack,
}: {
  title: string;
  date: string;
  thumbnail: string;
  content: string[];
  onBack: () => void;
}) {
  return (
    <div className="hide-scrollbar h-full overflow-auto bg-white px-8 py-8 dark:bg-[#1f1f22]">
      <div className="mx-auto max-w-[880px]">
        <button
          onClick={onBack}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/6"
        >
          Back to start page
        </button>
        <article className="mt-6">
          <div className="relative h-72 overflow-hidden rounded-[1.8rem] border border-black/6 dark:border-white/10">
            <Image src={thumbnail} alt={title} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
          <p className="mt-6 text-[15px] text-black/55 dark:text-white/62">
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <h1 className="mt-2 text-[38px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#18181b] dark:text-white">
            {title}
          </h1>
          <div className="mt-6 space-y-5 text-[18px] leading-8 text-black/78 dark:text-white/78">
            {content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function BrowserWebView({
  title,
  url,
  status,
  onReady,
}: {
  title: string;
  url: string;
  status: 'loading' | 'ready' | 'blocked' | 'external-only';
  onReady: () => void;
}) {
  return (
    <div className="relative h-full bg-white dark:bg-[#111218]">
      {status === 'blocked' ? (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="rounded-[2rem] border border-black/8 bg-white px-8 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1f1f22]">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-black/35 dark:text-white/35">Embedding blocked</p>
            <h2 className="mt-3 text-[28px] font-semibold text-[#171717] dark:text-white">{title}</h2>
            <p className="mt-4 max-w-[520px] text-[16px] leading-7 text-black/62 dark:text-white/62">
              This site does not allow full embedding inside another page. You can still open it in the real browser or copy the link from here.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-white/12 dark:hover:bg-white/18"
              >
                <ExternalLink className="h-4 w-4" />
                Open in browser
              </button>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(url);
                  } catch {}
                }}
                className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.03] px-4 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/6 dark:text-white/75 dark:hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
                Copy link
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <iframe
            src={url}
            title={title}
            className="h-full w-full border-0"
            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={onReady}
          />
          {status === 'loading' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-sm dark:bg-[#111218]/74">
              <div className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-medium text-black/62 shadow-md dark:border-white/10 dark:bg-[#1f1f22] dark:text-white/72">
                Loading page...
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
