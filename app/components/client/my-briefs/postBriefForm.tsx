"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Upload, Calendar, MapPin, Check } from "lucide-react";
import { useBriefStore } from "../../../lib/stores/briefStore";

const CongratulationsModal: React.FC<{ onGoToDashboard: () => void }> = ({ onGoToDashboard }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-orange-400/80 rounded-2xl px-12 py-10 w-[80%] lg:w-[420px] flex flex-col items-center text-center shadow-2xl">

      {/* Icon */}
      <div className="w-[90px] h-[90px] rounded-full bg-white flex items-center justify-center mb-5">
        <Check size={52} fill="white" stroke="#fb923c" />
      </div>

      {/* Text */}
      <h2 className="text-[22px] font-bold text-white m-0 mb-1">
        Your Project is live!
      </h2>
      <p className="text-[14px] text-white m-0 mb-7 leading-relaxed max-w-[260px]">
        Your job is now visible to creatives. We'll notify you when pitch comes in
      </p>

      {/* Button */}
      <button
        onClick={onGoToDashboard}
        className="bg-white border-none rounded-lg px-8 py-2.5 cursor-pointer text-[#fb923c] font-semibold text-xs lg:text-[14px] hover:bg-orange-500 hover:text-black transition-colors"
      >
        Go to Dashboard
      </button>

    </div>
  </div>
);

const PostBriefForm: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { form, setField } = useBriefStore();
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setField("referenceFile", file);
    setField("referenceFileName", file?.name ?? "");
  };

  const handlePostJob = async () => {
    // Replace with your actual API call e.g:
    // await fetch("/api/briefs", { method: "POST", body: JSON.stringify(form) });
    console.log("Posting job:", form);
  };

  return (
    <div>
      {showModal && (
        <CongratulationsModal onGoToDashboard={() => router.push("/client/dashboard")} />
      )}
      <h1 className="text-2xl font-heading font-extrabold text-black mb-6">Post a Brief</h1>

      <div className="bg-[#fafafa] rounded-2xl p-6 flex flex-col gap-6">

        <Field label="Job Title">
          <input
            value={form.jobTitle}
            onChange={(e) => setField("jobTitle", e.target.value)}
            placeholder="Type here"
            className={inputClass}
          />
        </Field>

        <Field label="Project Category">
          <div className="relative">
            <select
              value={form.projectCategory}
              onChange={(e) => setField("projectCategory", e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Select category</option>
              <option>Digital & Visual Arts</option>
              <option>Web Development</option>
              <option>Content Writing</option>
              <option>Video & Animation</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="Select Specific Skill (s)">
          <textarea
            value={form.specificSkills}
            onChange={(e) => setField("specificSkills", e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Job Description">
          <textarea
            value={form.jobDescription}
            onChange={(e) => setField("jobDescription", e.target.value)}
            placeholder="Describe your project in detail"
            rows={5}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Attach Reference File (Optional)">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[#E05C5C] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#d04f4f] transition-colors"
            >
              <Upload size={15} />
              Upload
            </button>
            {form.referenceFileName && (
              <span className="text-sm text-gray-500">{form.referenceFileName}</span>
            )}
          </div>
        </Field>

        <Field label="Select number of Creatives you want on this project">
          <div className="relative">
            <select
              value={form.numCreatives}
              onChange={(e) => setField("numCreatives", e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              {["1 creative", "2 creatives", "3 creatives", "4 creatives", "5+ creatives"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="Select Currency">
          <div className="relative">
            <select
              value={form.currency}
              onChange={(e) => setField("currency", e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option>Dollars ($)</option>
              <option>Euros (€)</option>
              <option>Pounds (£)</option>
              <option>Naira (₦)</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="Select Budget Range">
          <div className="relative">
            <select
              value={form.budgetRange}
              onChange={(e) => setField("budgetRange", e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option>$50-$100</option>
              <option>$100-$500</option>
              <option>$500-$1000</option>
              <option>$1000+</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Timeline">
            <div className="relative">
              <select
                value={form.timeline}
                onChange={(e) => setField("timeline", e.target.value)}
                className={`${inputClass} appearance-none pr-10`}
              >
                <option>Less than 24 hours</option>
                <option>1-3 days</option>
                <option>3-7 days</option>
                <option>1-2 weeks</option>
                <option>1 month+</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </Field>

          <Field label="Delivery Date">
            <div className="relative">
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(e) => setField("deliveryDate", e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </Field>
        </div>

        <Field label="Mode of Project">
          <div className="relative">
            <select
              value={form.modeOfProject}
              onChange={(e) => setField("modeOfProject", e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option>Virtual</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="Location (Optional)">
          <div className="relative">
            <input
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="Type here"
              className={`${inputClass} pr-10`}
            />
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>

      </div>

      {/* Bottom Buttons */}
      <div className="bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between z-20">
        <button
          onClick={() => router.push("/client/my-briefs/preview")}
          className="bg-[#E05C5C] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#d04f4f] transition-colors"
        >
          Preview Brief
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#E05C5C] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#d04f4f] transition-colors"
        >
          Post Job
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-lg font-heading font-medium text-black">{label}</label>
    {children}
  </div>
);

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-black bg-white outline-none focus:border-[#E05C5C] transition-colors placeholder:text-gray-400";

export default PostBriefForm;