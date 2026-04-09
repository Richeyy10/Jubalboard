"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { useBriefStore } from "../../../lib/stores/briefStore";

const BriefPreviewContent: React.FC = () => {
    const router = useRouter();
    const { form, reset } = useBriefStore();

    const handlePostJob = async () => {
        // Replace with your actual API call e.g:
        // await fetch("/api/briefs", { method: "POST", body: JSON.stringify(form) });
        console.log("Posting job:", form);
        reset();
        router.push("/client/my-briefs");
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => router.back()} className="p-1 text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-2xl font-heading font-bold text-black">Brief Preview</h1>
                <button onClick={() => router.push("/client/my-briefs")} className="p-1 text-gray-600 hover:text-gray-900">
                    <X size={22} />
                </button>
            </div>

            {/* Preview Card */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-5">
                <PreviewRow label="Job Title" value={form.jobTitle} />
                <PreviewRow label="Project Category" value={form.projectCategory} />
                <PreviewRow label="Specific Skill(s)" value={form.specificSkills} />
                <PreviewRow label="Job Description" value={form.jobDescription} />
                <PreviewRow label="Set your Budget" value={form.budgetRange} />
                <PreviewRow label="Timeline" value={form.timeline} />
                <PreviewRow label="Delivery Date" value={form.deliveryDate} />
                {form.referenceFileName && (
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-2">Attach Reference File</p>
                        <span className="inline-block border border-[#E05C5C] text-[#E05C5C] text-sm px-3 py-1 rounded-lg">
                            {form.referenceFileName}
                        </span>
                    </div>
                )}
            </div>

            {/* Post Job */}
            <div className="w-[30%] mx-auto">
                <button
                    onClick={handlePostJob}
                    className="w-full mt-6 bg-[#E05C5C] text-white font-semibold py-4 rounded-xl text-base hover:bg-[#d04f4f] transition-colors"
                >
                    Post Job
                </button>
            </div>
        </div>
    );
};

const PreviewRow = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-md font-heading font-bold text-black">{label}</p>
        <p className="text-sm font-body text-black mt-1 leading-relaxed">{value || "—"}</p>
    </div>
);

export default BriefPreviewContent;