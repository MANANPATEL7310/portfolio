import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Adrian's Portfolio",
  description: "A macOS-inspired portfolio built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`(() => {
  try {
    const storedSystemState = window.localStorage.getItem('macos-portfolio.system');
    const parsedState = storedSystemState ? JSON.parse(storedSystemState) : null;
    const storedTheme = parsedState?.state?.theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = storedTheme === 'system'
      ? systemTheme
      : storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : 'light';
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    document.body && (document.body.dataset.theme = theme);
  } catch (error) {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
})();`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
