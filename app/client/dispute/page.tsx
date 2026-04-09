"use client";
import Sidebar from "@/app/components/client/dashboard/sideBar";
import DashboardTopbar from "@/app/components/client/dashboard/dashboardTopbar";
import DisputesContent from "@/app/components/client/dispute/disputesContent";
import { useState } from "react";
import { X } from "lucide-react";

const HelpSupportPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <DashboardTopbar
        userName="Natasha John"
        userAvatar="https://i.pravatar.cc/150?img=47"
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:sticky lg:h-screen`}
        >
          <button
            className="absolute top-4 right-4 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>

          <Sidebar activeItem="Help & Support" />
        </div>

        <main className="flex-1 px-4 lg:px-7 py-6">
          <DisputesContent />
        </main>
      </div>
    </div>
  );
};

export default HelpSupportPage;