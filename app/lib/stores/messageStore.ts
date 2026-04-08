import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Conversation, Message } from "@/app/types";

type MessageStore = {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  addOrUpdateConversation: (convo: Conversation) => void;
  sendMessage: (conversationId: string, text: string) => void;
};

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      conversations: [],
      activeConversationId: null,

      setActiveConversation: (id) =>
        set({ activeConversationId: id }),

      addOrUpdateConversation: (convo) =>
        set((state) => {
          const exists = state.conversations.find((c) => c.id === convo.id);
          if (exists) {
            return {
              conversations: state.conversations.map((c) =>
                c.id === convo.id
                  ? { ...c, isOnline: convo.isOnline, members: convo.members }
                  : c
              ),
            };
          }
          return { conversations: [convo, ...state.conversations] };
        }),

      sendMessage: (conversationId, text) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: Date.now().toString(),
                      text,
                      fromMe: true,
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                  ],
                  lastMessage: text,
                  lastTime: "Now",
                }
              : c
          ),
        })),
    }),
    {
      name: "jubalboard-messages",
      storage: createJSONStorage(() => localStorage),
    }
  )
);