import { create } from 'zustand'

type AppState = {
  mobileOpen: boolean
  focusMode: boolean
  setMobileOpen: (open: boolean) => void
  toggleFocusMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  mobileOpen: false,
  focusMode: false,
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
}))
