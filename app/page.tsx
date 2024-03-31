import OTP from "@/app/OTP";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-5">
      <OTP OTPStructure={[3, "-", 3, "-", 3]} />
    </main>
  );
}
