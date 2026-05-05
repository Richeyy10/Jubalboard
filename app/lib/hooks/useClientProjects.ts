// lib/hooks/useClientProjects.ts
import { useState, useEffect } from "react";
import type { DeskProject } from "@/app/data/myDeskData";

export function useClientProjects(statusFilter?: string) {
  const [projects, setProjects] = useState<DeskProject[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const tokenRes = await fetch("/api/auth/session/token");
        const { token } = await tokenRes.json();
        const headers = { Authorization: `Bearer ${token}` };

        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/v1/projects?${params.toString()}`, {
          headers,
          credentials: "include",
        });

        const json = await res.json();
        const list = json.data?.data ?? json.data ?? [];
        setTotal(json.data?.total ?? list.length);

        const mapped: DeskProject[] = list.map((p: any) => {
          const deadline = p.deadline ? new Date(p.deadline) : null;
          const dueLabel = deadline
            ? `Due ${deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
            : "No deadline";

          // Map API status to DeskProject status
          const statusMap: Record<string, DeskProject["status"]> = {
            IN_PROGRESS: "In Progress",
            COMPLETED: "Completed",
            REVISION: "Revision",
            ON_COLLAB: "On Collabs",
            DELIVERABLE_SUBMITTED: "In Progress",
            PARTIALLY_COMPLETED: "In Progress",
            PENDING_PAYMENT: "In Progress",
            ON_HOLD: "In Progress",
            DISPUTED: "In Progress",
          };

          const creativeAvatar =
            p.creative?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(p.creative?.name ?? "C")}&background=1a1a2e&color=fff&size=128`;

          return {
            id: p.id,
            title: p.title ?? p.brief?.jobTitle ?? "Untitled",
            thumbnail: p.brief?.referenceFileUrls?.[0] ?? "https://placehold.co/100x100/f0f0f0/999?text=Project",
            status: statusMap[p.status] ?? "In Progress",
            progress: p.status === "COMPLETED" ? 100 : p.status === "REVISION" ? 60 : 40,
            dueLabel,
            chatLabel: "Chat Creative",
            isCollab: false,
            assignee: {
              id: p.creative?.id ?? "",
              name: p.creative?.name ?? "Creative",
              avatar: creativeAvatar,
              isOnline: false,
            },
            client: {
              id: "",
              name: "",
              avatar: "",
              isOnline: false,
            },
          } as DeskProject;
        });

        setProjects(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [statusFilter]);

  return { projects, total, loading, error };
}