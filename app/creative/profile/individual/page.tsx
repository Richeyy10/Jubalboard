"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../assets/logo.png";
import {
  Camera, User, Calendar, MapPin, Upload, ChevronDown, Check, Loader2,
} from "lucide-react";
import { Dashhboard } from "@/app/icons";
import { ApiError } from "../../../lib/api";

const languages = ["English", "French", "Spanish", "Arabic", "Yoruba"];
const commOptions = ["Chat only", "Email only", "Chat & Email", "Phone & Chat"];

const commApiMap: Record<string, string> = {
  "Chat only": "CHAT_ONLY", "Email only": "EMAIL", "Chat & Email": "ANY", "Phone & Chat": "ANY",
};
const rateTypeApiMap: Record<string, string> = {
  "Hourly": "HOURLY", "Project-Based": "PROJECT_BASED", "Retainer": "BOTH", "Per Deliverable": "PROJECT_BASED",
};
const currencyApiMap: Record<string, string> = {
  "Dollars ($)": "USD", "Euros (€)": "EUR", "Pounds (£)": "GBP", "Naira (₦)": "NGN",
};
const languageApiMap: Record<string, string> = {
  "English": "en", "French": "fr", "Spanish": "es", "Arabic": "ar", "Yoruba": "yo",
};

const roles = ["Graphic Designer", "Photographer", "Videographer", "Illustrator", "3D Artist", "Content Creator"];
const currencies = ["Dollars ($)", "Euros (€)", "Pounds (£)", "Naira (₦)"];
const budgetRanges = ["$100-$200", "$200-$500", "$500-$1000", "$1000-$5000", "$5000+"];
const rateTypes = ["Hourly", "Project-Based", "Retainer", "Per Deliverable"];

const parseBudgetRange = (range: string): { min: number; max: number } => {
  const cleaned = range.replace(/\$/g, "");
  if (cleaned.endsWith("+")) {
    const min = parseInt(cleaned);
    return { min: isNaN(min) ? 0 : min, max: 999999 };
  }
  const parts = cleaned.split("-");
  if (parts.length !== 2) throw new Error(`Invalid budget range format: ${range}`);
  const min = Number(parts[0]);
  const max = Number(parts[1]);
  if (isNaN(min) || isNaN(max)) throw new Error(`Invalid budget range values: ${range}`);
  return { min, max };
};

const reqStar = <span className="text-[#E2554F]"> *</span>;
const inputClass = "w-full border border-gray-200 rounded-lg px-3.5 py-[11px] text-[13px] text-black outline-none bg-white box-border";
const labelClass = "text-[13px] font-semibold text-black block mb-1.5";

const SelectField = ({ label, value, onChange, options, placeholder }: any) => (
  <div>
    <label className={labelClass}>{label}{reqStar}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-9 cursor-pointer`}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={14} stroke="#6B7280" />
      </div>
    </div>
  </div>
);

const CongratulationsModal: React.FC<{ onGoToDashboard: () => void }> = ({ onGoToDashboard }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl px-12 py-10 w-[80%] lg:w-[420px] flex flex-col items-center text-center shadow-2xl">
      <div className="w-[90px] h-[90px] rounded-full bg-[#2196F3] flex items-center justify-center mb-5"><Dashhboard /></div>
      <h2 className="text-[24px] font-heading font-bold text-[#2196F3] m-0 mb-1">Congratulations!</h2>
      <p className="text-[20px] font-heading font-semibold text-[#2196F3] m-0 mb-3">Your profile is complete</p>
      <p className="text-[14px] font-body text-black m-0 mb-7 leading-relaxed max-w-[260px]">You can now post projects and connect with the right creatives.</p>
      <button onClick={onGoToDashboard} className="bg-[#2196F3] border-none rounded-lg px-8 py-2.5 cursor-pointer text-white font-semibold text-xs lg:text-[14px] hover:bg-blue-700 transition-colors">Go to Dashboard</button>
    </div>
  </div>
);

const TellUsAboutYou: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Array<{ id: string, name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "", dob: "", contactNumber: "", country: "", streetAddress: "", socialLinks: "",
    description: "", postalCode: "", language: "English", communication: "Chat only",
    professionalRole: "Graphic Designer", currency: "Dollars ($)", budgetRange: "$100-$200", rateType: "Hourly",
  });

  const update = (key: string, value: string) => {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://16.171.168.144:3000";
        const response = await fetch(`${BASE_URL}/api/v1/categories`, { credentials: "include" });
        if (response.ok) {
          const apiResponse = await response.json();
          if (apiResponse.success && Array.isArray(apiResponse.data)) {
            setAvailableCategories(apiResponse.data.map((cat: any) => ({ id: cat.id, name: cat.name })));
          }
        }
      } catch (e) {
        console.warn("Categories could not be loaded.");
      }
    };
    fetchCategories();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) { setError("Full name is required."); return; }
    if (!form.professionalRole) { setError("Professional role is required."); return; }
    if (!form.rateType) { setError("Rate type is required."); return; }

    setLoading(true);
    setError(null);

    try {
      const tokenRes = await fetch("/api/auth/session/token");
      const { token } = await tokenRes.json();
      if (!token) throw new Error("Unauthorized");

      const { min, max } = parseBudgetRange(form.budgetRange);

      // Single multipart/form-data request — includes all fields + image
      const formData = new FormData();
      formData.append("fullName", form.fullName.trim());
      formData.append("dateOfBirth", form.dob);
      formData.append("contactNumber", form.contactNumber.trim());
      // formData.append("countryState", form.country.trim());
      formData.append("streetAddress", form.streetAddress.trim());
      formData.append("postalCode", form.postalCode.trim());
      formData.append("describeYourselfInOneLine", form.description.trim());
      formData.append("languagePreference", languageApiMap[form.language] || "en");
      formData.append("preferredCommunication", commApiMap[form.communication] || "CHAT_ONLY");
      formData.append("professionalRole", form.professionalRole);
      formData.append("currency", currencyApiMap[form.currency] || "USD");
      // formData.append("rateRangeMin", String(min));
      // formData.append("rateRangeMax", String(max));
      formData.append("rateType", rateTypeApiMap[form.rateType] || "HOURLY");

      // Categories — append each ID separately
      selectedCategories.forEach((id) => {
        formData.append("categoriesOfInterest", id);
      });

      // Social links — append each link separately
      // form.socialLinks.split(",").map(s => s.trim()).filter(Boolean).forEach((link) => {
      //   formData.append("preferredSocialLinks", link);
      // });

      // Image — append file directly, no base64 conversion needed
      // ✅ Field name is "image" — change to "file" or "avatar" if backend rejects
      const avatarFile = fileInputRef.current?.files?.[0];
      if (avatarFile) {
        formData.append("image", avatarFile);
      }

      const res = await fetch("/api/v1/creatives/me/personal-profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // ✅ Do NOT set Content-Type — browser sets it automatically with boundary
        },
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save profile.");
      }

      // Update profileStatus in localStorage so routing works correctly
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.profileStatus = "Completed";
        localStorage.setItem("userData", JSON.stringify(parsed));
      }

      setShowModal(true);
    } catch (err) {
      console.error("Save error:", err);
      if (err instanceof ApiError) setError((err.data as any)?.message || "Failed to save.");
      else if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen pb-5 bg-white font-sans">
      {showModal && <CongratulationsModal onGoToDashboard={() => router.push("/creative/dashboard")} />}

      <div className="flex items-center gap-2.5 px-[42px] bg-[#fafafa] h-[100px] border-b border-gray-200">
        <Image src={logo} alt="Jubal Board logo" width={120} height={120} className="object-contain" />
      </div>

      <h1 className="text-center text-[28px] font-black text-[#1a1a2e] mt-9 mb-6">Tell us about you</h1>

      <div className="max-w-[760px] mx-auto mb-[60px] bg-[#fafafa] rounded-2xl px-12 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-600">{error}</div>
        )}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-9">
          <div className="relative mb-2.5">
            <div className="w-[90px] h-[90px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : <User size={48} fill="#1a1a2e" stroke="none" />
              }
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-white border-2 border-white cursor-pointer flex items-center justify-center shadow-sm"
            >
              <Camera size={18} stroke="black" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <p className="m-0 text-[13px] text-gray-500">Add your photo</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name{reqStar}</label>
              <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth{reqStar}</label>
              <div className="relative">
                <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} className={`${inputClass} pr-9`} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><Calendar size={16} stroke="#9CA3AF" /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Contact Number{reqStar}</label>
              <input value={form.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Country/State{reqStar}</label>
              <div className="relative">
                <input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Type here" className={`${inputClass} pr-9`} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><MapPin size={16} stroke="#9CA3AF" /></div>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Street Address{reqStar}</label>
            <input value={form.streetAddress} onChange={(e) => update("streetAddress", e.target.value)} placeholder="Type your street address" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Preferred Social Link(s){reqStar}</label>
            <input value={form.socialLinks} onChange={(e) => update("socialLinks", e.target.value)} placeholder="Separate multiple links with commas" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Describe yourself in one line{reqStar}</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className={`${inputClass} resize-y leading-relaxed`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Postal Code{reqStar}</label>
              <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <SelectField label="Language Preference" value={form.language} onChange={(v: string) => update("language", v)} options={languages} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Preferred Communication" value={form.communication} onChange={(v: string) => update("communication", v)} options={commOptions} />
            <SelectField label="What's your professional role?" value={form.professionalRole} onChange={(v: string) => update("professionalRole", v)} options={roles} placeholder="Select role" />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Show off your best projects{reqStar}</label>
              <button className="flex items-center gap-2 bg-[#E2554F] border-none rounded-lg px-5 py-2.5 cursor-pointer text-white font-semibold text-[13px] hover:bg-[#d44a44] transition-colors">
                <Upload size={16} stroke="white" /> Upload
              </button>
            </div>
            <SelectField label="Select your currency" value={form.currency} onChange={(v: string) => update("currency", v)} options={currencies} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Set your range" value={form.budgetRange} onChange={(v: string) => update("budgetRange", v)} options={budgetRanges} />
            <SelectField label="Select your rate" value={form.rateType} onChange={(v: string) => update("rateType", v)} options={rateTypes} placeholder="Hourly, Project-Based..." />
          </div>

          {/* Categories */}
          {availableCategories.length > 0 && (
            <div>
              <label className={labelClass}>Pick your categories</label>
              <div className="border border-gray-200 rounded-[10px] p-4 flex flex-wrap gap-2.5">
                {availableCategories.map((cat) => {
                  const selected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategories((prev) =>
                        prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                      )}
                      className={`px-3.5 py-[7px] rounded-md cursor-pointer border-none text-[13px] flex items-center gap-1.5 transition-all duration-150
                        ${selected ? "bg-[#1a1a2e] text-white font-semibold" : "bg-gray-100 text-gray-700 font-normal"}`}
                    >
                      {selected && <Check size={12} stroke="white" strokeWidth={3} />}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-9">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#E2554F] border-none rounded-lg px-12 py-3.5 cursor-pointer text-white font-bold text-[15px] hover:bg-[#d44a44] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TellUsAboutYou;