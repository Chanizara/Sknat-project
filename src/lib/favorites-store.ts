'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '@/types/property';

const MAX_FAVORITES = 3;

interface FavoritesStore {
  favorites: Property[];
  addFavorite: (property: Property) => boolean;
  removeFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
  canAddMore: () => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (property: Property) => {
        const { favorites } = get();
        
        // ตรวจสอบว่ามีอยู่แล้วหรือไม่
        if (favorites.some(fav => fav.id === property.id)) {
          return false;
        }
        
        // ตรวจสอบว่าเต็ม 3 หลังแล้วหรือยัง
        if (favorites.length >= MAX_FAVORITES) {
          return false;
        }
        
        set({ favorites: [...favorites, property] });
        return true;
      },
      
      removeFavorite: (propertyId: number) => {
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== propertyId)
        }));
      },
      
      isFavorite: (propertyId: number) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === propertyId);
      },
      
      canAddMore: () => {
        const { favorites } = get();
        return favorites.length < MAX_FAVORITES;
      }
    }),
    {
      name: 'sknat-favorites-storage',
    }
  )
);
