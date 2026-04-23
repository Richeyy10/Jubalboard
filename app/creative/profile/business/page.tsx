"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../assets/logo.png";
import { Camera, User, MapPin, Upload, ChevronDown, Check, BadgeCheck, Loader2 } from "lucide-react";
import { apiRequest } from "../../../lib/api";

type Category = {
  id: string;
  name: string;
};

const industries = ["Technology", "Fashion", "Music", "Film", "Architecture", "Food & Culinary", "Health", "Education"];
const languages = ["English", "French", "Spanish", "Arabic", "Yoruba"];
const commOptions = ["Chat only", "Email only", "Phone", "Any"];
const currencies = ["Dollars ($)", "Euros (€)", "Pounds (£)", "Naira (₦)"];
const budgetRanges = ["$100-$200", "$200-$500", "$500-$1000", "$1000-$5000", "$5000+"];

const commValueMap: Record<string, string> = {
  "Chat only": "CHAT_ONLY",
  "Email only": "EMAIL",
  "Phone": "PHONE",
  "Any": "ANY",
};

const languageValueMap: Record<string, string> = {
  "English": "en",
  "French": "fr",
  "Spanish": "es",
  "Arabic": "ar",
  "Yoruba": "yo",
};

const reqStar = <span className="text-[#E2554F]"> *</span>;
const inputClass = "w-full border border-gray-200 rounded-lg px-3.5 py-[11px] text-[13px] text-black outline-none bg-white box-border";
const labelClass = "text-[13px] font-semibold text-black block mb-1.5";

// ── Select Field ────────────────────────────────────────────────────────────
const SelectField = ({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) => (
  <div>
    <label className={labelClass}>{label}{reqStar}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-9 cursor-pointer`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={14} stroke="#6B7280" />
      </div>
    </div>
  </div>
);

// ── Congratulations Modal ───────────────────────────────────────────────────
const CongratulationsModal: React.FC<{ onGoToDashboard: () => void }> = ({ onGoToDashboard }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl px-12 py-10 w-[80%] lg:w-[420px] flex flex-col items-center text-center shadow-2xl">
      <div className="w-[90px] h-[90px] rounded-full bg-[#2563EB] flex items-center justify-center mb-5">
        <BadgeCheck size={52} fill="white" stroke="#2563EB" />
      </div>
      <h2 className="text-[22px] font-bold text-[#2563EB] m-0 mb-1">Congratulations!</h2>
      <p className="text-[16px] font-semibold text-[#2563EB] m-0 mb-3">Your profile is complete</p>
      <p className="text-[14px] text-gray-600 m-0 mb-7 leading-relaxed max-w-[260px]">
        You can now post projects and connect with the right creatives.
      </p>
      <button
        onClick={onGoToDashboard}
        className="bg-[#2563EB] border-none rounded-lg px-8 py-2.5 cursor-pointer text-white font-semibold text-xs lg:text-[14px] hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

// ── Main Page ───────────────────────────────────────────────────────────────
const BrandProfile: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [brandLogo, setBrandLogo] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // stores IDs
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [form, setForm] = useState({
    businessName: "", contactNumber: "", country: "",
    streetAddress: "", websiteLinks: "",
    registrationNumber: "", taxId: "",
    description: "", postalCode: "",
    language: "English", communication: "Chat only",
    industry: "", currency: "Dollars ($)",
    budgetRange: "$100-$200",
  });

  // Fetch real categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        // data may be the array directly, or nested under data.data etc.
        const list: Category[] = Array.isArray(data) ? data : data.data ?? [];
        setCategories(list);
      } catch {
        // silently fail — categories just won't render
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // toggleCategory now works with IDs
  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBrandLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (
      !form.businessName ||
      !form.contactNumber ||
      !form.country ||
      !form.description ||
      selectedCategories.length === 0
    ) {
      setError("Please fill in all required fields marked with *");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tokenRes = await fetch("/api/auth/session/token");
      if (!tokenRes.ok) throw new Error("Authentication failed. Please log in again.");
      const { token } = await tokenRes.json();
      if (!token) throw new Error("Authentication failed. Please log in again.");

      const formData = new FormData();
      formData.append("businessName", form.businessName);
      formData.append("contactNumber", form.contactNumber);
      formData.append("businessLocationCity", form.country);
      formData.append("streetAddress", form.streetAddress);
      formData.append("companyWebsite", form.websiteLinks);
      formData.append("businessRegistrationNumber", form.registrationNumber);
      formData.append("taxId", form.taxId);
      formData.append("industrySector", form.industry);
      formData.append("preferredCommunication", commValueMap[form.communication]);
      formData.append("languagePreference", languageValueMap[form.language]);

      // Send real category IDs
      selectedCategories.forEach((id) => {
        formData.append("categoriesOfInterest", id);
      });

      const res = await fetch("/api/v1/clients/me/business-profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save profile.");
      }

      setShowModal(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred while saving.";
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen pb-5 bg-white font-sans">
      {showModal && (
        <CongratulationsModal onGoToDashboard={() => router.push("/client/dashboard")} />
      )}

      {/* Navbar */}
      <div className="flex items-center gap-2.5 px-[42px] bg-[#fafafa] h-[100px] border-b border-gray-200">
        <Image src={logo} alt="Jubal Board logo" width={120} height={120} className="object-contain" />
      </div>

      <h1 className="text-center text-[28px] font-black text-[#1a1a2e] mt-9 mb-6">Build Your Space</h1>

      <div className="max-w-[760px] mx-auto mb-[60px] bg-[#fafafa] rounded-2xl px-12 py-10 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Logo Upload */}
        <div className="flex flex-col items-center mb-9">
          <div className="relative mb-2.5">
            <div className="w-[90px] h-[90px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {brandLogo
                ? <img src={brandLogo} alt="logo" className="w-full h-full object-cover" />
                : <User size={48} fill="#1a1a2e" stroke="none" />
              }
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full border-2 border-white cursor-pointer flex items-center justify-center bg-white"
            >
              <Camera size={18} stroke="black" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </div>
          <p className="m-0 text-[13px] text-gray-500">Add your Logo</p>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Business Name{reqStar}</label>
            <input value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="Type here" className={inputClass} />
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
            <label className={labelClass}>Business Website/Social Link(s){reqStar}</label>
            <input value={form.websiteLinks} onChange={(e) => update("websiteLinks", e.target.value)} placeholder="Type here" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Business Registration Number</label>
              <input value={form.registrationNumber} onChange={(e) => update("registrationNumber", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tax ID</label>
              <input value={form.taxId} onChange={(e) => update("taxId", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Attach Document</label>
              <button className="flex items-center gap-2 bg-[#E2554F] border-none rounded-lg px-5 py-2.5 cursor-pointer text-white font-semibold text-[13px] hover:bg-[#d44a44] transition-colors">
                <Upload size={16} stroke="white" /> Upload
              </button>
            </div>
            <SelectField label="Select your Industry/Sector" value={form.industry} onChange={(v) => update("industry", v)} options={industries} placeholder="Select industry" />
          </div>

          <div>
            <label className={labelClass}>Describe what makes your brand unique{reqStar}</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className={`${inputClass} resize-y leading-relaxed`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Postal Code</label>
              <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <SelectField label="Language Preference" value={form.language} onChange={(v) => update("language", v)} options={languages} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Preferred Communication" value={form.communication} onChange={(v) => update("communication", v)} options={commOptions} />
          </div>

          {/* Categories — now fetched from API */}
          <div>
            <label className={labelClass}>Pick Categories where your business shines{reqStar}</label>
            <div className="border border-gray-200 rounded-[10px] p-4 flex flex-wrap gap-2.5">
              {categoriesLoading ? (
                <div className="flex items-center gap-2 text-[13px] text-gray-400">
                  <Loader2 size={14} className="animate-spin" /> Loading categories...
                </div>
              ) : (
                categories.map((cat) => {
                  const selected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3.5 py-[7px] rounded-md cursor-pointer border-none text-[13px] flex items-center gap-1.5 transition-all duration-150
                        ${selected ? "bg-[#1a1a2e] text-white font-semibold" : "bg-gray-100 text-gray-700 font-normal"}`}
                    >
                      {selected && <Check size={12} stroke="white" strokeWidth={3} />}
                      {cat.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-9">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#E2554F] border-none rounded-lg px-12 py-3.5 cursor-pointer text-white font-bold text-[15px] hover:bg-[#d44a44] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;