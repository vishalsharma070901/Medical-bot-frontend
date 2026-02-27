import type { Message } from "@/types";
import { create } from "zustand";

type Store = {
  token: string | null;
  setToken: (token: string | null) => void;

  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;

  sessionsVersion: number;
  refreshSessions: () => void;
};

const useStore = create<Store>((set) => ({
  token: null,
  setToken: (token) => set({ token }),

  messages: [],
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  sessionsVersion: 0,
  refreshSessions: () =>
    set((state) => ({ sessionsVersion: state.sessionsVersion + 1 })),
}));

export default useStore;