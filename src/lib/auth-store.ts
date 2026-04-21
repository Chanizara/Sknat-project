'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthStore {
  user: User | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'sknat-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
