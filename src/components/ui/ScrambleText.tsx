import { useEffect, useRef, useState } from "react";

/**
 * "Decrypting" text reveal — the string first appears as cycling random cipher
 * glyphs, then resolves left-to-right into the real text, like a terminal
 * decrypting a payload. Fires once when the element scrolls into view.
 *
 * On-theme with the binary rain + typewriter: same monospace, same accent, pure
 * hacker aesthetic. Under prefers-reduced-motion it renders the final text
 * immediately with no scrambling.
 */
const CIPHER = "01<>/\\[]{}#%$&*+=-|_?ABCDEF0123456789";
const randGlyph = () => CIPHER[Math.floor(Math.random() * CIPHER.length)];

interface Props {
  text: string;
  className?: string;
  /** ms per newly-locked character (reveal cadence). */
  speed?: number;
}

export default function ScrambleText({ text, className, speed = 42 }: Props) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setDisplay(text);
      return;
    }

    let interval = 0;

    const run = () => {
      if (started.current) return;
      started.current = true;

      let frame = 0;
      const revealEvery = Math.max(1, Math.round(speed / 16)); // frames/char

      interval = window.setInterval(() => {
        frame += 1;
        const locked = Math.floor(frame / revealEvery);
        const next = text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < locked) return ch; // resolved
            return randGlyph(); // still scrambling
          })
          .join("");
        setDisplay(next);
        if (locked >= text.length) {
          setDisplay(text);
          window.clearInterval(interval);
        }
      }, 16);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
