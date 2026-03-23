import { Suspense } from "react";
import VerifyEmail from "../components/home/VerifyEmail";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}