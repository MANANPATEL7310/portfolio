'use client';

import { BROWSER_HOME_URL, isInternalBrowserUrl, isNativeExternalProtocol, normalizeBrowserUrl } from './browser';

export function launchExternalBrowser(startUrl = 'about:blank') {
  if (typeof window === 'undefined') {
    return;
  }

  window.open(startUrl, '_blank', 'noopener,noreferrer');
}

export function openInBrowser(url: string, options?: { title?: string }) {
  void options;
  const normalizedUrl = normalizeBrowserUrl(url);

  if (typeof window !== 'undefined') {
    if (isNativeExternalProtocol(normalizedUrl)) {
      window.location.href = normalizedUrl;
      return;
    }

    if (isInternalBrowserUrl(normalizedUrl)) {
      launchExternalBrowser(normalizedUrl === BROWSER_HOME_URL ? 'about:blank' : '/');
      return;
    }

    window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
  }
}
