"use client"
import React, { useEffect, useState } from 'react'

import { backIcon, emailIcon, eyeBlockedIcon, greenTickIcon, lockIcon, redCircleIcon } from '@/constants/icons'
import { useRouter } from 'next/navigation'

function Register() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [verificationCodeSent,setVerificationCodeSent] = useState(false);
  
  // Error states for each validation rule
  const [emailError, setEmailError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [uppercaseError, setUppercaseError] = useState(false);
  const [lowercaseError, setLowercaseError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [specialCharError, setSpecialCharError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email)
    setEmailError( !emailRegex.test(email) ? true : false);
  }, [email]);

  useEffect(() => {
    if(password){
      setLengthError(password.length >= 8 ? false : true );
      setUppercaseError(/[A-Z]/.test(password) ? false : true );
      setLowercaseError(/[a-z]/.test(password) ? false : true );
      setNumberError(/\d/.test(password) ? false : true );
      setSpecialCharError(/[\W_]/.test(password) ? false : true);
    }
  }, [password]);

  useEffect(() => {
    setConfirmPasswordError(confirmPassword && confirmPassword !== password ? true : false);
  }, [confirmPassword, password]);

  const handleGoBack = ()=>{
    router.back();
  }

  const handleSubmit = async ()=>{
    setVerificationCodeSent(true);
  }

  const handleVerifyCode = async ()=>{
    setVerificationCodeSent(false);
  }

  return (
    <div className='h-[100dvh] flex flex-col'>
      <header className='relative w-full h-[72px] flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>{verificationCodeSent ? "Verification" : "Register"}</span>
      </header>

      {!verificationCodeSent &&
      <div className='flex flex-col flex-1 mx-5 py-4 space-y-4 overflow-y-scroll no-scrollbar'>

        <div className='flex flex-col gap-2'>
          <span className='text-[22px] leading-[50px] font-semibold'>Register your account</span>
          <p className='text-[14px] leading-[21px] font-medium text-[#959595]'>Please register to continue</p>
        </div>
        
        <div className='space-y-4'>
          <div className='space-y-2'>
            <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Email Id</span>
            <div className={`relative h-[48px] border-[1px] ${emailError ? "border-[#E10101]" : ""} rounded-md`}>
              <span className='absolute top-[50%] translate-y-[-50%] left-2'>{emailIcon}</span>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder='Enter your username' className='h-full pl-8 pr-4 w-full outline-none rounded-md text-[#333333]'/>
            </div>
          </div>

          <div className='space-y-2'>
            <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Password</span>
            <div className={`relative h-[48px] border-[1px] ${lengthError || uppercaseError || lowercaseError || numberError || specialCharError ? "border-[#E10101]" : ""} rounded-md`}>
              <span className='absolute top-[50%] translate-y-[-50%] left-2'>{lockIcon}</span>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Enter your password' className='h-full pl-8 pr-8 w-full outline-none rounded-md text-[#333333]'/>
              <span className='absolute top-[50%] translate-y-[-50%] right-2'>{eyeBlockedIcon}</span>
            </div>
          </div>

          <div className='space-y-2'>
            <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Re-enter Password</span>
            <div className={`relative h-[48px] border-[1px] ${confirmPasswordError? "border-[#E10101]":""} rounded-md`}>
              <span className='absolute top-[50%] translate-y-[-50%] left-2'>{lockIcon}</span>
              <input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" placeholder='Enter your password' className='h-full pl-8 pr-8 w-full outline-none rounded-md text-[#333333]'/>
              <span className='absolute top-[50%] translate-y-[-50%] right-2'>{eyeBlockedIcon}</span>
            </div>
            {confirmPasswordError &&  <span className="text-[#E10101] text-[12px] leading-[18px] font-medium">Password doesn&apos;t match</span> }
          </div>

          <div className='space-y-4'>
            <span className='text-[14px] leading-[26px] font-semibold'>Password Conditions</span>
            <div className='space-y-2'>
              <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{lengthError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${lengthError ? "E10101": "text-[#333333]"}`}>Must be at least 8 characters long</span></div>
              <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{uppercaseError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${uppercaseError ? "E10101": "text-[#333333]"}`}>Must include at least 1 upper case character</span></div>
              <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{lowercaseError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${lowercaseError ? "E10101": "text-[#333333]"}`}>Must include at least 1 lower case character</span></div>
              <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{numberError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${numberError ? "E10101": "text-[#333333]"}`}>Must include at least 1 numeric character</span></div>
              <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{specialCharError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${specialCharError ? "E10101": "text-[#333333]"}`}>Must include at least 1 special character (Ex. @ # $ % ! & *)</span></div>
            </div>
          </div>

        </div>

        <div className='flex-1 py-4 w-full flex-col flex items-center justify-center'>
        <button onClick={handleSubmit} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Submit</button>
        </div>

      </div>
      }

      {verificationCodeSent &&
      <div className='flex flex-col flex-1 mx-5 py-4 space-y-4 overflow-y-scroll no-scrollbar'>
        <div className='flex flex-col gap-2'>
          <span className='text-[22px] leading-[50px] font-semibold'>Verification</span>
          <p className='text-[14px] leading-[21px] font-medium text-[#959595]'>Enter the verification code that we have sent to your registered email ID.</p>
        </div>

        <div>
          <span className='text-[20px] leading-[30px] font-semibold text-[#111111]'>Code</span>

        </div>

        <div className='py-4 w-full flex-col flex items-center justify-center'>
        <button onClick={handleVerifyCode} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Verify Code</button>
        </div>

      </div>
      }

    </div>
  )
}

export default Register