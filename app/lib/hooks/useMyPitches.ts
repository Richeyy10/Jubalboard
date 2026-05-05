import { useState, useEffect, useCallback } from "react";
import { CreativePitch } from "@/app/types";

const ALL_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export function useMyPitches() {
  const [pitches, setPitches] = useState<CreativePitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPitches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenRes = await fetch("/api/auth/session/token");
      const { token } = await tokenRes.json();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const results = await Promise.all(
        ALL_STATUSES.map((status) =>
          fetch(`/api/v1/pitches/me?status=${status}`, {
            credentials: "include",
            headers,
          }).then((r) => r.json())
        )
      );

      const list = results.flatMap((data) =>
        Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : []
      );

      const mapped: CreativePitch[] = list.map((p) => ({
        id: p.id,
        gigTitle: p.brief?.jobTitle ?? "Untitled",
        category: "—",
        budget: p.brief?.budgetMin
          ? `$${p.brief.budgetMin.toLocaleString()} - $${p.brief.budgetMax.toLocaleString()}`
          : `$${p.proposedAmount.toLocaleString()}`,
        timeline: p.deliveryDate
          ? new Date(p.deliveryDate).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            })
          : "—",
        description: p.coverNote ?? "",
        image: "",
        sentAt: new Date(p.createdAt).toLocaleString("en-GB", {
          day: "numeric", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
        status: p.status.toLowerCase() as CreativePitch["status"],
        client: {
          id: "",
          name: "Client",
          avatar: `https://ui-avatars.com/api/?name=CL&background=1a1a2e&color=fff&size=128`,
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
    fetchPitches();
  }, [fetchPitches]);

  return { pitches, loading, error };
}