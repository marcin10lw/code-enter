"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

interface OTPProps {
  OTPStructure: (number | string)[];
}

type OTPInput = {
  index: number;
  value: string;
};

const OTP = ({ OTPStructure }: OTPProps) => {
  const [OTPInputs, setOTPInputs] = useState<(OTPInput | string)[]>([]);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const filteredOTPInputs = OTPInputs.filter(
    (input): input is OTPInput => typeof input !== "string",
  );

  const inputsAmt = filteredOTPInputs.length;

  useEffect(() => {
    const newInputs: (OTPInput | string)[] = [];
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

  const isDigitChar = (value: string) => value.match(/\d/g);

  const focusInput = (index: number, action?: "prev" | "next") => {
    if (action === "prev" && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (action === "next" && index < inputsAmt - 1) {
      inputsRef.current[index + 1].focus();
    } else {
      inputsRef.current[index].focus();
    }
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
      }),
    );
  };

  const onInputChange = (value: string, index: number) => {
    if (value.length === 1 && isDigitChar(value.trim())) {
      setInputs(value, index);
      focusInput(index, "next");
    }

    if (value.length > 1) {
      focusInput(index, "next");
    }

    if (value.length === 0) {
      focusInput(index, "prev");
      setInputs("", index);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index, "prev");
      selectInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < inputsAmt - 1) {
      event.preventDefault();
      focusInput(index, "next");
      selectInput(index + 1);
    }

    if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
      event.preventDefault();
      focusInput(index, "prev");
    }
  };

  const getSanitizedPastedCode = (code: string): string => {
    let sanitizedCode = "";

    code.split("").forEach((char) => {
      if (isDigitChar(char)) {
        sanitizedCode = sanitizedCode.concat(char);
      }
    });

    return sanitizedCode.slice(0, inputsAmt);
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData.getData("text").trim();
    const sanitizedPastedCode = getSanitizedPastedCode(pastedCode.trim());

    for (let i = 0; i < sanitizedPastedCode.length; i++) {
      setInputs(sanitizedPastedCode[i], i);
    }

    if (sanitizedPastedCode.length < inputsAmt) {
      focusInput(sanitizedPastedCode.length);
    } else {
      focusInput(inputsAmt - 1);
    }
  };

  const disabled = filteredOTPInputs.some((input) => input.value === "");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) return;

    const finalCode = filteredOTPInputs.reduce(
      (acc, { value }) => acc + value,
      "",
    );

    alert(finalCode);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="mt-4 flex items-center gap-2">
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
                className="size-16 border border-slate-400 bg-transparent p-2 text-center text-xl text-white"
              />
            );
          }

          return (
            <span key={listIndex} className="text-xl text-white">
              {input}
            </span>
          );
        })}
      </div>

      <button
        disabled={disabled}
        className="rounded-sm bg-blue-600 p-3 text-xl tracking-wide text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-70"
      >
        Verify
      </button>
    </form>
  );
};

export default OTP;
