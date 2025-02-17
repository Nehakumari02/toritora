"use client"
import React, { useState } from 'react'

import { backIcon, eyeBlockedIcon, lockIcon, userIcon } from '@/constants/icons'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import axios from 'axios';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import { Loader2} from 'lucide-react';
import LoginImage from '@/public/images/onboard/login.svg'

import googleIcon from '@/public/images/onboard/google.png'
import { useToast } from '@/hooks/use-toast';

type AuthResult = {
  code: string;
  state?: string;
  clientId?: string;
  error?: string;  // Present in case of an error
};

type ErrorResponse = Pick<CodeResponse, "error" | "error_description" | "error_uri">;

function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [rememberMe,setRememberMe] = useState(false);
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleGoBack = ()=>{
    router.back();
  }

  const handleLogin = async ()=>{
    if((!username || username === "")  && (!password || password === "")){
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive"
      })
      return;
    }
    else if(!username || username === ""){
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive"
      })
      return;
    }
    else if(!password || password === ""){
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive"
      })
      return;
    }
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      credentials:"include",
      body: JSON.stringify({email:username,password}),
    });

    const data = await res.json();

    if(res.status === 200){
      router.replace('/')
    }
    else{
      toast({
        title: "Error",
        description: "Something went wrong, please try again",
        variant: "destructive"
      })
    }

    console.log(data)
    setLoading(false);
  }

  const responseGoogle = async (authResult: AuthResult | ErrorResponse) => {
    try {
      if ('code' in authResult) {
        // Handle success case (has 'code')
        const code = authResult.code;
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/signin?code=${code}`,
          {},
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true,
          }
        );
        if(res.status === 200){
          router.push("/");
          toast({
            title: "Login Success",
            variant: "success"
          })
        }
        else if(res.status === 204){
          toast({
            title: "Error",
            description: "No user found with this email",
            variant: "destructive"
          })
        }
        else if(res.status === 203){
          toast({
            title: "Error",
            description: "Kindly login with credentials",
            variant: "destructive"
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
      <header className='relative w-full h-[72px] flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>Sign In</span>
      </header>

      <div className='md:grid md:grid-cols-2 flex-1 gap-16 md:max-w-[1200px] md:mx-auto'>

        <div className='hidden md:flex flex-1 items-center justify-center'>
          <Image src={LoginImage} alt='Login' height={380} width={380} className='h-[380px] aspect-square cover' />
        </div>

        <div className='flex-1 flex flex-col space-y-8'>
        <div className='flex flex-col flex-1 mx-5 py-4 space-y-4'>

          <div className='flex flex-col gap-2'>
            <span className='text-[22px] leading-[50px] font-semibold'>Let&apos;s you sign in to toritora</span>
            <p className='text-[14px] leading-[21px] font-medium text-[#959595]'>Welcome back, you have been missed</p>
          </div>
          
          <div className='space-y-4'>
            <div className='space-y-2'>
              <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Username</span>
              <div className='relative h-[48px] border-[1px] rounded-md'>
                <span className='absolute top-[50%] translate-y-[-50%] left-2'>{userIcon}</span>
                <input value={username} onChange={(e)=>(setUsername(e.target.value))} type="text" placeholder='Enter your username' className='h-full pl-8 pr-4 w-full outline-none rounded-md text-[#333333]'/>
              </div>
            </div>

            <div className='space-y-2'>
              <span className='text-[14px] leading-[21px] font-medium text-[#333333]'>Password</span>
              <div className='relative h-[48px] border-[1px] rounded-md'>
                <span className='absolute top-[50%] translate-y-[-50%] left-2'>{lockIcon}</span>
                <input value={password} onChange={(e)=>(setPassword(e.target.value))} type="password" placeholder='Enter your password' className='h-full pl-8 pr-8 w-full outline-none rounded-md text-[#333333]'/>
                <span className='absolute top-[50%] translate-y-[-50%] right-2'>{eyeBlockedIcon}</span>
              </div>
            </div>

            <div className='flex items-center flex-wrap gap-4 justify-between'>
              <div className="flex items-center gap-2">
                <input
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  id="checked-checkbox"
                  type="checkbox"
                  className="w-5 h-5 text-white accent-secondary bg-gray-100 border-gray-300 rounded-sm focus:ring-secondary"
                />
                <label htmlFor="checked-checkbox" className="text-[14px] leading-[21px] font-medium text-[#999999]">
                  Remember me
                </label>
              </div>

              <Link href={'/forgotPassword'} className='text-[15px] leading-[22px] font-medium text-secondary'>Forgot Password?</Link>
            </div>

          </div>

          <div className='flex-1 w-full flex-col gap-4 flex items-center justify-center pt-16'>
            <button onClick={handleLogin} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loading?<Loader2 className='animate-spin'/>:"LOGIN"}</button>
            <button onClick={googleLogin} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex gap-2 items-center justify-center text-white rounded-md'><Image src={googleIcon} alt='google' height={32} width={32} className='bg-white rounded-full' />Login with Google</button>
          </div>

        </div>

        <div className='mx-5 flex items-center justify-center h-[100px] border-t-[1px] border-primary border-opacity-20'>
          <span className='text-[15px] leading-[22px] font-medium text-[#6C7178]'>Don&apos;t have account? <Link href={'/registration'} className='text-[16px] leading-[24px] font-semibold text-secondary'>Register</Link></span>
        </div>
        </div>
      </div>

    </div>
  )
}

export default Login