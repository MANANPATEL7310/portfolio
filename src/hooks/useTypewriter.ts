import { useEffect, useState } from "react";

interface TypewriterOptions {
  /** ms per character while typing */
  speed?: number;
  /** ms to wait before the first character appears */
  startDelay?: number;
}

/**
 * Types out `text` one character at a time.
 * Returns the currently-typed substring and whether typing has finished.
 * Respects prefers-reduced-motion by rendering the full string instantly.
 */
export function useTypewriter(
  text: string,
  { speed = 45, startDelay = 350 }: TypewriterOptions = {}
): { typed: string; done: boolean } {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setTyped(text);
      setDone(true);
      return;
    }

    setTyped("");
    setDone(false);

    let index = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setTyped(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { typed, done };
}
