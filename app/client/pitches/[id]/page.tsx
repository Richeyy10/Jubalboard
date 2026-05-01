"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/client/dashboard/sideBar";
import DashboardTopbar from "@/app/components/client/dashboard/dashboardTopbar";
import Breadcrumb from "@/app/components/client/my-desk/breadcrumb";
import {
  X, Loader2, Star, Clock, ChevronLeft,
  BadgeCheck, CheckCircle, XCircle, Calendar,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  notes?: string;
  description?: string;
}

interface Pitch {
  id: string;
  briefId: string;
  creativeId: string;
  coverNote: string;
  proposedAmount: number;
  currency: string;
  deliveryDate: string;
  status: string;
  paymentMode: string;
  isCollaborative: boolean;
  createdAt: string;
  milestones: Milestone[];
  brief: {
    id: string;
    jobTitle: string;
    description?: string;
    budgetMin: number;
    budgetMax: number;
    currency: string;
    deadline?: string;
    status: string;
  };
  creative: {
    id: string;
    name: string;
    avatarUrl: string | null;
    averageRating: number;
    completedProjects: number;
  };
}

type ClientProfile = {
  name: string;
  clientProfile: { fullName: string; imageUrl: string | null };
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatBudget(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${amount?.toLocaleString() ?? "—"}`;
}

const ConfirmModal: React.FC<{
  type: "accept" | "reject";
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}> = ({ type, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl px-8 py-8 w-[90%] max-w-sm flex flex-col items-center text-center shadow-2xl">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type === "accept" ? "bg-green-100" : "bg-red-100"}`}>
        {type === "accept"
          ? <CheckCircle size={36} className="text-green-500" />
          : <XCircle size={36} className="text-red-500" />
        }
      </div>
      <h2 className="text-lg font-bold text-black mb-2">
        {type === "accept" ? "Accept this Pitch?" : "Reject this Pitch?"}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {type === "accept"
          ? "Accepting this pitch will create a project and notify the creative to get started."
          : "The creative will be notified that their pitch was not selected."
        }
      </p>
      <div className="flex gap-3 w-full">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            type === "accept" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Processing..." : type === "accept" ? "Yes, Accept" : "Yes, Reject"}
        </button>
      </div>
    </div>
  </div>
);

const PitchDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<"accept" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tokenRes = await fetch("/api/auth/session/token");
        const { token } = await tokenRes.json();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [pitchRes, profileRes] = await Promise.all([
          fetch(`/api/v1/pitches/${id}`, { headers, credentials: "include" }),
          fetch("/api/v1/clients/me", { headers, credentials: "include" }),
        ]);

        const pitchJson = await pitchRes.json();
        const profileJson = await profileRes.json();

        setPitch(pitchJson.data ?? pitchJson);
        setProfile(profileJson.data ?? profileJson);
      } catch {
        setError("Failed to load pitch details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAction = async (type: "accept" | "reject") => {
    setActionLoading(true);
    try {
      const tokenRes = await fetch("/api/auth/session/token");
      const { token } = await tokenRes.json();

      const res = await fetch(`/api/v1/pitches/${id}/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to ${type} pitch.`);
      }

      setConfirmModal(null);
      setActionSuccess(type === "accept" ? "Pitch accepted! A project has been created." : "Pitch rejected.");
      setPitch((prev) => prev ? { ...prev, status: type === "accept" ? "ACCEPTED" : "REJECTED" } : prev);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
      setConfirmModal(null);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#E05C5C]" size={40} />
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white">
        <p className="text-gray-500">Pitch not found.</p>
        <button onClick={() => router.push("/client/pitches")} className="mt-4 text-[#E05C5C] text-sm font-semibold">
          ← Back to Pitches
        </button>
      </div>
    );
  }

  const userName = profile?.clientProfile?.fullName || profile?.name || "Client";
  const userAvatar =
    profile?.clientProfile?.imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1a1a2e&color=fff&size=128`;

  const creativeAvatar =
    pitch.creative?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(pitch.creative?.name ?? "C")}&background=1a1a2e&color=fff&size=128`;

  const isPending = pitch.status === "PENDING";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {confirmModal && (
        <ConfirmModal
          type={confirmModal}
          onConfirm={() => handleAction(confirmModal)}
          onCancel={() => setConfirmModal(null)}
          loading={actionLoading}
        />
      )}

      <DashboardTopbar
        userName={userName}
        userAvatar={userAvatar}
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div
          className={`
            fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-10
          `}
        >
          <button className="absolute top-4 right-4 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
          <Sidebar activeItem="Pitches" />
        </div>

        <main className="flex-1 w-full px-4 lg:px-7 py-6 overflow-y-auto">
          <Breadcrumb crumbs={[
            { label: "Dashboard", path: "/client/dashboard" },
            { label: "Incoming Pitches", path: "/client/pitches" },
            { label: "Pitch Details" },
          ]} />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/client/pitches")}
                className="p-2 rounded-lg text-black border border-black hover:bg-black hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-heading font-extrabold text-black">Pitch Details</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  For: <span className="font-semibold text-black">{pitch.brief?.jobTitle ?? "—"}</span>
                </p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              pitch.status === "ACCEPTED"
                ? "bg-green-100 text-green-600"
                : pitch.status === "REJECTED"
                  ? "bg-red-100 text-red-500"
                  : "bg-yellow-100 text-yellow-600"
            }`}>
              {pitch.status}
            </span>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
              {error}
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}

          {actionSuccess && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
              {actionSuccess}
              <button onClick={() => setActionSuccess(null)}><X size={14} /></button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — main content */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Creative card */}
              <div className="bg-[#fafafa] rounded-xl p-5 flex items-center gap-4">
                <img
                  src={creativeAvatar}
                  alt={pitch.creative?.name}
                  className="w-16 h-16 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-base">{pitch.creative?.name ?? "Creative"}</span>
                    <BadgeCheck fill="blue" stroke="white" size={16} />
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      {pitch.creative?.averageRating?.toFixed(1) ?? "—"}
                    </span>
                    <span>{pitch.creative?.completedProjects ?? 0} completed projects</span>
                  </div>
                </div>
                <button className="text-xs text-[#E05C5C] font-semibold hover:underline">
                  View Profile
                </button>
              </div>

              {/* Cover Note */}
              <div className="bg-[#fafafa] rounded-xl p-5">
                <h2 className="font-bold text-black text-base mb-3">Cover Note</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {pitch.coverNote ?? "—"}
                </p>
              </div>

              {/* Milestones */}
              {pitch.paymentMode === "MILESTONE" && pitch.milestones?.length > 0 && (
                <div className="bg-[#fafafa] rounded-xl p-5">
                  <h2 className="font-bold text-black text-base mb-4">
                    Milestones ({pitch.milestones.length})
                  </h2>
                  <div className="flex flex-col gap-3">
                    {pitch.milestones.map((m, i) => (
                      <div key={m.id} className="bg-white border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-black">
                            {i + 1}. {m.title}
                          </span>
                          <span className="text-sm font-bold text-[#E05C5C]">
                            {formatBudget(m.amount, pitch.currency)}
                          </span>
                        </div>
                        {m.description && (
                          <p className="text-xs text-gray-500 mb-1">{m.description}</p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={11} />
                          Due: {formatDate(m.dueDate)}
                        </div>
                        {m.notes && (
                          <p className="text-xs text-gray-400 mt-1 italic">{m.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — pitch meta */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#fafafa] rounded-xl p-5 flex flex-col gap-4">
                <h2 className="font-bold text-black text-base">Pitch Summary</h2>

                <MetaRow label="Proposed Amount" value={formatBudget(pitch.proposedAmount, pitch.currency)} />
                <MetaRow
                  label="Brief Budget"
                  value={
                    pitch.brief?.budgetMin
                      ? `${formatBudget(pitch.brief.budgetMin, pitch.brief.currency)} - ${formatBudget(pitch.brief.budgetMax, pitch.brief.currency)}`
                      : "—"
                  }
                />
                <MetaRow label="Payment Mode" value={pitch.paymentMode === "MILESTONE" ? "Milestone" : "Flat Payment"} />
                <MetaRow
                  label="Delivery Date"
                  value={formatDate(pitch.deliveryDate)}
                  icon={<Clock size={13} className="text-gray-400" />}
                />
                <MetaRow label="Collaborative" value={pitch.isCollaborative ? "Yes" : "No"} />
                <MetaRow label="Submitted" value={formatDate(pitch.createdAt)} />
              </div>

              {/* Actions */}
              {isPending && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setConfirmModal("accept")}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    <CheckCircle size={16} />
                    Accept Pitch
                  </button>
                  <button
                    onClick={() => setConfirmModal("reject")}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    <XCircle size={16} />
                    Reject Pitch
                  </button>
                </div>
              )}

              {!isPending && (
                <div className={`rounded-xl p-4 text-center text-sm font-semibold ${
                  pitch.status === "ACCEPTED" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}>
                  {pitch.status === "ACCEPTED"
                    ? "✓ You accepted this pitch"
                    : "✗ You rejected this pitch"
                  }
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const MetaRow: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-xs text-gray-500 flex items-center gap-1">{icon}{label}</span>
    <span className="text-xs font-semibold text-black text-right">{value}</span>
  </div>
);

export default PitchDetailPage;