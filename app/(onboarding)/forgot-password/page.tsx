"use client"
import React, { useEffect, useState } from 'react'

import { backIcon, emailIcon } from '@/constants/icons'
import { useRouter } from 'next/navigation'
import OtpInput from '@/components/otpInput';

import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import LoginImage from '@/public/images/onboard/login.svg'
import { useLocale } from 'next-intl';

function ForgotPassword() {
  const router = useRouter();
  const locale = useLocale();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [timeRemaining, setTimeRemaining] = useState(120);

  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingValidateCode, setLoadingValidateCode] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email)
      setEmailError(!emailRegex.test(email) ? true : false);
  }, [email]);

  const handleGoBack = () => {
    router.back();
  }

  const handleSubmit = async () => {
    if (!email || email === "") {
      toast({
        title: "Error",
        description: `Please enter your email`,
        variant: "destructive"
      })
      return;
    }

    setLoadingCode(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/email/resetPasswordCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ email, locale }),
    });

    if (res.status === 200) {
      toast({
        title: "Success",
        description: `Reset password code has been sent to ${email}`,
        variant: "success"
      })
      setResetCodeSent(true);
    }

    else if (res.status === 500) {
      toast({
        title: "Internal server error",
        description: `Server internal error please try after some time`,
        variant: "destructive"
      })
    }

    else if (res.status === 203) {
      const data = await res.json()
      console.log(data)
      toast({
        title: "Error",
        description: `${data.message}`,
        variant: "destructive"
      })
    }
    setLoadingCode(false);
  }

  useEffect(() => {
    if (resetCodeSent && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resetCodeSent, timeRemaining]);

  const handleVerifyCode = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter your verification code",
        variant: "destructive"
      })
      return
    }

    setLoadingValidateCode(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/VerifyResetPasswordToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    console.log(otp)

    const data = await res.json();

    if (res.status === 200) {
      toast({
        title: "Success",
        description: `Verification successful redirecting to reset password page`,
        variant: "success"
      })
      router.replace("/reset-password")

    }

    else if (res.status === 400) {
      toast({
        title: "Error",
        description: `${data.message}`,
        variant: "destructive"
      })
    }

    else if (res.status === 500) {
      toast({
        title: "Error",
        description: `Internal server error`,
        variant: "destructive"
      })
    }

    console.log(data)
    setLoadingValidateCode(false);
  }

  const resendCode = async () => {
    handleSubmit();
    setTimeRemaining(120);
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='h-[100dvh] flex flex-col'>
      <header className='w-full h-[72px] flex-shrink-0 z-10 sticky top-0 bg-white flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>{resetCodeSent ? "Verification" : "Forgot Password"}</span>
      </header>

      {!resetCodeSent &&

        <div className='md:grid md:grid-cols-2 flex-1 gap-16 md:max-w-[1200px] md:mx-auto'>

          <div className='hidden md:flex flex-1 items-center justify-center'>
            <Image src={LoginImage} alt='Login' height={380} width={380} className='h-[380px] aspect-square cover' />
          </div>

          <div className='flex-1 flex flex-col space-y-8'>
            <div className='flex flex-col flex-1 space-y-4'>

              <div className='flex flex-col flex-1 mx-5 py-4 space-y-4 overflow-y-scroll no-scrollbar'>

                <div className='flex flex-col gap-2'>
                  <span className='text-[22px] leading-[50px] font-semibold'>Enter your email address</span>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Email Id</span>
                    <div className={`relative h-[48px] border-[1px] ${emailError ? "border-[#E10101]" : ""} rounded-md`}>
                      <span className='absolute top-[50%] translate-y-[-50%] left-2'>{emailIcon}</span>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Enter your email' className='h-full pl-8 pr-4 w-full outline-none rounded-md text-[#333333]' />
                    </div>
                  </div>
                </div>

                <div className='flex-1 py-4 w-full flex-col gap-4 flex items-center justify-center pb-4'>
                  <button onClick={handleSubmit} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingCode ? <Loader2 className='animate-spin' /> : "Send"}</button>
                  <button onClick={handleGoBack} className='underline underline-offset-1 text-[14px] leading-[21px] font-medium text-[#333333]'>Back to Sign In</button>
                </div>

              </div>

            </div>
          </div>
        </div>
      }

      {resetCodeSent &&
        <div className='flex flex-col flex-1 mx-5 py-4 space-y-4 md:max-w-[800px] md:mx-auto overflow-y-scroll no-scrollbar'>
          <div className='flex flex-col gap-2'>
            <span className='text-[22px] leading-[50px] font-semibold'>Verification</span>
            <p className='text-[14px] leading-[21px] font-medium text-[#959595]'>Enter the verification code that we have sent to your registered email ID.</p>
          </div>

          <div className='space-y-4'>
            <span className='text-[20px] leading-[30px] font-semibold text-[#111111]'>Code</span>
            <OtpInput length={6} onChangeOtp={setOtp} />
          </div>

          <div className='py-4 w-full flex-col flex items-center justify-center'>
            <button onClick={handleVerifyCode} className='w-[80%] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingValidateCode ? <Loader2 className='animate-spin' /> : "Verify Code"}</button>
          </div>

          <div className='flex flex-row items-center justify-between'>
            <span className='text-[16px] leading-[24px] font-normal text-[#333333]'>Time Remaining : {formatTime(timeRemaining)}</span>
            <button disabled={timeRemaining !== 0} onClick={resendCode} className='text-[16px] leading-[24px] font-normal text-[#BDBCBC] underline'>Resend Code?</button>
          </div>

        </div>
      }
    </div>
  )
}

export default ForgotPassword