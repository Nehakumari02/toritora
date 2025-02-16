"use client"
import React, { useEffect, useState } from 'react'

import { backIcon, emailIcon, eyeBlockedIcon, greenTickIcon, lockIcon, redCircleIcon } from '@/constants/icons'
import { useRouter } from 'next/navigation'
import OtpInput from '@/components/otpInput';

import {CodeResponse, useGoogleLogin} from '@react-oauth/google';
import axios from 'axios';

import googleIcon from '@/public/images/onboard/google.png'
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type AuthResult = {
  code: string;
  state?: string;
  clientId?: string;
  error?: string;  // Present in case of an error
};

type ErrorResponse = Pick<CodeResponse, "error" | "error_description" | "error_uri">;

function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [otp,setOtp] = useState("");

  const [timeRemaining,setTimeRemaining] = useState(120);

  const [verificationCodeSent,setVerificationCodeSent] = useState(false);
  
  // Error states for each validation rule
  const [emailError, setEmailError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [uppercaseError, setUppercaseError] = useState(false);
  const [lowercaseError, setLowercaseError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [specialCharError, setSpecialCharError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [loadingCode,setLoadingCode] = useState(false);
  const [loadingValidateCode,setLoadingValidateCode] = useState(false);

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
    if(!email || email === ""){
      toast({
        title: "Error",
        description: `Please enter your email`,
        variant: "destructive"
      })
      return;
    }
    else if(!password || password === "" || lengthError || uppercaseError || lowercaseError || numberError || specialCharError){
      toast({
        title: "Error",
        description: `Please enter valid password`,
        variant: "destructive"
      })
      return;
    }
    else if(password !== confirmPassword){
      toast({
        title: "Error",
        description: `Password and confirm password does not match`,
        variant: "destructive"
      })
      return;
    }

    setLoadingCode(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/email/verificationCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: JSON.stringify({email}),
    });

    if(res.status === 200){
      toast({
        title: "Success",
        description: `Verification code has been sent to ${email}`,
        variant: "success"
      })
      setVerificationCodeSent(true);
    }

    else if(res.status === 500){
      toast({
        title: "Internal server error",
        description: `Server internal error please try after again`,
        variant: "destructive"
      })
    }

    else if(res.status === 204){
      toast({
        title: "Error",
        description: `${email} is already registered`,
        variant: "destructive"
      })
    }
    setLoadingCode(false);
  }

  useEffect(() => {
    if (verificationCodeSent && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationCodeSent, timeRemaining]);

  const handleVerifyCode = async ()=>{
    if(!otp || otp.length !== 6){
      toast({
        title:"Error",
        description:"Please enter your verification code",
        variant:"destructive"
      })
      return
    }

    setLoadingValidateCode(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: JSON.stringify({email,password,otp}),
    });
    console.log(otp)

    const data = await res.json();

    if(res.status === 200){
        toast({
          title: "Success",
          description: `Verification successful redirecting to registration page`,
          variant: "success"
        })
      router.replace("/registerProfile")
      
    }

    else if(res.status === 400){
      toast({
        title: "Error",
        description: `Verification code doesn't match`,
        variant: "destructive"
      })
    }

    console.log(data)
    setLoadingValidateCode(false);
  }

  const resendCode = async ()=>{
    handleSubmit();
    setTimeRemaining(120);
  }

  const formatTime = (seconds:number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const responseGoogle = async (authResult: AuthResult | ErrorResponse) => {
    try {
      if ('code' in authResult) {
        // Handle success case (has 'code')
        const code = authResult.code;
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/signup?code=${code}`,
          {},
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true,
          }
        );
        if (res.status === 204) {
          router.push('/');
          toast({
            title: 'Login Success',
            description: 'User already exists, redirecting to homepage',
            variant: 'success',
          });
        }
        else if (res.status === 205) {
          router.push('/');
          toast({
            title: 'Login Error',
            description: 'User exists, Kindly login with credentials',
            variant: 'destructive',
          });
        } 
        else if (res.status === 200) {
          router.push('/registerProfile');
          toast({
            title: 'Signup Success',
            description: 'User registered successfully',
            variant: 'success',
          });
        }
      } else {
        // Handle error case (does not have 'code')
        console.error("Error during Google login:", authResult.error_description);
        toast({
          title: "Error",
          description: authResult.error_description || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error while signing up: ', error);
    }
  };
  
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  });

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

        <div className='flex-1 py-4 w-full flex-col gap-4 flex items-center justify-center pb-4'>
        <button onClick={handleSubmit} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingCode?<Loader2 className='animate-spin'/>:"Submit"}</button>
        <button onClick={googleLogin} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex gap-2 items-center justify-center text-white rounded-md'><Image src={googleIcon} alt='google' height={32} width={32} className='bg-white rounded-full' /> Sign up with Google</button>
        </div>

      </div>
      }

      {verificationCodeSent &&
      <div className='flex flex-col flex-1 mx-5 py-4 space-y-4 overflow-y-scroll no-scrollbar'>
        <div className='flex flex-col gap-2'>
          <span className='text-[22px] leading-[50px] font-semibold'>Verification</span>
          <p className='text-[14px] leading-[21px] font-medium text-[#959595]'>Enter the verification code that we have sent to your registered email ID.</p>
        </div>

        <div className='space-y-4'>
          <span className='text-[20px] leading-[30px] font-semibold text-[#111111]'>Code</span>
          <OtpInput length={6} onChangeOtp={setOtp} />
        </div>

        <div className='py-4 w-full flex-col flex items-center justify-center'>
          <button onClick={handleVerifyCode} className='w-[80%] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingValidateCode?<Loader2 className='animate-spin'/>:"Verify Code"}</button>
        </div>

        <div className='flex flex-row items-center justify-between'>
          <span className='text-[16px] leading-[24px] font-normal text-[#333333]'>Time Remaining : {formatTime(timeRemaining)}</span>
          <button disabled={timeRemaining !==  0 } onClick={resendCode} className='text-[16px] leading-[24px] font-normal text-[#BDBCBC] underline'>Resend Code?</button>
        </div>

      </div>
      }

    </div>
  )
}

export default Register