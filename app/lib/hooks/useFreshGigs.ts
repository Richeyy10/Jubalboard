import { useEffect, useState } from "react";
import { FreshGig } from "@/app/types";

type UseBriefOptions = {
  categoryId?: string;
  limit?: number;
};

function mapBriefToGig(brief: any): FreshGig {
  return {
    id: brief.id,
    title: brief.jobTitle ?? "Untitled",
    category: brief.category?.name ?? "General",
    budget: brief.budgetMin != null && brief.budgetMax != null
      ? `${brief.currency ?? ""}${brief.budgetMin.toLocaleString()} - ${brief.currency ?? ""}${brief.budgetMax.toLocaleString()}`
      : "—",
    timeline: brief.timeline ?? "—",
    description: brief.jobDescription ?? "",
    image: brief.referenceFileUrls?.[0] ?? undefined,
    isPremium: brief.client?.isHighValue ?? false,
    deliveryDate: brief.deliveryDate ?? "",
    currency: brief.currency ?? "USD",
    skills: brief.skills?.map((s: any) => s.name).join(", ") ?? "",
    postedBy: {
      name: brief.client?.name ?? "Client",
      avatar:
        brief.client?.avatarUrl ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(brief.client?.name ?? "Client")}&background=1a1a2e&color=fff&size=128`,
      verified: brief.client?.isHighValue ?? false,
    },
  };
}

export function useFreshGigs({ categoryId, limit = 20 }: UseBriefOptions = {}) {
  const [gigs, setGigs] = useState<FreshGig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBriefs = async () => {
      setLoading(true);
      setError(null);
      try {
        const tokenRes = await fetch("/api/auth/session/token");
        const { token } = await tokenRes.json();
        const headers = { Authorization: `Bearer ${token}` };

        const params = new URLSearchParams();
        if (categoryId) params.set("categoryId", categoryId);
        params.set("limit", String(limit));

        const res = await fetch(`/api/v1/briefs?${params.toString()}`, { headers, credentials: "include" });
        const json = await res.json();
        console.log("Raw brief response:", JSON.stringify(json.data?.[0], null, 2));
        const list = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];

        setGigs(list.map(mapBriefToGig));
      } catch {
        setError("Failed to load briefs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBriefs();
  }, [categoryId, limit]);

  return { gigs, loading, error };
}