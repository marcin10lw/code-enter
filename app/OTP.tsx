"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const isDigitChar = (value: string) => value.match(/\d/g);

interface OTPProps {
  OTPStructure: (number | string)[];
  autoFocus?: boolean;
}

type OTPInput = {
  index: number;
  value: string;
};

const OTP = ({ OTPStructure, autoFocus = true }: OTPProps) => {
  const [OTPInputs, setOTPInputs] = useState<(OTPInput | string)[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const filteredOTPInputs = OTPInputs.filter(
    (input): input is OTPInput => typeof input !== "string",
  );

  const inputsAmount = filteredOTPInputs.length;

  const disabled = filteredOTPInputs.some((input) => input.value === "");

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
  }, [OTPStructure, autoFocus]);

  const focusInput = (index: number, action?: "prev" | "next") => {
    if (action === "prev" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (action === "next" && index < inputsAmount - 1) {
      inputRefs.current[index + 1].focus();
    } else {
      inputRefs.current[index].focus();
    }
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
    if (value.length === 0) {
      focusInput(index, "prev");
      setInputs("", index);
    } else {
      if (isDigitChar(value.trim())) {
        setInputs(value.slice(-1), index);
        focusInput(index, "next");
      }
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusInput(index, "prev");
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusInput(index, "next");
    }

    if (event.key === "Backspace" && !event.currentTarget.value) {
      event.preventDefault();
      focusInput(index, "prev");
    }
  };

  const getSanitizedPastedCode = (code: string): string => {
    let sanitizedCode = "";

    code.split("").forEach((char) => {
      if (isDigitChar(char)) {
        sanitizedCode += char;
      }
    });
    console.log(sanitizedCode);
    return sanitizedCode.slice(0, inputsAmount);
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData.getData("text").trim();
    const sanitizedPastedCode = getSanitizedPastedCode(pastedCode);

    for (let i = 0; i < sanitizedPastedCode.length; i++) {
      setInputs(sanitizedPastedCode[i], i);
    }

    if (sanitizedPastedCode.length < inputsAmount) {
      focusInput(sanitizedPastedCode.length);
    } else {
      focusInput(inputsAmount - 1);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) return;

    const finalCode = OTPInputs.reduce((acc, input) => {
      if (typeof input !== "string") {
        return acc + input.value;
      } else {
        return acc + input;
      }
    }, "");

    alert(finalCode);
  };

  return (
    OTPInputs.length > 0 && (
      <section className="rounded-md bg-slate-800 p-6">
        <h1 className="mb-6 text-center text-2xl text-slate-200">
          Enter verification code
        </h1>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
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
                    ref={(el) => {
                      el && (inputRefs.current[input.index] = el);
                    }}
                    autoFocus={autoFocus && input.index === 0}
                    className="h-16 w-full max-w-16 border border-slate-400 bg-transparent text-center text-xl text-slate-200"
                  />
                );
              }

              return (
                <span key={listIndex} className="text-xl text-slate-200">
                  {input}
                </span>
              );
            })}
          </div>

          <button
            disabled={disabled}
            className="rounded-sm bg-blue-600 p-3 text-xl tracking-wide text-white hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
          >
            Verify
          </button>
        </form>
      </section>
    )
  );
};

export default OTP;
