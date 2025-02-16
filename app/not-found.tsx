"use client"
import { backIcon } from '@/constants/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import PageNotFoundImage from '@/public/images/common/page-not-found.svg';

function NotFound() {
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
        <span className="text-[16px] leading-[24px] text-center font-semibold">404 - Page Not Found</span>
      </header>
      
      <div className='h-full flex flex-col items-center justify-center gap-16'>
        <div className='flex items-center justify-center mt-8'>
          <Image src={PageNotFoundImage} alt='Success' className='w-[220px] aspect-square'/>
        </div>
        <div className='text-center flex flex-col'>
          <span className='font-semibold text-[12px] leading-[18px] text-gray-500'>OOPS: Something Went Wrong</span>
          <span className='font-semibold text-[12px] leading-[18px] text-gray-500'>WE CAN'T FIND THE PAGE YOU ARE LOOKING FOR</span>
        </div>

        <button onClick={()=>handleGoToLink('/')} className='w-[90%] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Back Home</button>
      </div>
    </div>
  )
}

export default NotFound
