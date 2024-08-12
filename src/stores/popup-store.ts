import { create } from "zustand";

interface UsePopupStore {
  currentVideo?: string;
}

export const usePopupStore = create<UsePopupStore>(() => ({
  currentVideo: undefined,
}));
