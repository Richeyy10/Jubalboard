"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMessageStore } from "../../../lib/stores/messageStore";
import Sidebar from "@/app/components/creative/dashboard/sideBar";
import DashboardTopbar from "@/app/components/creative/dashboard/dashboardTopbar";
import ConversationList from "@/app/components/creative/messages/conversationList";
import { X } from "lucide-react";
import ChatWindow from "@/app/components/creative/messages/chatWindow";

export default function ConversationPage() {
  const { conversationId } = useParams();
  const router = useRouter();
  const { conversations, setActiveConversation } = useMessageStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId as string);
    }
  }, [conversationId]);

  const conversation = conversations.find((c) => c.id === conversationId);
  if (!conversation) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">

      {/* Topbar — fixed height, never scrolls */}
      <div className="flex-shrink-0">
        <DashboardTopbar
          userName="Natasha John"
          userAvatar="https://i.pravatar.cc/150?img=47"
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Everything below topbar */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* App Sidebar */}
        <div
          className={`
          fixed top-0 left-0 h-full z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-full lg:z-10
        `}
        >
          <button
            className="absolute top-4 right-4 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
          <Sidebar activeItem="Messages" />
        </div>

        {/* Messages layout */}
        <div className="flex flex-1 overflow-hidden mt-[100px] min-h-0">

          {/* Conversation list */}
          <div className="hidden lg:flex w-72 xl:w-80 border-r border-gray-200 flex-col flex-shrink-0 overflow-hidden">
            {/* 👇 this header was missing/hidden */}
            <div className="px-4 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              <ConversationList />
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <ChatWindow
              conversation={conversation}
              onBack={() => router.push("/creative/messages")}
            />
          </div>

        </div>
      </div>
    </div>
  );
}