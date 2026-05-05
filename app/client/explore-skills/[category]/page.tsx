"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/client/dashboard/sideBar";
import DashboardTopbar from "@/app/components/client/dashboard/dashboardTopbar";
import { Search, SlidersHorizontal, ChevronDown, BadgeCheck, X } from "lucide-react";
import { findGigsServices, suggestedCreatives } from "@/app/data";
import Breadcrumb from "@/app/components/client/my-desk/breadcrumb";
import Image from "next/image";
import Link from "next/link";

const filterChips = ["All", "Recent", "$100-$200", "Graphic Designers", "Logo Design", "Posters", "Brand Identity", "Packaging"];

// Group creatives by category/role for the sliders
const creativeGroups = [
    { label: "Logo Design", creatives: suggestedCreatives },
    { label: "Recommended", creatives: suggestedCreatives },
    { label: "Verified", creatives: suggestedCreatives.filter(c => c.verified) },
];

interface CreativeCardProps {
    name: string;
    role: string;
    rating: number;
    avatar: string;
    portfolioImg: string;
    verified?: boolean;
    premium?: boolean;
}

const CreativeCard: React.FC<CreativeCardProps> = ({ name, role, rating, avatar, portfolioImg, verified, premium }) => (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex-shrink-0 w-[200px] lg:w-[220px]">
        {/* Portfolio image */}
        <div className="relative h-32 bg-gray-100">
            <img src={portfolioImg} alt={name} className="w-full h-full object-cover" />
            {premium && (
                <span className="absolute top-2 right-2 bg-orange-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Premium
                </span>
            )}
        </div>

        {/* Info */}
        <div className="p-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <p className="text-xs font-semibold text-gray-900 leading-tight">{name}</p>
                            {verified && <BadgeCheck fill="blue" stroke="white" size={11} />}
                        </div>
                        <p className="text-[10px] text-gray-500">{role}</p>
                    </div>
                </div>
                {/* Chat button */}
                <button className="w-7 h-7 rounded-full bg-[#1c1c3a] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Rating */}
            <div className="w-[50%] mx-auto flex items-center gap-1 mb-2">
                <svg viewBox="0 0 20 20" fill="#F5A623" className="w-3 h-3">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-gray-800">{rating.toFixed(1)}</span>
            </div>

            <div className="text-center">
                <Link href={`/client/explore-skills/creative-profile`}>
                    <span className="text-xs text-red-500 font-semibold hover:underline cursor-pointer">
                        View Profile
                    </span>
                </Link>
            </div>
        </div>
    </div>
);

const CategoryGigsPage: React.FC = () => {
    const params = useParams();
    const category = decodeURIComponent(params.category as string);

    const [activeChip, setActiveChip] = useState("All");
    const [search, setSearch] = useState("");
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
                    <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
                <div className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-10`}>
                    <button className="absolute top-4 right-4 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X size={22} />
                    </button>
                    <Sidebar activeItem="Hire A Pro" />
                </div>

                <main className="flex-1 w-full px-4 lg:px-7 py-6 overflow-y-auto">
                    <Breadcrumb crumbs={[
                        { label: "Dashboard", path: "/client/dashboard" },
                        { label: "Hire A Pro", path: "/client/explore-skills" },
                        { label: category },
                    ]} />

                    <h1 className="text-2xl font-bold text-gray-900 mb-5">Hire A Pro</h1>

                    {/* Search + Filter */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            <SlidersHorizontal size={15} className="text-red-400" />
                            Filter By
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* Filter chips */}
                    <div className="flex items-center gap-2 mb-7 flex-wrap">
                        {filterChips.map((chip) => (
                            <button
                                key={chip}
                                onClick={() => setActiveChip(chip)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeChip === chip ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* Services */}
                    <div className="mb-8 bg-[#fafafa] p-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Services ({findGigsServices.length})
                        </h2>
                        <div className="flex gap-3.5 overflow-x-auto pb-1 scroll-smooth">
                            {findGigsServices.map((service) => (
                                <div key={service.label} className="relative rounded-lg overflow-hidden h-[300px] flex-shrink-0 cursor-pointer group">
                                    <Image src={service.bg} alt={service.label} width={300} height={300} className="w-[300px] h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="absolute bottom-0 left-0 right-0 h-[20%] flex items-center justify-center px-3 bg-[#1c1c3a]">
                                        <p className="text-white font-semibold text-sm">{service.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Creative groups with horizontal sliders */}
                    {creativeGroups.map((group) => (
                        <div key={group.label} className="bg-[#fafafa] p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{group.label}</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
                                {group.creatives
                                    .filter(c =>
                                        search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((creative, i) => (
                                        <CreativeCard key={i} {...creative} />
                                    ))}
                            </div>
                        </div>
                    ))}

                </main>
            </div>
        </div>
    );
};

export default CategoryGigsPage;