export const BROWSER_HOME_URL = 'portfolio://home';
export const BROWSER_BLOG_PREFIX = 'portfolio://blog/';

export function getBrowserBlogUrl(blogId: string) {
  return `${BROWSER_BLOG_PREFIX}${blogId}`;
}

export function parseBrowserUrl(url: string):
  | { kind: 'home' }
  | { kind: 'blog'; blogId: string }
  | { kind: 'external' } {
  if (url === BROWSER_HOME_URL) {
    return { kind: 'home' };
  }

  if (url.startsWith(BROWSER_BLOG_PREFIX)) {
    return { kind: 'blog', blogId: url.replace(BROWSER_BLOG_PREFIX, '') };
  }

  return { kind: 'external' };
}

export function isHttpUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function isInternalBrowserUrl(url: string) {
  return url.startsWith('portfolio://');
}

export function isNativeExternalProtocol(url: string) {
  return /^(mailto|tel|sms):/i.test(url);
}

export function normalizeBrowserUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return BROWSER_HOME_URL;
  }

  if (isInternalBrowserUrl(trimmed) || isNativeExternalProtocol(trimmed) || isHttpUrl(trimmed)) {
    return trimmed;
  }

  if (/^[a-zA-Z]+:/.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function getBrowserDisplayTitle(url: string, fallback = 'Safari') {
  const parsed = parseBrowserUrl(url);

  if (parsed.kind === 'home') {
    return 'Start Page';
  }

  if (parsed.kind === 'blog') {
    return 'Article';
  }

  try {
    const target = new URL(url);
    return target.hostname.replace(/^www\./, '');
  } catch {
    return fallback;
  }
}
