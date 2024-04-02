import OTPSection from "./components/OTPSection";
import TestCodes from "./components/TestCodes";

export default function Home() {
  const showExampleCodes = process.env.SHOW_EXAMPLE_CODES;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-5">
      <div className="flex flex-col gap-8">
        <OTPSection />
        {showExampleCodes && <TestCodes />}
      </div>
    </main>
  );
}
