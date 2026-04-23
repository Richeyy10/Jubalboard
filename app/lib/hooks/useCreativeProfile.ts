import { useState, useEffect } from 'react';
import { apiRequest, ApiError } from '../api';

export interface CreativeProfileData {
  fullName: string;
  avatar?: string;
  dateOfBirth?: string;
  contactNumber: string;
  countryState: string;
  streetAddress: string;
  postalCode?: string;
  preferredSocialLinks: string[];
  describeYourselfInOneLine: string;
  languagePreference: string;
  preferredCommunication: string;
  professionalRole: string;
  categoriesOfInterest: string[];
  currency: string;
  rateRangeMin: number;
  rateRangeMax: number;
  rateType: string;
  portfolioImages: string[];
  yearsOfExperience: number;
  completedProjects: number;
  averageRating: number;
  totalReviews: number;
  jobSuccessRate: number;
}

export const useCreativeProfile = () => {
  const [profile, setProfile] = useState<CreativeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get session token
      const tokenRes = await fetch("/api/auth/session/token", {
        credentials: "include",
      });
      const { token } = await tokenRes.json();
      if (!token) throw new Error("No authorization token found.");

      // 2. Single fetch — everything is in /api/v1/creatives/me
      const response = await apiRequest<any>("/api/v1/creatives/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Drill into the real data shape from the raw response logs
      // Structure: response.data.data => { name, creativeProfile, ... }
      const payload = response.data?.data || response.data;
      if (!payload) throw new Error("Empty payload from server.");

      const { name, creativeProfile } = payload;

      // Name
      const extractedName = creativeProfile?.fullName || name || "Creative";

      // Avatar — backend field is imageUrl on creativeProfile
      const extractedAvatar = creativeProfile?.imageUrl || null;

      // Categories — array of strings or { id, name } objects
      const extractedCategories = (creativeProfile?.categoriesOfInterest || []).map(
        (cat: any) => (typeof cat === "string" ? cat : cat.name)
      );

      // Portfolio — array of { fileUrl, ... } objects
      const extractedPortfolio = (creativeProfile?.portfolios || [])
        .map((p: any) => p.fileUrl)
        .filter(Boolean);

      // Social links — already an array of strings
      const extractedSocialLinks = (creativeProfile?.preferredSocialLinks || []).filter(Boolean);

      setProfile({
        fullName: extractedName,
        avatar: extractedAvatar,
        dateOfBirth: creativeProfile?.dateOfBirth || '',
        contactNumber: creativeProfile?.contactNumber || '',
        countryState: creativeProfile?.countryState || '',
        streetAddress: creativeProfile?.streetAddress || '',
        postalCode: creativeProfile?.postalCode || '',
        preferredSocialLinks: extractedSocialLinks,
        describeYourselfInOneLine: creativeProfile?.describeYourselfInOneLine || '',
        languagePreference: creativeProfile?.languagePreference || 'en',
        preferredCommunication: creativeProfile?.preferredCommunication || 'CHAT_ONLY',
        professionalRole: creativeProfile?.professionalRole || 'Creative Professional',
        categoriesOfInterest: extractedCategories,
        currency: creativeProfile?.currency || 'USD',
        rateRangeMin: creativeProfile?.rateRangeMin || 0,
        rateRangeMax: creativeProfile?.rateRangeMax || 0,
        rateType: creativeProfile?.rateType || 'HOURLY',
        portfolioImages: extractedPortfolio,
        yearsOfExperience: 0, // not in API response — update if backend adds it
        completedProjects: creativeProfile?.totalCompletedProjects || 0,
        averageRating: creativeProfile?.overallRating || 0,
        totalReviews: creativeProfile?.totalReviews || 0,
        jobSuccessRate: creativeProfile?.jobSuccessRate || 0,
      });

    } catch (err) {
      console.error("Profile Fetch Error:", err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to sync profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};