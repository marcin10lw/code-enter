"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface CodeEnterProps {
  inputsAmt: number;
}

const OTP = ({ inputsAmt }: CodeEnterProps) => {
  const [inputs, setInputs] = useState<string[]>(new Array(inputsAmt).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const onInputChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newInputs: string[] = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    if (value.length === 1 && index < inputsAmt - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (value.length === 0 && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputsRef.current[index - 1].focus();
    }

    if (event.key === "ArrowRight" && index < inputsAmt - 1) {
      event.preventDefault();
      inputsRef.current[index + 1].focus();
    }
  };

  return (
    <div>
      {inputs.map((input, index) => {
        return (
          <input
            key={index}
            value={input}
            onChange={({ target }) => onInputChange(target.value, index)}
            onKeyUp={(event) => onKeyDown(event, index)}
            // @ts-ignores
            ref={(el) => el && (inputsRef.current[index] = el)}
            type="text"
            className="border border-purple p-2 size-14"
            maxLength={1}
          />
        );
      })}
    </div>
  );
};

export default OTP;
