import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface UserInfo {
  nickname: string;
}

interface UserState {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),
    }),
    {
      name: 'user-store',
    }
  )
)