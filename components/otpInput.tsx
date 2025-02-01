import { useState } from "react";

const OtpInput = ({ length, onChangeOtp }:{length:number;onChangeOtp:(arg0:string)=>void}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (element:HTMLInputElement, index:number) => {
    const value = element.value;
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < length - 1 && value) {
      (element.nextSibling as HTMLElement)?.focus();
    }

    onChangeOtp(newOtp.join(""));
  };

  const handleBackspace = (element:HTMLInputElement, index:number) => {
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);

    if (index > 0) {
      (element.previousSibling as HTMLElement)?.focus();
    }

    onChangeOtp(newOtp.join(""));
  };

  return (
    <div className="flex flex-row items-center justify-between">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          className="w-[40px] h-[52px] border-[1px] text-medium rounded-md text-center outline-none"
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              handleBackspace(e.target as HTMLInputElement, index);
            }
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;