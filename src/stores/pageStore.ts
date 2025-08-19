import { create } from 'zustand'


interface BaseInfo {
  title: string;
  description?: string;
}

interface PageState {
  baseInfo: BaseInfo;
  setBaseInfo: (info: BaseInfo) => void;
}

export const usePageStore = create<PageState>()((set) => ({
  baseInfo: { title: '', description: '' },
  setBaseInfo: (info) => set({ baseInfo: info }),
}))