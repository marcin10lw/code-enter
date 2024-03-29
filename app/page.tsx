import OTP from "@/components/OTP";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <OTP inputsAmt={6} />
    </main>
  );
}
