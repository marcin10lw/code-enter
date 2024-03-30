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
    if (value.length === 1) {
      index < inputsAmt - 1 && focusInput(index + 1);
      setInputs(value, index);
    }

    if (value.length === 0) {
      const newInputs = [...OTPInputs];

      const currentInputIndex = newInputs.findIndex(
        (input) => typeof input !== "string" && input.index === index
      );
      const nextInputIndex = newInputs.findIndex(
        (input) => typeof input !== "string" && input.index === index + 1
      );
      const lastInputIndex = newInputs.findIndex(
        (input) => typeof input !== "string" && input.index === inputsAmt - 1
      );

      if (index === inputsAmt - 1) {
        // @ts-ignore
        newInputs[lastInputIndex].value = "";
      } else {
        if (currentInputIndex !== -1 && nextInputIndex !== -1) {
          // @ts-ignore
          newInputs[currentInputIndex].value = newInputs[nextInputIndex].value;
          // @ts-ignore
          newInputs[nextInputIndex].value = "";
        }
      }

      index > 0 && focusInput(index - 1);
      setOTPInputs(newInputs);
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

  return (
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
  );
};

export default OTP;
