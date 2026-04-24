"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

declare global {
  interface Window { snsWebSdk: any; }
}

const KycClient = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sdkInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const launch = async () => {
      try {
        const tokenRes = await fetch("/api/auth/session/token");
        const { token } = await tokenRes.json();
        if (!token) throw new Error("Unauthorized");

        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const contextType = `${userData.userType}_${userData.accountType}`;

        const statusRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verification/status`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const statusData = await statusRes.json();
        const list = Array.isArray(statusData)
          ? statusData
          : Array.isArray(statusData?.data)
          ? statusData.data
          : [];

        const existing = list.find((d: any) => d.contextType === contextType) ?? null;
        const isDeclined = existing?.status === "DECLINED";
        const statusFailed = !statusRes.ok;

        let sdkToken: string | null = null;

        if (isDeclined) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verification/resubmit`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ contextType, verificationType: "IDENTITY" }),
            }
          );
          const data = await res.json();
          sdkToken = data?.data?.sdkToken ?? data?.sdkToken ?? null;

        } else if (existing || statusFailed) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verification/token-refresh`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ contextType, verificationType: "IDENTITY" }),
            }
          );
          const data = await res.json();
          sdkToken = data?.data?.sdkToken ?? data?.sdkToken ?? null;

        } else {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verification/submit`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ contextType, verificationType: "IDENTITY" }),
            }
          );
          const data = await res.json();
          sdkToken = data?.data?.sdkToken ?? data?.sdkToken ?? null;
        }

        if (!sdkToken) throw new Error("No SDK token returned.");
        if (!isMounted) return;

        const getNewToken = () =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verification/token-refresh`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ contextType, verificationType: "IDENTITY" }),
            }
          )
            .then((r) => r.json())
            .then((d) => d?.data?.sdkToken ?? d?.sdkToken ?? "");

        // Remove any existing script first
        const existing_script = document.querySelector(
          'script[src="https://static.sumsub.com/idensic/static/sns-websdk-builder.js"]'
        );
        if (existing_script) existing_script.remove();

        const script = document.createElement("script");
        script.src = "https://static.sumsub.com/idensic/static/sns-websdk-builder.js";
        script.async = true;
        script.id = "sumsub-script";

        script.onload = () => {
          if (!isMounted || !window.snsWebSdk) {
            setError("SumSub SDK failed to initialize.");
            return;
          }

          const instance = window.snsWebSdk
            .init(sdkToken, getNewToken)
            .withConf({ lang: "en", hideSumsubId: true })
            .withOptions({ addViewportTag: false, adaptIframeHeight: true })
            .on("idCheck.onApplicantSubmitted", () => {
              if (!isMounted) return;
              const ud = JSON.parse(localStorage.getItem("userData") || "{}");
              ud.kycStatus = "PENDING";
              localStorage.setItem("userData", JSON.stringify(ud));
              router.push("/creative/dashboard");
            })
            .on("idCheck.onApplicantResubmitted", () => {
              if (!isMounted) return;
              const ud = JSON.parse(localStorage.getItem("userData") || "{}");
              ud.kycStatus = "PENDING";
              localStorage.setItem("userData", JSON.stringify(ud));
              router.push("/creative/dashboard");
            })
            .on("idCheck.onError", (err: any) => {
              console.error("SumSub error:", err);
              if (isMounted) setError("Something went wrong. Please try again.");
            })
            .build();

          instance.launch("#sumsub-container");
          sdkInstanceRef.current = instance;

          if (isMounted) setLoading(false);
        };

        script.onerror = () => {
          if (isMounted) {
            setError("Failed to load verification SDK.");
            setLoading(false);
          }
        };

        document.head.appendChild(script);
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || "An unexpected error occurred.");
          setLoading(false);
        }
      }
    };

    launch();

    return () => {
      isMounted = false;

      // Destroy SDK instance
      if (sdkInstanceRef.current) {
        try { sdkInstanceRef.current.destroy?.(); } catch (_) {}
        sdkInstanceRef.current = null;
      }

      // Remove script
      const s = document.getElementById("sumsub-script");
      if (s) s.remove();

      // Clear container
      const container = document.getElementById("sumsub-container");
      if (container) container.innerHTML = "";

      // Clear SDK global
      try { delete window.snsWebSdk; } catch (_) {}
    };
  }, []);

  return (
    <div className="flex flex-col items-center flex-1 py-10 px-4">
      <h1 className="text-[28px] font-black text-[#1a1a2e] mb-2">
        Identity Verification
      </h1>
      <p className="text-gray-500 text-[14px] mb-8 text-center max-w-md">
        Complete the steps below to verify your identity and unlock full access.
      </p>

      {loading && (
        <div className="flex flex-col items-center gap-3 mt-20">
          <Loader2 size={36} className="animate-spin text-[#2196F3]" />
          <p className="text-gray-500 text-sm">
            Setting up your verification session...
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-5 py-4 max-w-md w-full mt-10">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div id="sumsub-container" className="w-full max-w-2xl min-h-[600px]" />
    </div>
  );
};

export default KycClient;