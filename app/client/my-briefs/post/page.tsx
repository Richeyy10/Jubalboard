"use client";

import { useState } from "react";
import Sidebar from "../../../components/client/dashboard/sideBar";
import DashboardTopbar from "@/app/components/client/dashboard/dashboardTopbar";
import { X } from "lucide-react";
import PostBriefForm from "@/app/components/client/my-briefs/postBriefForm";

const PostBriefPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <DashboardTopbar
        userName="Charles Eden"
        userAvatar="https://i.pravatar.cc/150?img=33"
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={`
            fixed top-0 left-0 h-full z-40
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-10
          `}
        >
          <button
            className="absolute top-4 right-4 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
          <Sidebar activeItem="My Briefs" />
        </div>
        <main className="flex-1 w-full px-4 lg:px-7 py-6 overflow-y-auto pb-28">
          <PostBriefForm />
        </main>
      </div>
    </div>
  );
};

export default PostBriefPage;