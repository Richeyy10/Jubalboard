"use client";

import { useState } from "react";
import Sidebar from "../../components/client/dashboard/sideBar";
import DashboardTopbar from "@/app/components/client/dashboard/dashboardTopbar";
import Breadcrumb from "../../components/client/my-desk/breadcrumb";
import Pagination from "../../components/client/my-desk/pagination";
import { Search, Filter, ChevronDown, X, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

type BriefStatus = "Active" | "Assigned" | "Expired" | "Closed";
type FilterTab = "All Briefs" | "Active" | "Assigned" | "Expired" | "Closed";

interface Brief {
  id: number;
  image: string;
  category: string;
  title: string;
  description: string;
  date: string;
  budget: string;
  status: BriefStatus;
}

const briefs: Brief[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=90&fit=crop", category: "Digital & Visual Arts", title: "Logo Design for Luxury Boutique", description: "Create a modern, minimalist logo. Include brand ....", date: "28th Dec 2026, 11:00am", budget: "$80–$100", status: "Active" },
  { id: 2, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=90&fit=crop", category: "Digital & Visual Arts", title: "Logo Design for Luxury Boutique", description: "Create a modern, minimalist logo. Include brand ....", date: "28th Dec 2026, 11:00am", budget: "$80–$100", status: "Assigned" },
  { id: 3, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=90&fit=crop", category: "Digital & Visual Arts", title: "Logo Design for Luxury Boutique", description: "Create a modern, minimalist logo. Include brand ....", date: "28th Dec 2026, 11:00am", budget: "$80–$100", status: "Expired" },
  { id: 4, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=90&fit=crop", category: "Digital & Visual Arts", title: "Logo Design for Luxury Boutique", description: "Create a modern, minimalist logo. Include brand ....", date: "28th Dec 2026, 11:00am", budget: "$80–$100", status: "Closed" },
  { id: 5, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=90&fit=crop", category: "Digital & Visual Arts", title: "Logo Design for Luxury Boutique", description: "Create a modern, minimalist logo. Include brand ....", date: "28th Dec 2026, 11:00am", budget: "$80–$100", status: "Active" },
];

const statusStyles: Record<BriefStatus, string> = {
  Active: "bg-yellow-100 text-yellow-700",
  Assigned: "text-green-500",
  Expired: "bg-red-100 text-red-400",
  Closed: "bg-gray-800 text-white",
};

const tabs: FilterTab[] = ["All Briefs", "Active", "Assigned", "Expired", "Closed"];

const MyBriefs: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All Briefs");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = briefs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "All Briefs" || b.status === activeTab;
    return matchSearch && matchTab;
  });

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

        <main className="flex-1 w-full px-4 lg:px-7 py-6 overflow-y-auto">
          <Breadcrumb crumbs={[
            { label: "Dashboard", path: "/client/dashboard" },
            { label: "My Briefs" },
          ]} />

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-heading font-extrabold text-black">Briefs</h1>
            <button onClick={() => router.push("/client/my-briefs/post")} className="bg-[#E05C5C] text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#d04f4f] transition-colors">
              Post a Brief
            </button>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2.5 border-[1.5px] border-gray-200 rounded-lg px-3.5 py-2.5 bg-white">
              <Search size={18} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="border-none outline-none flex-1 text-[13px] bg-transparent text-black placeholder:text-gray-400"
              />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#E05C5C]">
              <Filter size={15} className="text-[#E05C5C]" />
              Filter By
              <ChevronDown size={12} className="text-[#E05C5C]" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#E05C5C] text-white"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Brief Cards */}
          <div className="flex flex-col gap-4">
            {filtered.length === 0 ? (
              <p className="text-black text-sm text-center mt-10">No briefs found.</p>
            ) : (
              filtered.map((brief) => (
                <div key={brief.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <img
                    src={brief.image}
                    alt={brief.title}
                    className="w-24 h-20 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs bg-gray-100 text-black px-2 py-0.5 rounded-full">
                      {brief.category}
                    </span>
                    <h3 className="font-bold text-black mt-1 text-[15px]">{brief.title}</h3>
                    <p className="text-sm text-black mt-0.5 truncate">{brief.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-black">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                        </svg>
                        {brief.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        {brief.budget}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[brief.status]}`}>
                      {brief.status}
                    </span>
                    <button onClick={() => router.push("/client/my-briefs/")} className="flex items-center gap-1.5 bg-[#E05C5C] text-white text-sm px-4 py-2 rounded-lg">
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={25}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
          />
        </main>
      </div>
    </div>
  );
};

export default MyBriefs;