"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/components/client/dashboard/sideBar";
import DashboardTopbar from "@/app/components/client/dashboard/dashboardTopbar";
import Breadcrumb from "@/app/components/client/my-desk/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { X, ChevronDown, BadgeCheck, ThumbsUp, DollarSign } from "lucide-react";
import { showReviewCreativeToast } from "@/app/components/ui/toasts";
import { showAddtoFavoriteToast } from "@/app/components/ui/toasts";
import { showPartiallyToast } from "@/app/components/ui/toasts";
import { showRevisionToast } from "@/app/components/ui/toasts";

interface Props {
    onClose: () => void;
}

const StarIcon = () => (
    <svg viewBox="0 0 20 20" fill="#F5A623" className="w-4 h-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const briefRows = [
    { label: "Job Title", value: "Logo Design" },
    { label: "Specific Skills", value: "Graphics Designer" },
    { label: "Job Description", value: "Create a modern, minimalist logo. Include brand colors (black & gold). Deliver in PNG, SVG, and PDF formats" },
    { label: "Timeline", value: "3 days" },
    { label: "Delivery Date", value: "Nov 28, 2025" },
];

const milestones = [
    { label: "Milestone 1", due: "Due Nov 26, 2025", status: "Completed", statusColor: "bg-green-100 text-green-600" },
    { label: "Milestone 2", due: "Due Nov 26, 2025", status: "Pending", statusColor: "bg-red-100 text-red-400" },
];

function CollapsibleSection({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-[#fafafa] p-6 mb-4 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4"
            >
                <h2 className="text-base font-bold text-black">{title}</h2>
                <ChevronDown
                    size={18}
                    className={`text-black transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && <div className="px-5 pb-5">{children}</div>}
        </div>
    );
}

const RevisionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const inputClass = "w-full border border-gray-200 rounded-lg px-3.5 py-[11px] text-[13px] text-black outline-none bg-white box-border";

    const [form, setForm] = useState({
        description: "", postalCode: "", language: "English",
    });

    const update = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleRevision = () => {
          // Replace with your actual API call:
          // await fetch("/api/wallet/fund", { method: "POST", body: JSON.stringify({ amount, gateway: selectedGateway }) });
          onClose();
          showRevisionToast();
        };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center mt-10 justify-center z-50">
            <div className="bg-white rounded-2xl px-12 py-10 w-[80%] lg:w-[420px] flex flex-col items-center text-center shadow-2xl">
                <h1 className="text-black text-2xl font-bold mb-4">Request Revision</h1>
                <div className="bg-[#fafafa] p-6 mb-4 text-center">
                    <h2 className="text-xl font-bold text-black mb-2">Logo Design for Luxury Boutique</h2>
                    <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full mb-4">
                        In Progress
                    </span>
                    <div className="flex items-center gap-3 mb-3 max-w-md mx-auto">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full w-[60%] bg-[#e84545] rounded-full" />
                        </div>
                        <span className="text-xs font-semibold text-black">60%</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-black">
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
                            <circle cx="10" cy="10" r="8" />
                            <path strokeLinecap="round" d="M10 6v4l2.5 2.5" />
                        </svg>
                        <span>Due in 2days &nbsp; 23 hrs 30 mins</span>
                    </div>
                </div>
                <div className="bg-[#fafafa] p-6 mb-4 text-center">
                    <h2 className="text-xl font-bold text-black mb-2">Describe what needs to be revised</h2>
                    <textarea
                        value={form.description}
                        placeholder="Type here"
                        onChange={(e) => update("description", e.target.value)}
                        rows={4}
                        className={`${inputClass} resize-y leading-relaxed`}
                    />
                </div>
                <button
                    onClick={handleRevision}
                    className="bg-[#E2554F] border-none rounded-lg px-8 py-2.5 cursor-pointer text-black font-semibold text-xs lg:text-[14px] hover:bg-[#E2554F] hover:text-white transition-colors"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

const CongratulationsModal: React.FC<{ onGoToDashboard: () => void }> = ({ onGoToDashboard }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl px-12 py-10 w-[80%] lg:w-[420px] flex flex-col items-center text-center shadow-2xl">

            {/* Icon */}
            <div className="w-[90px] h-[90px] rounded-full bg-[#fb923c] flex items-center justify-center mb-5">
                <ThumbsUp size={52} fill="white" stroke="#fb923c" />
            </div>

            {/* Text */}
            <h2 className="text-[22px] font-bold text-orange-400 m-0 mb-1">
                All Done
            </h2>
            <p className="text-[14px] text-gray-600 m-0 mb-7 leading-relaxed max-w-[260px]">
                You have marked this project as completed. Tap below to release payment to your creative.
            </p>

            {/* Button */}
            <button
                onClick={onGoToDashboard}
                className="bg-orange-400 border-none rounded-lg px-8 py-2.5 cursor-pointer text-white font-semibold text-xs lg:text-[14px] hover:bg-orange-600 transition-colors"
            >
                Authorize Pay Out
            </button>

        </div>
    </div>
);

const ReleasedModal: React.FC<{ onGoToDashboard: () => void }> = ({ onGoToDashboard }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl px-12 py-10 w-[80%] lg:w-[420px] flex flex-col items-center text-center shadow-2xl">

            {/* Icon */}
            <div className="w-[90px] h-[90px] rounded-full bg-green-400 flex items-center justify-center mb-5">
                <DollarSign size={52} fill="white" stroke="green" />
            </div>

            {/* Text */}
            <h2 className="text-[22px] font-bold text-green-400 m-0 mb-1">
                Payment Released
            </h2>
            <p className="text-[14px] text-gray-600 m-0 mb-7 leading-relaxed max-w-[260px]">
                The creative has received their funds. You can now rate your experience.
            </p>

            {/* Button */}
            <button
                onClick={onGoToDashboard}
                className="bg-green-400 border-none rounded-lg px-8 py-2.5 cursor-pointer text-white font-semibold text-xs lg:text-[14px] hover:bg-orange-600 transition-colors"
            >
                Rate Creative
            </button>

        </div>
    </div>
);

const RateAndReviewModal: React.FC<{ onClose: () => void; onSubmit: () => void }> = ({ onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [review, setReview] = useState("");
    const [favourite, setFavourite] = useState<"yes" | "no" | null>(null);

    const AddtoFavorite = () => {
        // Replace with your actual API call:
        // await fetch("/api/wallet/fund", { method: "POST", body: JSON.stringify({ amount, gateway: selectedGateway }) });
        showAddtoFavoriteToast();
    };

    return (
        <div className="fixed inset-0 bg-black/40 mt-20 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pt-6 pb-4">
                    <div className="w-6" />
                    <h2 className="text-xl font-bold text-black">Rate and Review</h2>
                    <button onClick={onClose} className="text-black hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Creative */}
                <div className="flex items-center justify-center gap-3 pb-4">
                    <Image
                        src="https://i.pravatar.cc/80?img=47"
                        alt="Natasha John"
                        width={44}
                        height={44}
                        className="rounded-full object-cover"
                    />
                    <div>
                        <div className="flex items-center gap-1">
                            <p className="font-semibold text-gray-900 text-sm">Natasha John</p>
                            <svg viewBox="0 0 20 20" fill="#3B82F6" className="w-3.5 h-3.5">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-xs text-black">Graphic Designer</p>
                    </div>
                </div>

                {/* How was it */}
                <div className="bg-[#fafafa] w-[80%] mx-auto p-6 text-center mb-1">
                    <p className="font-bold text-black mb-1">How was it?</p>
                    <p className="text-xs text-black mb-4">Give 5 star for your experience</p>
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                onMouseEnter={() => setHovered(s)}
                                onMouseLeave={() => setHovered(0)}
                                onClick={() => setRating(s)}
                            >
                                <svg viewBox="0 0 20 20" fill={s <= (hovered || rating) ? "#F5A623" : "#E5E7EB"} className="w-9 h-9 transition-colors">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leave a Review */}
                <div className="bg-[#fafafa] w-[80%] mx-auto p-6 text-center mb-1">
                    <p className="font-bold text-black mb-1">Leave a Review</p>
                    <p className="text-xs text-black mb-3">Be honest. Great work deserves great feedback</p>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 text-sm text-black placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#e84545]/20"
                    />
                </div>

                {/* Add to Favourite */}
                <div className="bg-[#fafafa] w-[80%] mx-auto p-6 text-center mb-1">
                    <p className="font-bold text-black mb-4">Add this Creative to Favourite?</p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => {setFavourite("yes"); AddtoFavorite(); } }
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${favourite === "yes"
                                ? "bg-[#E2554F] text-white"
                                : "bg-[#E2554F]/80 hover:bg-[#E2554F] text-white"
                                }`}
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => setFavourite("no")}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${favourite === "no"
                                ? "bg-[#E2554F] text-white"
                                : "bg-[#E2554F]/80 hover:bg-[#E2554F] text-white"
                                }`}
                        >
                            No
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <div className="text-center px-6 pb-6">
                    <button
                        onClick={onSubmit}
                        className="w-[40%] py-3 bg-[#e84545] hover:bg-[#d03535] text-white font-bold rounded-xl transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ViewProjectPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"view" | "review">("view");
    const [showModal, setShowModal] = useState(false);
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const [showReleasedModal, setShowReleasedModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);

    const handlePartially = () => {
          // Replace with your actual API call:
          // await fetch("/api/wallet/fund", { method: "POST", body: JSON.stringify({ amount, gateway: selectedGateway }) });
          setShowModal(false);
          showPartiallyToast();
        };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {showModal && (
                <RevisionsModal onClose={() => {
                    setShowModal(false);
                }} />
            )}

            {showCongratsModal && (
                <CongratulationsModal onGoToDashboard={() => {
                    setShowCongratsModal(false);
                    setShowReleasedModal(true);
                }} />
            )}
            {showReleasedModal && (
                <ReleasedModal onGoToDashboard={() => {
                    setShowReleasedModal(false);
                    setShowRateModal(true);
                }} />
            )}
            {showRateModal && (
                <RateAndReviewModal
                    onClose={() => setShowRateModal(false)}
                    onSubmit={() => {
                        // Replace with your actual API call:
                        // await fetch("/api/wallet/fund", { method: "POST", body: JSON.stringify({ amount, gateway: selectedGateway }) });
                        showReviewCreativeToast();
                        setShowRateModal(false);
                        router.push("/client/my-desk");
                    }}
                />
            )}

            <DashboardTopbar
                userName="Charles Eden"
                userAvatar="https://i.pravatar.cc/150?img=33"
                sidebarOpen={sidebarOpen}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex flex-1">
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
                <div className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-10`}>
                    <button className="absolute top-4 right-4 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X size={22} />
                    </button>
                    <Sidebar activeItem="My Desk" />
                </div>

                <main className="flex-1 w-full px-4 lg:px-7 py-6 overflow-y-auto">
                    <Breadcrumb crumbs={[
                        { label: "Dashboard", path: "/client/dashboard" },
                        { label: "My Desk", path: "/client/my-desk" },
                        { label: "View Project" },
                    ]} />

                    {/* Tab buttons + Report Dispute */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab("view")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${activeTab === "view"
                                    ? "bg-white border-red-200 text-black"
                                    : "bg-white border-red-200 text-black hover:bg-gray-200"
                                    }`}
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                View Project
                            </button>
                            <button
                                onClick={() => setActiveTab("review")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${activeTab === "review"
                                    ? "bg-[#E2554F] border-[#E2554F] text-white"
                                    : "bg-[#E2554F] border-[#E2554F] text-white hover:bg-red-300"
                                    }`}
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                Review Deliverables
                            </button>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Report a Dispute
                        </button>
                    </div>

                    {activeTab === "view" ? (
                        <>
                            {/* Project card */}
                            <div className="bg-[#fafafa] p-6 mb-4 text-center">
                                <h2 className="text-xl font-bold text-black mb-2">Logo Design for Luxury Boutique</h2>
                                <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full mb-4">
                                    In Progress
                                </span>
                                <div className="flex items-center gap-3 mb-3 max-w-md mx-auto">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full w-[60%] bg-[#e84545] rounded-full" />
                                    </div>
                                    <span className="text-xs font-semibold text-black">60%</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-black">
                                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
                                        <circle cx="10" cy="10" r="8" />
                                        <path strokeLinecap="round" d="M10 6v4l2.5 2.5" />
                                    </svg>
                                    <span>Due in 2days &nbsp; 23 hrs 30 mins</span>
                                </div>
                            </div>

                            {/* Creative card */}
                            <div className="bg-[#fafafa] p-6 mb-4">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-base font-bold text-black">Creative</h2>
                                    <span className="px-4 py-1.5 bg-orange-400 text-white text-xs font-semibold rounded-md">Premium</span>
                                </div>
                                <div className="flex items-start gap-4 mt-4">
                                    <div className="relative shrink-0">
                                        <Image
                                            src="https://i.pravatar.cc/80?img=47"
                                            alt="Natasha John"
                                            width={64}
                                            height={64}
                                            className="rounded-full object-cover"
                                        />
                                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-black text-xl">Natasha John</p>
                                        <p className="text-xs text-green-500 font-medium mt-0.5">● Online</p>
                                        <p className="text-sm text-black mt-2">Verification Status:</p>
                                        <span className="inline-block mt-1 px-3 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 mt-4 pt-4 text-sm text-black">
                                    <div className="flex items-center gap-1">
                                        <StarIcon />
                                        <span className="font-medium text-black">5.0</span>
                                        <span className="text-black">(35 Reviews)</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-black">12</span>{" "}
                                        <span className="text-black">Completed Projects</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-black">100%</span>{" "}
                                        <span className="text-black">Job Success</span>
                                    </div>
                                </div>
                            </div>

                            {/* Brief Summary */}
                            <CollapsibleSection title="Brief Summary">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {briefRows.map((row) => (
                                            <tr key={row.label} className="border-b border-gray-50 last:border-0">
                                                <td className="py-2.5 pr-6 text-black font-medium w-36 align-top">{row.label}</td>
                                                <td className="py-2.5 text-black">{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CollapsibleSection>

                            {/* Milestones */}
                            <CollapsibleSection title="Milestones">
                                <div className="grid grid-cols-2 gap-3">
                                    {milestones.map((m) => (
                                        <div
                                            key={m.label}
                                            className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-lg bg-white"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-black">{m.label}</p>
                                                <p className="text-xs text-black mt-0.5">{m.due}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${m.statusColor}`}>
                                                {m.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>

                        </>
                    ) : (
                        <>
                            {/* Review Deliverables tab */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                {/* Left — project info */}
                                <div className="bg-[#fafafa] p-6">
                                    <h2 className="text-xl font-bold text-black mb-1">Logo Design for Luxury Boutique</h2>
                                    <span className="inline-block px-3 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full mb-3">
                                        In Progress
                                    </span>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full w-[60%] bg-[#e84545] rounded-full" />
                                        </div>
                                        <span className="text-xs font-semibold text-black">60%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-black">
                                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
                                            <circle cx="10" cy="10" r="8" />
                                            <path strokeLinecap="round" d="M10 6v4l2.5 2.5" />
                                        </svg>
                                        <span>Due in 2days &nbsp; 23 hrs 30 mins</span>
                                    </div>
                                </div>

                                {/* Right — creative mini card */}
                                <div className="bg-[#fafafa] p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0">
                                            <Image src="https://i.pravatar.cc/80?img=47" alt="Natasha John" width={48} height={48} className="rounded-full object-cover" />
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <p className="font-semibold text-black text-xl">Natasha John</p>
                                                <svg viewBox="0 0 20 20" fill="#3B82F6" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            </div>
                                            <p className="text-xs text-black">Graphic Designer</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-black">
                                                <div className="flex items-center gap-0.5">
                                                    <StarIcon />
                                                    <span className="font-semibold">5.0</span>
                                                </div>
                                                <span className="text-black">$300</span>
                                                <span className="text-black">12 Completed Projects</span>
                                            </div>
                                            <button className="text-xs text-black font-semibold mt-1 hover:underline">View Profile</button>
                                        </div>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-[#1c1c3a] flex items-center justify-center">
                                        <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Brief Summary + Uploaded Files side by side */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <CollapsibleSection title="Brief Summary">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {briefRows.map((row) => (
                                                <tr key={row.label} className="border-b border-gray-50 last:border-0">
                                                    <td className="py-2 pr-4 text-black font-medium w-32 align-top text-sm">{row.label}</td>
                                                    <td className="py-2 text-black text-sm">{row.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CollapsibleSection>

                                <CollapsibleSection title="Uploaded Files (3)">
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {[
                                            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png",
                                            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/320px-Marvel_Logo.svg.png",
                                            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
                                        ].map((src, i) => (
                                            <div key={i} className="h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                                <img src={src} alt={`file-${i}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-[#e84545] hover:bg-[#d03535] text-white text-sm font-semibold rounded-lg transition-colors">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Download
                                    </button>
                                </CollapsibleSection>
                            </div>

                            {/* Milestones */}
                            <CollapsibleSection title="Milestones">
                                <div className="grid grid-cols-2 gap-3">
                                    {milestones.map((m) => (
                                        <div key={m.label} className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-lg bg-white">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{m.due}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${m.statusColor}`}>{m.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>

                            {/* Message */}
                            <CollapsibleSection title="Message">
                                <div className="w-full px-4 py-3 bg-white border border-gray-100 rounded-lg text-sm text-black min-h-[80px]">
                                    Here are the logos for your perusal. Kindly check and revert
                                </div>
                            </CollapsibleSection>

                            {/* Status update */}
                            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-10 text-center">
                                <p className="text-sm text-black mb-4 font-medium">
                                    Done reviewing? Pick an option below to update the project status.
                                </p>
                                <div className="flex items-center justify-center gap-3 flex-wrap">
                                    <button onClick={handlePartially} className="px-5 py-2 bg-[#e84545] hover:bg-[#d03535] text-white text-sm font-semibold rounded-lg transition-colors">
                                        Partially Completed
                                    </button>
                                    <button onClick={() => setShowModal(true)} className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-semibold rounded-lg transition-colors">
                                        Revised
                                    </button>
                                    <button onClick={() => setShowCongratsModal(true)} className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors">
                                        Completed
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="pb-10" />
                </main>
            </div>
        </div>
    );
}