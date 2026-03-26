"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Sidebar from "@/app/components/creative/dashboard/sideBar";
import DashboardTopbar from "@/app/components/creative/dashboard/dashboardTopbar";
import Breadcrumb from "@/app/components/creative/dashboard/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { X, ChevronDown, Check, CloudUpload, BadgeCheck } from "lucide-react";

const deliveryTypes = ["Initial Delivery", "Revision", "Final Delivery"];

const milestones = [
    { label: "Milestone 1", due: "Due Nov 26, 2025" },
    { label: "Milestone 2", due: "Due Nov 26, 2025" },
];

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#fafafa] border border-gray-200 rounded-xl mb-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#fafafa]">
                <span className="font-semibold text-black text-sm">{title}</span>
                <ChevronDown size={18} className="text-gray-500" />
            </div>
            <div className="px-5 pb-5 bg-[#fafafa]">{children}</div>
        </div>
    );
}

// ── Congratulations Modal ───────────────────────────────────────────────────
const CongratulationsModal: React.FC<{ onGoToDashboard: () => void }> = ({ onGoToDashboard }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-[#e2c20dff] rounded-2xl px-12 py-10 w-[80%] lg:w-[420px] flex flex-col items-center text-center shadow-2xl">

            {/* Icon */}
            <div className="w-[90px] h-[90px] rounded-full bg-white flex items-center justify-center mb-5">
                <BadgeCheck size={52} fill="white" stroke="#e2c20dff" />
            </div>

            {/* Text */}
            <h2 className="text-[22px] font-bold text-white m-0 mb-1">
                Sent
            </h2>
            <p className="text-[14px] text-white m-0 mb-7 leading-relaxed max-w-[260px]">
                Client will check it and drop feedback.
            </p>

            {/* Button */}
            <button
                onClick={onGoToDashboard}
                className="bg-white border-none rounded-lg px-8 py-2.5 cursor-pointer text-black font-semibold text-xs lg:text-[14px] hover:bg-black hover:text-white transition-colors"
            >
                Continue
            </button>

        </div>
    </div>
);


export default function UploadDeliverablesPage() {
    const params = useParams();
    const gigTitle = decodeURIComponent(params.gigTitle as string);
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeDelivery, setActiveDelivery] = useState("Initial Delivery");
    const [selectedMilestone, setSelectedMilestone] = useState("Milestone 1");
    const [note, setNote] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...dropped]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFiles = () => setFiles([]);

    const getFilePreview = (file: File) => {
        if (file.type.startsWith("image/")) return URL.createObjectURL(file);
        if (file.type === "application/pdf") return "/icons/pdf.png";
        return "/icons/zip.png";
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Congratulations Modal */}
            {showModal && (
                <CongratulationsModal onGoToDashboard={() => router.push("/creative/my-gigs")} />
            )} 
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
                    <Sidebar activeItem="My Gigs" />
                </div>

                <main className="flex-1 w-full px-4 lg:px-7 py-6 overflow-y-auto">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        crumbs={[
                            { label: "Dashboard", path: "/creative/dashboard" },
                            { label: "My Gig", path: "/creative/my-gigs" },
                            { label: gigTitle, path: `/creative/my-gigs/${encodeURIComponent(gigTitle)}` },
                            { label: "Upload Deliverables" },
                        ]}
                    />

                    <h1 className="text-2xl font-bold text-gray-900 mb-5">
                        Upload Deliverables
                    </h1>

                    {/* Project card */}
                    <div className="bg-[#fafafa] border border-gray-100 rounded-xl p-5 mb-4 text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{gigTitle}</h2>
                        <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full mb-4">
                            In Progress
                        </span>
                        {/* Progress bar */}
                        <div className="flex w-[60%] mx-auto items-center gap-3 mb-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full w-[60%] bg-red-500 rounded-full" />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">60%</span>
                        </div>
                        {/* Countdown */}
                        <div className="flex items-center justify-center gap-2 text-sm text-black">
                            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
                                <circle cx="10" cy="10" r="8" />
                                <path strokeLinecap="round" d="M10 6v4l2.5 2.5" />
                            </svg>
                            <span>Due in 2days &nbsp; 23 hrs 30 mins</span>
                        </div>
                    </div>

                    {/* About the client */}
                    <div className="bg-[#fafafa] border border-gray-100 rounded-xl p-5 mb-4">
                        <h2 className="text-base font-bold text-black text-xl mb-4">About the client</h2>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Image
                                    src="https://i.pravatar.cc/80?img=12"
                                    alt="Charles Eden"
                                    width={56}
                                    height={56}
                                    className="rounded-full object-cover"
                                />
                                <div className="text-sm text-black">
                                    <p className="font-semibold text-black text-lg mb-1">Charles Eden</p>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-black">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs text-black">4800 Argonne Street, Aurora Denver CO.</span>
                                    </div>
                                    <p className="text-md"><span className="text-black">Language: </span>English</p>
                                    <p className="text-md"><span className="text-black">Preferred Communication: </span>Chat only</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#e84545] text-white text-sm font-medium rounded-lg hover:bg-[#d03535] transition-colors">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                                </svg>
                                Chat Client
                            </button>
                        </div>
                    </div>

                    {/* Select Deliverable Type */}
                    <Section title="Select Deliverable Type">
                        <div className="flex gap-3 flex-wrap">
                            {deliveryTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveDelivery(type)}
                                    className={`px-4 py-2 rounded-3xl text-sm font-semibold border transition-colors ${activeDelivery === type
                                            ? "bg-[#e84545] text-white border-[#e84545]"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Upload Files */}
                    <Section title="Upload Files">
                        {/* Drop zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-gray-50 transition-colors mb-4"
                        >
                            <CloudUpload size={52} className="text-[#e84545] mb-3" />
                            <p className="font-semibold text-gray-700 text-sm mb-1">
                                Drag your files here or tap to upload
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG, PDF, MP4, ZIP</p>
                            <p className="text-xs text-gray-400">Maximum file size 500mb. Multiple files allowed.</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".png,.jpg,.jpeg,.pdf,.mp4,.zip"
                            />
                        </div>

                        {/* File previews */}
                        {files.length > 0 && (
                            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 relative">
                                {files.map((file, i) => (
                                    <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                        {file.type.startsWith("image/") ? (
                                            <img
                                                src={getFilePreview(file)}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">
                                                {file.name.split(".").pop()?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={removeFiles}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </Section>

                    {/* Select Milestone */}
                    <Section title="Select Milestone (If applicable)">
                        <div className="grid grid-cols-2 gap-3">
                            {milestones.map((m) => (
                                <button
                                    key={m.label}
                                    onClick={() => setSelectedMilestone(m.label)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-colors ${selectedMilestone === m.label
                                            ? "border-gray-300 bg-white"
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">{m.label}</span>
                                        <span className="text-gray-400 text-xs">{m.due}</span>
                                    </div>
                                    {selectedMilestone === m.label && (
                                        <Check size={16} className="text-gray-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Note to Client */}
                    <Section title="Note to Client">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add a short message to explain your delivery"
                            className="w-full h-28 px-4 py-3 text-sm bg-white text-black placeholder-black border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#e84545]/20 focus:border-[#e84545]/40 transition-all"
                        />
                    </Section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pb-10">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1c1c3a] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a50] transition-colors">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Cancel
                        </button>
                        <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2.5 bg-[#e84545] text-white text-sm font-medium rounded-lg hover:bg-[#d03535] transition-colors">
                            Submit Now
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}