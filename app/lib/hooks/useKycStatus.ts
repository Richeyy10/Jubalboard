import { useEffect, useState } from "react";

export type KycStatus = "UNVERIFIED" | "PENDING" | "PROVIDER_APPROVED" | "DECLINED" | null;

export const useKycStatus = () => {
  const [kycStatus, setKycStatus] = useState<KycStatus>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const tokenRes = await fetch("/api/auth/session/token");
      const { token } = await tokenRes.json();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verification/status`,
        { headers: { Authorization: `Bearer ${token}` }, credentials: "include" }
      );

      if (res.ok) {
        const data = await res.json();
        // Get the userData to match contextType
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const contextType = `${userData.userType}_${userData.accountType}`;

        // Find the matching context entry
        const entry = Array.isArray(data) 
          ? data.find((d: any) => d.contextType === contextType)
          : null;

        const status = entry?.status ?? "UNVERIFIED";
        setKycStatus(status);

        // Keep localStorage in sync
        if (userData.kycStatus !== status) {
          userData.kycStatus = status;
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      }
    } catch (e) {
      console.warn("Could not fetch KYC status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  return { kycStatus, loading, refetch: fetchStatus };
};