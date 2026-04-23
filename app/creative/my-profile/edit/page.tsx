"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../assets/logo.png";
import {
  Camera, User, Calendar, MapPin, ChevronDown, Check, Loader2, ArrowLeft,
} from "lucide-react";
import { ApiError } from "../../../lib/api";

const languages = ["English", "French", "Spanish", "Arabic", "Yoruba"];
const commOptions = ["Chat only", "Email only", "Chat & Email", "Phone & Chat"];

const commApiMap: Record<string, string> = {
  "Chat only": "CHAT_ONLY", "Email only": "EMAIL", "Chat & Email": "ANY", "Phone & Chat": "ANY",
};
const commReverseMap: Record<string, string> = {
  "CHAT_ONLY": "Chat only", "EMAIL": "Email only", "ANY": "Chat & Email",
};
const rateTypeApiMap: Record<string, string> = {
  "Hourly": "HOURLY", "Project-Based": "PROJECT_BASED", "Retainer": "BOTH", "Per Deliverable": "PROJECT_BASED",
};
const rateTypeReverseMap: Record<string, string> = {
  "HOURLY": "Hourly", "PROJECT_BASED": "Project-Based", "BOTH": "Retainer",
};
const currencyApiMap: Record<string, string> = {
  "Dollars ($)": "USD", "Euros (€)": "EUR", "Pounds (£)": "GBP", "Naira (₦)": "NGN",
};
const currencyReverseMap: Record<string, string> = {
  "USD": "Dollars ($)", "EUR": "Euros (€)", "GBP": "Pounds (£)", "NGN": "Naira (₦)",
};
const languageApiMap: Record<string, string> = {
  "English": "en", "French": "fr", "Spanish": "es", "Arabic": "ar", "Yoruba": "yo",
};
const languageReverseMap: Record<string, string> = {
  "en": "English", "fr": "French", "es": "Spanish", "ar": "Arabic", "yo": "Yoruba",
};

const roles = ["Graphic Designer", "Photographer", "Videographer", "Illustrator", "3D Artist", "Content Creator"];
const currencies = ["Dollars ($)", "Euros (€)", "Pounds (£)", "Naira (₦)"];
const rateTypes = ["Hourly", "Project-Based", "Retainer", "Per Deliverable"];

const reqStar = <span className="text-[#E2554F]"> *</span>;
const inputClass = "w-full border border-gray-200 rounded-lg px-3.5 py-[11px] text-[13px] text-black outline-none bg-white box-border";
const labelClass = "text-[13px] font-semibold text-black block mb-1.5";

const SelectField = ({ label, value, onChange, options, placeholder, required = true }: any) => (
  <div>
    <label className={labelClass}>{label}{required && reqStar}</label>
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

const EditProfile: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: "", dob: "", contactNumber: "", country: "", streetAddress: "",
    socialLinks: "", description: "", postalCode: "",
    language: "English", communication: "Chat only",
    professionalRole: "Graphic Designer", currency: "Dollars ($)",
    rateRangeMin: "0", rateRangeMax: "0", rateType: "Hourly",
  });

  const update = (key: string, value: string) => {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setFetching(true);
        const tokenRes = await fetch("/api/auth/session/token", { credentials: "include" });
        const { token } = await tokenRes.json();
        if (!token) throw new Error("Unauthorized");

        const res = await fetch("/api/v1/creatives/me", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const json = await res.json();
        const payload = json.data?.data || json.data;
        const cp = payload?.creativeProfile;

        if (cp) {
          setForm({
            fullName: cp.fullName || "",
            dob: cp.dateOfBirth ? cp.dateOfBirth.split("T")[0] : "",
            contactNumber: cp.contactNumber || "",
            country: cp.countryState || "",
            streetAddress: cp.streetAddress || "",
            socialLinks: (cp.preferredSocialLinks || []).join(", "),
            description: cp.describeYourselfInOneLine || "",
            postalCode: cp.postalCode || "",
            language: languageReverseMap[cp.languagePreference] || "English",
            communication: commReverseMap[cp.preferredCommunication] || "Chat only",
            professionalRole: cp.professionalRole || "Graphic Designer",
            currency: currencyReverseMap[cp.currency] || "Dollars ($)",
            rateRangeMin: String(cp.rateRangeMin || 0),
            rateRangeMax: String(cp.rateRangeMax || 0),
            rateType: rateTypeReverseMap[cp.rateType] || "Hourly",
          });

          const catIds = (cp.categoriesOfInterest || []).map((c: any) =>
            typeof c === "string" ? c : c.id
          );
          setSelectedCategories(catIds);

          if (cp.imageUrl) setAvatar(cp.imageUrl);
        }
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
      } finally {
        setFetching(false);
      }
    };

    const loadCategories = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://16.171.168.144:3000";
        const res = await fetch(`${BASE_URL}/api/v1/categories`, { credentials: "include" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAvailableCategories(json.data.map((cat: any) => ({ id: cat.id, name: cat.name })));
          }
        }
      } catch {
        console.warn("Categories could not be loaded.");
      }
    };

    loadProfile();
    loadCategories();
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

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const tokenRes = await fetch("/api/auth/session/token");
      const { token } = await tokenRes.json();
      const rateMin = parseFloat(form.rateRangeMin);
      const rateMax = parseFloat(form.rateRangeMax);
      if (!token) throw new Error("Unauthorized");

      const formData = new FormData();

      if (form.fullName.trim()) formData.append("fullName", form.fullName.trim());
      if (form.dob) formData.append("dateOfBirth", form.dob);
      if (form.contactNumber.trim()) formData.append("contactNumber", form.contactNumber.trim());
      if (form.country.trim()) formData.append("countryState", form.country.trim());
      if (form.streetAddress.trim()) formData.append("streetAddress", form.streetAddress.trim());
      if (form.postalCode.trim()) formData.append("postalCode", form.postalCode.trim());
      if (form.description.trim()) formData.append("describeYourselfInOneLine", form.description.trim());

      formData.append("languagePreference", languageApiMap[form.language] || "en");
      formData.append("preferredCommunication", commApiMap[form.communication] || "CHAT_ONLY");
      formData.append("professionalRole", form.professionalRole);
      formData.append("currency", currencyApiMap[form.currency] || "USD");
      // formData.append("rateRangeMin", String(Number(form.rateRangeMin) || 0));
      // formData.append("rateRangeMax", String(Number(form.rateRangeMax) || 0));
      formData.append("rateType", rateTypeApiMap[form.rateType] || "HOURLY");

      // Only append if user actually entered something
      // const socialLinksArray = form.socialLinks.split(",").map((s) => s.trim()).filter(Boolean);
      // socialLinksArray.forEach((link) => formData.append("preferredSocialLinks", link));

      // // Only append if user selected categories
      // selectedCategories.forEach((id) => formData.append("categoriesOfInterest", id));

      // Only append image if user picked a new one
      const avatarFile = fileInputRef.current?.files?.[0];
      if (avatarFile) formData.append("image", avatarFile);

      const res = await fetch("/api/v1/creatives/me/personal-profile", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });

      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save profile.");
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => router.push("/creative/my-profile"), 1500);
    } catch (err) {
      if (err instanceof ApiError) setError((err.data as any)?.message || "Failed to save.");
      else if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E2554F] mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen pb-5 bg-white font-sans">
      {/* Navbar */}
      <div className="flex items-center gap-2.5 px-[42px] bg-[#fafafa] h-[100px] border-b border-gray-200">
        <Image src={logo} alt="Jubal Board logo" width={120} height={120} className="object-contain" />
      </div>

      {/* Back button */}
      <div className="max-w-[760px] mx-auto mt-6">
        <button
          onClick={() => router.push("/creative/my-profile")}
          className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-[#1a1a2e] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>
      </div>

      <h1 className="text-center text-[28px] font-black text-[#1a1a2e] mt-6 mb-6">Edit Profile</h1>

      <div className="max-w-[760px] mx-auto mb-[60px] bg-[#fafafa] rounded-2xl px-12 py-10">

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 text-sm text-green-600">
            Profile updated successfully! Redirecting...
          </div>
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
          <p className="m-0 text-[13px] text-gray-500">Update your photo</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name{reqStar}</label>
              <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <div className="relative">
                <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} className={`${inputClass} pr-9`} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><Calendar size={16} stroke="#9CA3AF" /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Contact Number</label>
              <input value={form.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Country/State</label>
              <div className="relative">
                <input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Type here" className={`${inputClass} pr-9`} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><MapPin size={16} stroke="#9CA3AF" /></div>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Street Address</label>
            <input value={form.streetAddress} onChange={(e) => update("streetAddress", e.target.value)} placeholder="Type your street address" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Preferred Social Link(s)</label>
            <input value={form.socialLinks} onChange={(e) => update("socialLinks", e.target.value)} placeholder="Separate multiple links with commas" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Describe yourself in one line</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className={`${inputClass} resize-y leading-relaxed`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Postal Code</label>
              <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="Type here" className={inputClass} />
            </div>
            <SelectField label="Language Preference" value={form.language} onChange={(v: string) => update("language", v)} options={languages} required={false} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Preferred Communication" value={form.communication} onChange={(v: string) => update("communication", v)} options={commOptions} required={false} />
            <SelectField label="Professional Role" value={form.professionalRole} onChange={(v: string) => update("professionalRole", v)} options={roles} required={false} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Currency" value={form.currency} onChange={(v: string) => update("currency", v)} options={currencies} required={false} />
            <SelectField label="Rate Type" value={form.rateType} onChange={(v: string) => update("rateType", v)} options={rateTypes} required={false} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rate Range Min</label>
              <input
                type="number"
                value={form.rateRangeMin}
                onChange={(e) => update("rateRangeMin", e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Rate Range Max</label>
              <input
                type="number"
                value={form.rateRangeMax}
                onChange={(e) => update("rateRangeMax", e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {availableCategories.length > 0 && (
            <div>
              <label className={labelClass}>Categories of Interest</label>
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-9">
          <button
            onClick={() => router.push("/creative/my-profile")}
            className="px-8 py-3.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#E2554F] border-none rounded-lg px-12 py-3.5 cursor-pointer text-white font-bold text-[15px] hover:bg-[#d44a44] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;