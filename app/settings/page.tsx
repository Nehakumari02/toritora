"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React from 'react'

function Settings() {
  const router = useRouter();

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  return (
    <div className=''>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Settings</span>
      </header>
    </div>
  )
}

export default Settings
