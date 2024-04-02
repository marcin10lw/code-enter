"use client";

import OTP from "./OTP";

const OTPSection = () => {
  const onSubmit = (value: string) => {
    alert(value);
    // BUSINESS LOGIC
  };

  return <OTP OTPStructure={[3, "-", 3, "-", 3]} onSubmit={onSubmit} />;
};

export default OTPSection;
