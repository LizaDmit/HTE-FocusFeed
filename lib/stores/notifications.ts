"use client";

import { create } from "zustand";

interface NotificationState {
  pendingCount: number;
  seen: boolean;
  setPendingCount: (count: number) => void;
  markSeen: () => void;
  hasUnseen: () => boolean;
}

export const useNotifications = create<NotificationState>((set, get) => ({
  pendingCount: 0,
  seen: true,
  setPendingCount: (count) => {
    const prev = get().pendingCount;
    set({
      pendingCount: count,
      seen: count === 0 || (count <= prev && get().seen),
    });
  },
  markSeen: () => set({ seen: true }),
  hasUnseen: () => get().pendingCount > 0 && !get().seen,
}));
