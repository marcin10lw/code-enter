import OTP from "@/app/OTP";
import TestCodes from "./TestCodes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-5">
      <div className="flex flex-col gap-8">
        <OTP OTPStructure={[3, "-", 3, "-", 3]} />
        <TestCodes />
      </div>
    </main>
  );
}
