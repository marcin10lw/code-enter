"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface OTPProps {
  OTPStructure: (number | string)[];
}

type OTPInput =
  | {
      index: number;
      value: string;
    }
  | string;

const OTP = ({ OTPStructure }: OTPProps) => {
  const [OTPInputs, setOTPInputs] = useState<OTPInput[]>([]);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const inputsAmt = OTPInputs.filter(
    (input) => typeof input !== "string"
  ).length;

  useEffect(() => {
    const newInputs: OTPInput[] = [];
    let newIndex = 0;

    OTPStructure.forEach((item) => {
      if (typeof item === "number") {
        for (let i = 0; i < item; i++) {
          newInputs.push({ index: newIndex, value: "" });
          newIndex++;
        }
      } else {
        newInputs.push(item);
      }
    });

    setOTPInputs(newInputs);
  }, [OTPStructure]);

  const focusInput = (index: number) => {
    inputsRef.current[index].focus();
  };

  const selectInput = (index: number) => {
    inputsRef.current[index].select();
  };

  const setInputs = (value: string, index: number) => {
    setOTPInputs((prevInputs) =>
      prevInputs.map((input) => {
        if (typeof input !== "string" && input.index === index) {
          return {
            ...input,
            value,
          };
        }

        return input;
      })
    );
  };

  const onInputChange = (value: string, index: number) => {
    if (value.length === 1 && value.trim().match(/\d/g)) {
      setInputs(value, index);
      index < inputsAmt - 1 && focusInput(index + 1);
    }

    if (value.length > 1) {
      index < inputsAmt - 1 && focusInput(index + 1);
    }

    if (value.length === 0) {
      index > 0 && focusInput(index - 1);
      setInputs("", index);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      selectInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < inputsAmt - 1) {
      event.preventDefault();
      focusInput(index + 1);
      selectInput(index + 1);
    }

    if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedCode = event.clipboardData.getData("text");
    const pastedCodeChars = pastedCode.split("");

    for (let i = 0; i < pastedCodeChars.length; i++) {
      setInputs(pastedCodeChars[i], i);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mt-4">
        {OTPInputs.map((input, listIndex) => {
          if (typeof input !== "string") {
            return (
              <input
                key={listIndex}
                value={input.value}
                onChange={({ target }) =>
                  onInputChange(target.value, input.index)
                }
                onKeyDown={(event) => onKeyDown(event, input.index)}
                onPaste={onPaste}
                //@ts-ignore
                ref={(el) => el && (inputsRef.current[input.index] = el)}
                className="border border-slate-400 text-xl p-2 size-16 text-center bg-transparent text-white"
              />
            );
          }

          return (
            <span key={listIndex} className="text-white text-xl">
              {input}
            </span>
          );
        })}
      </div>

      <button className="bg-blue-600 rounded-md text-xl p-3 text-white tracking-wide">
        Verify
      </button>
    </div>
  );
};

export default OTP;
