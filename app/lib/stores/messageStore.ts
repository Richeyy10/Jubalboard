import { create } from "zustand";
import { Conversation } from "@/app/types";

type MessageStore = {
  activeConversation: Conversation | null;
  setActiveConversation: (c: Conversation) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  activeConversation: null,
  setActiveConversation: (c) => set({ activeConversation: c }),
}));