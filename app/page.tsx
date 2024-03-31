import OTP from "@/components/OTP";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-950">
      <OTP OTPStructure={[2, "-", 3, "-", 4]} />
    </main>
  );
}
