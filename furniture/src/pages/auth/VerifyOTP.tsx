import { VerifyOTPForm } from "@/components/auth/VerifyOTPForm";

export default function VerifyOTP() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyOTPForm />
      </div>
    </div>
  );
}
