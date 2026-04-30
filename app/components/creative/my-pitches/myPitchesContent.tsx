"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import Breadcrumb from "@/app/components/creative/dashboard/breadcrumb";
import PitchCard from "./pitchCard";
import { CreativePitch } from "@/app/types";

interface ApiPitch {
  id: string;
  briefId: string;
  creativeId: string;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  status: string;
  brief: {
    id: string;
    title: string;
    budget: number;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

const filterChips = ["All Pitches", "Approved", "Pending", "Ongoing"];
const PAGE_SIZE = 6;

const chipToStatus: Record<string, string | null> = {
  "All Pitches": null,
  Approved: "APPROVED",
  Pending: "PENDING",
  Ongoing: "ONGOING",
};

const MyPitchesContent: React.FC = () => {
  const [activeChip, setActiveChip] = useState("All Pitches");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pitches, setPitches] = useState<CreativePitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPitches = useCallback(async (status: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const tokenRes = await fetch("/api/auth/session/token");
      const { token } = await tokenRes.json();

      const params = new URLSearchParams();
      if (status) params.set("status", status);
      else params.set("status", "");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pitches/me?${params.toString()}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch pitches (${res.status})`);

      const data = await res.json();


      // Handle whatever shape the API returns
      const list: ApiPitch[] = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.pitches)
        ? data.pitches
        : [];

      const mapped: CreativePitch[] = list.map((p) => ({
        id: p.id,
        gigTitle: p.brief.title,
        category: "—",
        budget: `₦${p.brief.budget.toLocaleString()}`,
        timeline: p.estimatedDuration,
        description: p.coverLetter,
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
        sentAt: new Date(p.createdAt).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: p.status.toLowerCase() as CreativePitch["status"],
        client: {
          id: "",
          name: "Client",
          avatar: "https://i.pravatar.cc/150?img=1",
          verified: false,
          isOnline: false,
        },
      }));

      setPitches(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const status = chipToStatus[activeChip];
    fetchPitches(status);
    setVisibleCount(PAGE_SIZE);
  }, [activeChip, fetchPitches]);

  const filtered = pitches.filter((pitch) =>
    pitch.gigTitle.toLowerCase().includes(search.toLowerCase())
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: "Dashboard", path: "/creative/dashboard" },
          { label: "My Pitches" },
        ]}
      />
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-5">
        My Pitches
      </h1>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
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
      <div className="flex items-center gap-2 mb-6">
        {filterChips.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setActiveChip(chip);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`px-2 lg:px-5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors ${
              activeChip === chip
                ? "bg-red-500 font-body text-white"
                : "bg-gray-100 font-body text-gray-600 hover:bg-gray-200"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <p className="text-sm text-gray-400 text-center py-12">
          Loading pitches…
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500 text-center py-12">{error}</p>
      )}

      {!loading && !error && (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            All ({filtered.length})
          </h2>

          <div className="bg-[#fafafa] p-2 lg:p-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((pitch) => (
              <PitchCard key={pitch.id} pitch={pitch} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-12">
              No pitches found.
            </p>
          )}

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="bg-red-500 hover:bg-red-600 text-white font-heading font-semibold px-12 py-3 rounded-lg transition-colors text-sm"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPitchesContent;