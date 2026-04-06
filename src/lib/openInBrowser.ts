'use client';

import { useWindowStore } from '@/store/useWindowStore';
import { isHttpUrl, isInternalBrowserUrl, isNativeExternalProtocol, normalizeBrowserUrl } from './browser';

export function openInBrowser(url: string, options?: { title?: string }) {
  const normalizedUrl = normalizeBrowserUrl(url);

  if (isInternalBrowserUrl(normalizedUrl) || isHttpUrl(normalizedUrl)) {
    useWindowStore.getState().openBrowserWindow(normalizedUrl, options);
    return;
  }

  if (typeof window !== 'undefined') {
    if (isNativeExternalProtocol(normalizedUrl)) {
      window.location.href = normalizedUrl;
      return;
    }

    window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
  }
}
