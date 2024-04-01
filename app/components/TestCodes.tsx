"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

const exampleCodes = [
  {
    id: 1,
    code: "1234",
    text: "code will spread and next input will be focused",
  },
  {
    id: 2,
    code: "1234567890987654321",
    text: "excess code will be cut off",
  },
  {
    id: 3,
    code: "9k8j7h6g56f4d3s2a10987",
    text: "non digits characters will be ignored and excess code cut off",
  },
];

const TestCodes = () => {
  const [copied, setCopied] = useState<number | null>(null);

  const copyCodeToClipboard = async (id: number, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(id);
      setTimeout(() => {
        setCopied(null);
      }, 3000);
    } catch (error) {
      console.log("Failed to copy code:", error);
    }
  };
  return (
    <section className="w-full rounded-md bg-slate-800 p-6 text-slate-200">
      <h2 className="text-2xl">Testing codes</h2>
      <p className="mt-2">
        Here you can find example codes to test copy paste functionality
      </p>
      <ul className="mt-4 flex list-disc flex-col gap-4 pl-8 text-slate-100">
        {exampleCodes.map(({ id, code, text }) => (
          <li key={id}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-wide">{code}</span>{" "}
                <CopyButton
                  copied={id === copied}
                  onClick={() => copyCodeToClipboard(id, code)}
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span>-</span>
                <p>{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TestCodes;
