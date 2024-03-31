import OTP from "@/components/OTP";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950">
      <OTP OTPStructure={[3, "-", 3, "-", 2]} autoFocus />
    </main>
  );
}
