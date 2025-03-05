"use client"
import React, { useEffect, useState } from 'react'

import { backIcon, emailIcon, eyeBlockedIcon, greenTickIcon, lockIcon, redCircleIcon } from '@/constants/icons'
import { useRouter } from 'next/navigation'
import OtpInput from '@/components/otpInput';

import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import googleIcon from '@/public/images/onboard/google.png'
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import LoginImage from '@/public/images/onboard/login.svg'
import Link from 'next/link';

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [timeRemaining, setTimeRemaining] = useState(120);

  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordVisibility1, setPasswordVisibility1] = useState(false);


  // Error states for each validation rule
  const [emailError, setEmailError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [uppercaseError, setUppercaseError] = useState(false);
  const [lowercaseError, setLowercaseError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [specialCharError, setSpecialCharError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingValidateCode, setLoadingValidateCode] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email)
      setEmailError(!emailRegex.test(email) ? true : false);
  }, [email]);

  useEffect(() => {
    if (password) {
      setLengthError(password.length >= 8 ? false : true);
      setUppercaseError(/[A-Z]/.test(password) ? false : true);
      setLowercaseError(/[a-z]/.test(password) ? false : true);
      setNumberError(/\d/.test(password) ? false : true);
      setSpecialCharError(/[\W_]/.test(password) ? false : true);
    }
  }, [password]);

  useEffect(() => {
    setConfirmPasswordError(confirmPassword && confirmPassword !== password ? true : false);
  }, [confirmPassword, password]);

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
    else if (!password || password === "" || lengthError || uppercaseError || lowercaseError || numberError || specialCharError) {
      toast({
        title: "Error",
        description: `Please enter valid password`,
        variant: "destructive"
      })
      return;
    }
    else if (password !== confirmPassword) {
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
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    if (res.status === 200) {
      toast({
        title: "Success",
        description: `Verification code has been sent to ${email}`,
        variant: "success"
      })
      setVerificationCodeSent(true);
    }

    else if (res.status === 500) {
      toast({
        title: "Internal server error",
        description: `Server internal error please try after again`,
        variant: "destructive"
      })
    }

    else if (res.status === 204) {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ email, password, otp }),
    });
    console.log(otp)

    const data = await res.json();

    if (res.status === 200) {
      toast({
        title: "Success",
        description: `Verification successful redirecting to registration page`,
        variant: "success"
      })
      router.replace("/registerProfile")

    }

    else if (res.status === 400) {
      toast({
        title: "Error",
        description: `Verification code doesn't match`,
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

        const data = res.data;
        if (res.status === 201) {
          localStorage.setItem('userProfession', data?.user?.profession);
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
        else if (res.status === 202) {
          router.push("/registerProfile");
          toast({
            title: "Success",
            description: "Profile pending redirecting...",
            variant: "success"
          })
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
      <header className='w-full h-[72px] flex-shrink-0 z-10 sticky top-0 bg-white flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>{verificationCodeSent ? "Verification" : "Register"}</span>
      </header>

      {!verificationCodeSent &&

        <div className='md:grid md:grid-cols-2 flex-1 gap-16 md:max-w-[1200px] md:mx-auto'>

          <div className='hidden md:flex flex-1 items-center justify-center'>
            <Image src={LoginImage} alt='Login' height={380} width={380} className='h-[380px] aspect-square cover' />
          </div>

          <div className='flex-1 flex flex-col space-y-8'>
            <div className='flex flex-col flex-1 space-y-4'>

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
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Enter your username' className='h-full pl-8 pr-4 w-full outline-none rounded-md text-[#333333]' />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Password</span>
                    <div className={`relative h-[48px] border-[1px] ${lengthError || uppercaseError || lowercaseError || numberError || specialCharError ? "border-[#E10101]" : ""} rounded-md`}>
                      <span className='absolute top-[50%] translate-y-[-50%] left-2'>{lockIcon}</span>
                      <input value={password} onChange={(e) => setPassword(e.target.value)} type={passwordVisibility ? "text" : "password"} placeholder='Enter your password' className='h-full pl-8 pr-8 w-full outline-none rounded-md text-[#333333]' />
                      <button className='absolute top-[11px] md:top-[18px] right-[12px]' onClick={() => setPasswordVisibility(!passwordVisibility)}>{passwordVisibility ? hiddenPasswordIcon : showPasswrodIcon}</button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Re-enter Password</span>
                    <div className={`relative h-[48px] border-[1px] ${confirmPasswordError ? "border-[#E10101]" : ""} rounded-md`}>
                      <span className='absolute top-[50%] translate-y-[-50%] left-2'>{lockIcon}</span>
                      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={passwordVisibility1 ? "text" : "password"} placeholder='Enter your password' className='h-full pl-8 pr-8 w-full outline-none rounded-md text-[#333333]' />
                      <button className='absolute top-[11px] md:top-[18px] right-[12px]' onClick={() => setPasswordVisibility1(!passwordVisibility1)}>{passwordVisibility1 ? hiddenPasswordIcon : showPasswrodIcon}</button>
                    </div>
                    {confirmPasswordError && <span className="text-[#E10101] text-[12px] leading-[18px] font-medium">Password doesn&apos;t match</span>}
                  </div>

                  <div className='space-y-4'>
                    <span className='text-[14px] leading-[26px] font-semibold'>Password Conditions</span>
                    <div className='space-y-2'>
                      <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{lengthError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${lengthError ? "E10101" : "text-[#333333]"}`}>Must be at least 8 characters long</span></div>
                      <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{uppercaseError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${uppercaseError ? "E10101" : "text-[#333333]"}`}>Must include at least 1 upper case character</span></div>
                      <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{lowercaseError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${lowercaseError ? "E10101" : "text-[#333333]"}`}>Must include at least 1 lower case character</span></div>
                      <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{numberError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${numberError ? "E10101" : "text-[#333333]"}`}>Must include at least 1 numeric character</span></div>
                      <div className='flex items-start gap-2 relative pl-8'><span className='absolute top-[5px] left-2'>{specialCharError ? redCircleIcon : greenTickIcon}</span> <span className={`text-[12px] leading-[24px] font-normal ${specialCharError ? "E10101" : "text-[#333333]"}`}>Must include at least 1 special character (Ex. @ # $ % ! & *)</span></div>
                    </div>
                  </div>

                </div>

                <div className='flex-1 py-4 w-full flex-col gap-4 flex items-center justify-center pb-4'>
                  <button onClick={handleSubmit} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingCode ? <Loader2 className='animate-spin' /> : "Submit"}</button>
                  <button onClick={googleLogin} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex gap-2 items-center justify-center text-white rounded-md'><Image src={googleIcon} alt='google' height={32} width={32} className='bg-white rounded-full' /> Sign up with Google</button>
                </div>

              </div>

            </div>
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
            <button onClick={handleVerifyCode} className='w-[80%] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingValidateCode ? <Loader2 className='animate-spin' /> : "Verify Code"}</button>
          </div>

          <div className='flex flex-row items-center justify-between'>
            <span className='text-[16px] leading-[24px] font-normal text-[#333333]'>Time Remaining : {formatTime(timeRemaining)}</span>
            <button disabled={timeRemaining !== 0} onClick={resendCode} className='text-[16px] leading-[24px] font-normal text-[#BDBCBC] underline'>Resend Code?</button>
          </div>

        </div>
      }

      <div className='mx-5 py-5 flex items-center justify-center h-[100px] border-t-[1px] border-primary border-opacity-20'>
        <span className='text-[15px] leading-[22px] font-medium text-[#6C7178]'>Already have an account? <Link href={'/login'} className='text-[16px] leading-[24px] font-semibold text-secondary'>Login</Link></span>
      </div>  
    </div>
  )
}

export default Register

const hiddenPasswordIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.0013 6C7.47087 6 6.96216 6.21071 6.58709 6.58579C6.21201 6.96086 6.0013 7.46957 6.0013 8C6.0013 8.53043 6.21201 9.03914 6.58709 9.41421C6.96216 9.78929 7.47087 10 8.0013 10C8.53173 10 9.04044 9.78929 9.41551 9.41421C9.79059 9.03914 10.0013 8.53043 10.0013 8C10.0013 7.46957 9.79059 6.96086 9.41551 6.58579C9.04044 6.21071 8.53173 6 8.0013 6ZM8.0013 11.3333C7.11725 11.3333 6.2694 10.9821 5.64428 10.357C5.01916 9.7319 4.66797 8.88406 4.66797 8C4.66797 7.11595 5.01916 6.2681 5.64428 5.64298C6.2694 5.01786 7.11725 4.66667 8.0013 4.66667C8.88536 4.66667 9.7332 5.01786 10.3583 5.64298C10.9834 6.2681 11.3346 7.11595 11.3346 8C11.3346 8.88406 10.9834 9.7319 10.3583 10.357C9.7332 10.9821 8.88536 11.3333 8.0013 11.3333ZM8.0013 3C4.66797 3 1.8213 5.07333 0.667969 8C1.8213 10.9267 4.66797 13 8.0013 13C11.3346 13 14.1813 10.9267 15.3346 8C14.1813 5.07333 11.3346 3 8.0013 3Z" fill="#D9D9D9" />
</svg>

const showPasswrodIcon = <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.55527 8.257L1.74927 13.0617C1.68777 13.1253 1.61421 13.1761 1.53287 13.2111C1.45154 13.246 1.36406 13.2644 1.27554 13.2652C1.18702 13.2659 1.09923 13.2491 1.0173 13.2155C0.935371 13.182 0.860936 13.1325 0.798341 13.0699C0.735746 13.0073 0.686244 12.9329 0.652723 12.851C0.619202 12.769 0.602335 12.6812 0.603104 12.5927C0.603873 12.5042 0.622264 12.4167 0.657203 12.3354C0.692143 12.2541 0.742931 12.1805 0.806604 12.119L5.68927 7.23633C5.65126 7.02466 5.66502 6.80693 5.72936 6.60173C5.79371 6.39652 5.90674 6.20993 6.0588 6.05786C6.21087 5.90579 6.39747 5.79277 6.60267 5.72842C6.80788 5.66407 7.0256 5.65032 7.23727 5.68833L12.1219 0.804329C12.2477 0.68289 12.4161 0.615694 12.5909 0.617213C12.7657 0.618732 12.9329 0.688844 13.0565 0.81245C13.1801 0.936055 13.2502 1.10326 13.2517 1.27806C13.2532 1.45286 13.186 1.62126 13.0646 1.747L8.25927 6.55366C8.34413 6.79138 8.35978 7.04829 8.30439 7.29455C8.249 7.5408 8.12484 7.76628 7.94637 7.94476C7.76789 8.12324 7.54241 8.24739 7.29616 8.30278C7.0499 8.35817 6.79298 8.34186 6.55527 8.257ZM11.5819 4.17233C12.8359 4.895 13.6693 5.89366 13.6693 7.00033C13.6693 9.20966 10.3639 10.9957 7.0026 11.0003C6.31858 11.0003 5.63644 10.9288 4.96727 10.787L6.20794 9.54699C6.67247 9.69216 7.16787 9.70742 7.64046 9.59114C8.11304 9.47486 8.5448 9.23146 8.88894 8.88733C9.23307 8.54319 9.47647 8.11143 9.59275 7.63885C9.70903 7.16626 9.69377 6.67086 9.5486 6.20633L11.5819 4.17233ZM8.8086 3.175L7.58594 4.39766C7.14727 4.29919 6.69083 4.31322 6.25904 4.43845C5.82725 4.56369 5.43414 4.79605 5.11623 5.11396C4.79833 5.43186 4.56596 5.82498 4.44073 6.25677C4.3155 6.68855 4.30146 7.145 4.39994 7.58366L2.2486 9.73366C1.09194 9.019 0.335938 8.05699 0.335938 7.00033C0.335938 4.791 3.6586 2.989 7.0026 3.00033C7.61194 3.00233 8.2206 3.063 8.8086 3.175Z" fill="#A8A6A6" />
</svg>