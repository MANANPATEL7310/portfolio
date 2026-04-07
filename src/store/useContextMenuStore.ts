import { create } from "zustand";
import type { ElementType } from "react";

export interface ContextMenuItem {
  id: string;
  label: string;
  action?: () => void;
  isDivider?: boolean;
  disabled?: boolean;
  Icon?: ElementType;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuStore {
  isOpen: boolean;
  position: ContextMenuPosition;
  items: ContextMenuItem[];
  targetId: string | undefined;
  open: (position: ContextMenuPosition, items: ContextMenuItem[], targetId?: string) => void;
  close: () => void;
}

export const useContextMenuStore = create<ContextMenuStore>((set) => ({
  isOpen: false,
  position: { x: 0, y: 0 },
  items: [],
  targetId: undefined,

  open: (position, items, targetId) => {
    set({
      isOpen: true,
      position,
      items,
      targetId,
    });
  },

  close: () => {
    set({ isOpen: false });
  },
}));
