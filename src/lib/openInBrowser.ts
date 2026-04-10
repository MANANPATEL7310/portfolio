'use client';

import { isInternalBrowserUrl, isNativeExternalProtocol, normalizeBrowserUrl } from './browser';

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
      window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (isInternalBrowserUrl(normalizedUrl)) {
      launchExternalBrowser('/');
      return;
    }

    window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
  }
}
