import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContextMenuStore } from "@/store/useContextMenuStore";
import { clsx } from "clsx";

export function ContextMenu() {
  const { isOpen, position, items, close } = useContextMenuStore();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Adjusted position to prevent overflowing the screen
  const [adjustedPos, setAdjustedPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      const handleGlobalClick = (e: MouseEvent) => {
        // If click is outside the menu tree, close it
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          close();
        }
      };

      // Slight delay so the click that opened the menu doesn't immediately close it if attached incorrectly
      setTimeout(() => {
        window.addEventListener("click", handleGlobalClick);
        window.addEventListener("contextmenu", handleGlobalClick);
      }, 10);

      return () => {
        window.removeEventListener("click", handleGlobalClick);
        window.removeEventListener("contextmenu", handleGlobalClick);
      };
    }
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let x = position.x;
      let y = position.y;

      // Use standard bounding calculation, delayed slightly to let React render and prevent cascading renders
      requestAnimationFrame(() => {
        if (x + rect.width > window.innerWidth - 8) {
          x = window.innerWidth - rect.width - 8;
        }
        if (y + rect.height > window.innerHeight - 8) {
          y = window.innerHeight - rect.height - 8;
        }

        setAdjustedPos({ x, y });
      });
    }
  }, [isOpen, position]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: adjustedPos.x,
            top: adjustedPos.y,
            zIndex: 9999,
          }}
          className="w-64 min-w-[200px] overflow-hidden rounded-xl border border-white/20 bg-black/50 backdrop-blur-2xl shadow-2xl p-1"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col">
            {items.map((item, index) => {
              if (item.isDivider) {
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="my-1 h-[1px] w-full bg-white/10"
                  />
                );
              }

              const Icon = item.Icon;

              return (
                <button
                  key={`${item.id}-${index}`}
                  disabled={item.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.disabled && item.action) {
                      item.action();
                      close();
                    }
                  }}
                  className={clsx(
                    "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors",
                    item.disabled
                      ? "text-white/30 cursor-not-allowed"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 opacity-70" />}
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
