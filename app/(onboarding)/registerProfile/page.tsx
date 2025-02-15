"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

import photographyImage from '@/public/images/registration/photographyProfession.png'
import modellingImage from '@/public/images/registration/modellingProfession.png'
import Image from 'next/image';

import { primaryTickIcon, grayedTickIcon } from '@/constants/icons'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DialogTitle } from '@radix-ui/react-dialog';
import { useToast } from '@/hooks/use-toast';


function RegistrationInfo() {
  const router = useRouter();
  const [profession, setProfession] = useState("");
  const { toast } = useToast();

  const handleGoBack = () => {
    router.back();
  }


  const handleProceed = async () => {
    localStorage.setItem('userProfession', profession);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registration/userProfession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      credentials: "include",
      body: JSON.stringify({ profession }),
    });

    if (res.status === 200) {
      toast({
        title: "Success",
        description: "Profession updated sucessfully",
        variant: "success"
      })
      router.push('/completeInfo')
    }
    else if (res.status === 500) {
      toast({
        title: "Internal error",
        description: `Server internal error please try after again`,
        variant: "destructive"
      })
    }
  }

  return (
    <div className='h-[100dvh] flex flex-col'>
      <header className='relative w-full h-[72px] flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>Choose Profession</span>
      </header>

      <div className='flex flex-col flex-1 px-5 py-4 space-y-4 overflow-y-scroll no-scrollbar'>

        <div className='flex flex-col gap-2'>
          <span className='text-[22px] leading-[50px] font-semibold'>What&apos;s your Profession ?</span>
          <p className='text-[14px] leading-[21px] font-medium text-[#959595]'>Please select your role of profession in these following two fields</p>
        </div>

        <div className='space-y-8'>

          <div onClick={() => setProfession("photographer")} className={`flex items-center gap-8 relative shadow-[rgba(0,0,0,0.25)_0px_5px_15px] rounded-lg ${profession === "photographer" ? "border-primary border-[2px]" : " border-[2px] border-white"}`}>
            <Image src={photographyImage} alt='photographer' height={95} width={95} className='h-[95px] w-[95px]' />
            <span className=' text-[16px] leading-[24px] font-semibold text-[#555555]'>Photographer</span>
            <span className='absolute top-3 right-4'>{profession === "photographer" ? primaryTickIcon : grayedTickIcon}</span>
            <Drawer>
              <DrawerTrigger className='absolute bottom-3 right-4 text-[10px] leading-[15px] font-medium text-[#999999]'>View info</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className='flex items-center justify-between'>
                  <DialogTitle className='hidden'></DialogTitle>
                  <div className='text-[16px] leading-[24px] font-semibold'>Photographer Info</div>
                  <DrawerClose className='text-[12px] leading-[18px] font-medium text-[#E10101]'>Close</DrawerClose>
                </DrawerHeader>
                <DrawerFooter className='h-[250px]'>
                  <div className='text-[16px] leading-[24px] font-normal text-[#999999]'>
                    &quot;Real photographers don&apos;t go with the trend, they set the trend.&quot;
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          <div onClick={() => setProfession("modelling")} className={`flex items-center gap-8 relative shadow-[rgba(0,0,0,0.25)_0px_5px_15px] rounded-lg ${profession === "modelling" ? "border-primary border-[2px]" : " border-[2px] border-white"}`}>
            <Image src={modellingImage} alt='modelling' height={95} width={95} className='h-[95px] w-[95px]' />
            <span className=' text-[16px] leading-[24px] font-semibold text-[#555555]'>Modelling</span>
            <span className='absolute top-3 right-4'>{profession === "modelling" ? primaryTickIcon : grayedTickIcon}</span>
            <Drawer>
              <DrawerTrigger className='absolute bottom-3 right-4 text-[10px] leading-[15px] font-medium text-[#999999]'>View info</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className='flex items-center justify-between'>
                  <DialogTitle className='hidden'></DialogTitle>
                  <div className='text-[16px] leading-[24px] font-semibold'>Model Info</div>
                  <DrawerClose className='text-[12px] leading-[18px] font-medium text-[#E10101]'>Close</DrawerClose>
                </DrawerHeader>
                <DrawerFooter className='h-[250px]'>
                  <div className='text-[16px] leading-[24px] font-normal text-[#999999]'>
                    &quot;Real models don&apos;t go with the trend, they set the trend.&quot;
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

        </div>

        <div className='flex-1 py-4 w-full flex-col flex items-center justify-center'>
          <button onClick={handleProceed} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Proceed</button>
        </div>

      </div>

    </div>
  )
}

export default RegistrationInfo