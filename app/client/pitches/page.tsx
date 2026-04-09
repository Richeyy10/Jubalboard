"use client";

import { useState } from "react";
import Sidebar from "../../components/client/dashboard/sideBar";
import DashboardTopbar from "@/app/components/client/dashboard/dashboardTopbar";
import Breadcrumb from "../../components/client/my-desk/breadcrumb";
import { Search, Filter, ChevronDown, X, Star, MessageCircle } from "lucide-react";

type PitchFilter = "All" | "Verified" | "Premium" | "Recommended" | "$50–$100";

interface Pitch {
  id: number;
  avatar: string;
  name: string;
  role: string;
  rating: number;
  rate: string;
  projects: number;
  isPremium?: boolean;
  isVerified?: boolean;
  isOnline?: boolean;
}

const pitches: Pitch[] = [
  { id: 1, avatar: "https://i.pravatar.cc/150?img=47", name: "Natasha John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isPremium: true, isVerified: true, isOnline: true },
  { id: 2, avatar: "https://i.pravatar.cc/150?img=48", name: "Ruth John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 3, avatar: "https://i.pravatar.cc/150?img=12", name: "Dennis Mark", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 4, avatar: "https://i.pravatar.cc/150?img=23", name: "Melissa John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 5, avatar: "https://i.pravatar.cc/150?img=15", name: "Joshua John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 6, avatar: "https://i.pravatar.cc/150?img=32", name: "Jessica John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 7, avatar: "https://i.pravatar.cc/150?img=18", name: "Gabriel John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 8, avatar: "https://i.pravatar.cc/150?img=52", name: "David John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 9, avatar: "https://i.pravatar.cc/150?img=44", name: "Mary John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 10, avatar: "https://i.pravatar.cc/150?img=25", name: "Mariam John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 11, avatar: "https://i.pravatar.cc/150?img=60", name: "Josiah John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
  { id: 12, avatar: "https://i.pravatar.cc/150?img=55", name: "Paul John", role: "Graphic Designer", rating: 5.0, rate: "$300", projects: 12, isVerified: true, isOnline: true },
];

const filterTabs: PitchFilter[] = ["All", "Verified", "Premium", "Recommended", "$50–$100"];

const IncomingPitches: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<PitchFilter>("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = pitches.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Verified" && p.isVerified) ||
      (activeFilter === "Premium" && p.isPremium);
    return matchSearch && matchFilter;
  });

  const visible = filtered.slice(0, visibleCount);

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
          <Sidebar activeItem="Pitches" />
        </div>

        <main className="flex-1 w-full px-4 lg:px-7 py-6 overflow-y-auto">
          <Breadcrumb crumbs={[
            { label: "Dashboard", path: "/client/dashboard" },
            { label: "Hire a Pro", path: "/client/hire" },
            { label: "Incoming Pitches" },
          ]} />

          <h1 className="text-2xl font-heading font-extrabold text-black mb-5">Incoming Pitches</h1>

          {/* Search + Filter */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2.5 border-[1.5px] border-gray-200 rounded-lg px-3.5 py-2.5 bg-white">
              <Search size={18} className="text-black" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search creative or services"
                className="border-none outline-none flex-1 text-[13px] bg-transparent text-black placeholder:text-black"
              />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#E05C5C]">
              <Filter size={15} className="text-[#E05C5C]" />
              Filter By
              <ChevronDown size={12} className="text-[#E05C5C]" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === tab
                    ? "bg-[#E05C5C] text-white"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Pitch Grid */}
          <div className="bg-[#fafafa] border border-gray-100 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y divide-x-0 md:divide-x divide-gray-100">
              {visible.map((pitch) => (
                <div key={pitch.id} className="bg-white m-4 p-4 flex items-start gap-3 border-b border-gray-100">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={pitch.avatar}
                      alt={pitch.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {pitch.isOnline && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900 text-sm">{pitch.name}</span>
                        {pitch.isVerified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        )}
                        {pitch.isPremium && (
                          <span className="bg-[#E05C5C] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                      <button className="w-8 h-8 rounded-full bg-[#1E2A3B] flex items-center justify-center shrink-0">
                        <MessageCircle size={14} className="text-white" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{pitch.role}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        {pitch.rating.toFixed(1)}
                      </span>
                      <span className="font-medium text-gray-700">{pitch.rate}</span>
                      <span>{pitch.projects} Completed Projects</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-xs text-[#E05C5C] font-medium hover:underline">
                        View Profile
                      </button>
                      <button className="text-xs text-[#E05C5C] font-medium hover:underline">
                        See Pitch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((v) => v + 12)}
                className="bg-[#E05C5C] text-white font-semibold px-12 py-3.5 rounded-xl hover:bg-[#d04f4f] transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default IncomingPitches;