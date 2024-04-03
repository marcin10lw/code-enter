"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const isDigitChar = (value: string) => value.match(/^\d+$/);

interface OTPProps {
  OTPStructure: (number | string)[];
  autoFocus?: boolean;
  onSubmit: (value: string) => void;
}

type OTPInput = {
  index: number;
  value: string;
};

const isOTPInputArray = (input: any): input is OTPInput[] =>
  typeof input !== "string";

const OTP = ({ OTPStructure, autoFocus = true, onSubmit }: OTPProps) => {
  const [OTPInputsStruct, setOTPInputsStruct] = useState<
    (OTPInput[] | string)[]
  >([]);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const filteredOTPInputs = OTPInputsStruct.filter(isOTPInputArray);

  const inputsAmount = filteredOTPInputs.reduce(
    (previousValue, currentValue) => previousValue + currentValue.length,
    0,
  );

  const disabled = filteredOTPInputs.some((struct) =>
    struct.some((input) => input.value === ""),
  );

  useEffect(() => {
    const newInputs: (OTPInput[] | string)[] = [];
    let structIndex = 0;
    let inputIndex = 0;

    OTPStructure.forEach((item) => {
      if (typeof item === "number") {
        const inputsList: OTPInput[] = [];

        for (let i = 0; i < item; i++) {
          inputsList.push({ index: inputIndex, value: "" });
          inputIndex++;
        }

        newInputs[structIndex] = inputsList;
      } else {
        newInputs.push(item);
      }

      structIndex = newInputs.length;
    });

    setOTPInputsStruct(newInputs);
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

  const updateInputs = (value: string, index: number) => {
    const newInputsStruct = [...OTPInputsStruct];
    const otpStructIndex = newInputsStruct.findIndex(
      (struct) =>
        isOTPInputArray(struct) &&
        struct.find((input) => input.index === index),
    );

    const inputList = newInputsStruct[otpStructIndex];

    if (isOTPInputArray(inputList)) {
      const inputArrayIndex = inputList.findIndex(
        (input) => input.index === index,
      );

      inputList[inputArrayIndex].value = value;
    }

    setOTPInputsStruct(newInputsStruct);
  };

  const onInputChange = (value: string, index: number) => {
    const lastChar = value.slice(-1).trim();

    if (!isDigitChar(lastChar)) return;

    if (value.length > 0) {
      updateInputs(lastChar, index);
      focusInput(index, "next");
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

    if (event.key === "Backspace") {
      event.preventDefault();
      updateInputs("", index);
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

    return sanitizedCode.slice(0, inputsAmount);
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData.getData("text").trim();
    const sanitizedPastedCode = getSanitizedPastedCode(pastedCode);

    for (let i = 0; i < sanitizedPastedCode.length; i++) {
      updateInputs(sanitizedPastedCode[i], i);
    }

    if (sanitizedPastedCode.length < inputsAmount) {
      focusInput(sanitizedPastedCode.length);
    } else {
      focusInput(inputsAmount - 1);
    }
  };

  const onCodeVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) return;

    const finalCode = OTPInputsStruct.reduce((acc, struct) => {
      if (isOTPInputArray(struct)) {
        return acc + struct.reduce((acc, input) => acc + input.value, "");
      }

      return acc + struct;
    }, "") as string;

    onSubmit(finalCode);
  };

  return OTPInputsStruct.length > 0 ? (
    <section className="rounded-md bg-slate-800 p-6">
      <h1 className="mb-8 text-center text-2xl text-slate-200">
        Enter verification code
      </h1>
      <form
        onSubmit={onCodeVerify}
        noValidate
        className="flex flex-col items-center gap-10"
      >
        <div className="relative">
          <div className="flex flex-col items-center gap-1 sm:flex-row md:gap-2">
            {OTPInputsStruct.map((struct, structIndex) => {
              if (isOTPInputArray(struct)) {
                return (
                  <div key={structIndex} className="flex items-center gap-2">
                    {struct.map((input) => (
                      <input
                        key={input.index}
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
                        type="tel"
                      />
                    ))}
                  </div>
                );
              }

              return (
                <span key={structIndex} className="text-xl text-slate-200">
                  {struct}
                </span>
              );
            })}
          </div>

          {disabled && (
            <p className="absolute top-[calc(100%_+_6px)] w-full text-center text-rose-700">
              Please fill all fields
            </p>
          )}
        </div>

        <button
          disabled={disabled}
          className="w-full rounded-sm bg-blue-600 p-3 text-xl tracking-wide text-white hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
        >
          Verify
        </button>
      </form>
    </section>
  ) : null;
};

export default OTP;
