import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  setisCollapsed: (open: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isCollapsed: false,
  setisCollapsed: (open) => set({ isCollapsed: open }),
}));
