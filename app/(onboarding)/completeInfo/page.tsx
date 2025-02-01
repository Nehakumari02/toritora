"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import photographerBanner from '@/public/images/registration/infoBannerPhotography.jpeg'
import modelBanner from '@/public/images/registration/infoBannerModel.jpeg'
import Image from 'next/image';


// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   // DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   // DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import { DialogTitle } from '@radix-ui/react-dialog';


function RegistrationInfo() {
  const router = useRouter();
  const [profession,setProfession] = useState<string>("photographer");
  const [infoStep,setInfoStep] = useState<number>(1);

  const infoStepToWidth: { [key: number]: string } = {
    1:"13",
    2:"38",
    3:"63",
    4:"100"
  }

  const handleGoBack = ()=>{
    router.back();
  }

  const handleBack = ()=>{
    if(infoStep>1){
      setInfoStep(infoStep-1);
    }
  }

  const handleNext = ()=>{
    if(infoStep<4){
      setInfoStep(infoStep+1);
    }
  }

  const handleSubmit = ()=>{
    console.log("submitting");
  }

  useEffect(()=>{
    setProfession("photographer");
  },[])

  return (
    <div className='h-[100dvh] flex flex-col'>
      <header className='relative w-full h-[72px] flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>Info</span>
      </header>

      <div className='flex flex-col flex-1 items-center space-y-4 overflow-y-scroll no-scrollbar'>
      
        <div className='h-[102px] overflow-hidden relative'>
          <Image src={profession === "photographer" ? photographerBanner : modelBanner} alt='Banner' />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[22px] leading-[32px] font-semibold text-white">
          {infoStep === 1 && <span>Primary Info / Personal Info</span>}
          {infoStep === 2 && <span>Professional Info</span>}
          {infoStep === 3 && <span>Verification</span>}
          {infoStep === 4 && <span>Questionaries</span>}
          </div>
        </div>

        <div className='w-[80%]'>
            {/* <div className={`h-[2px] w-[100%] bg-gradient-to-r from-primary from-${infoStepToWidth[infoStep]}% to-[#D4D3D8] to-${infoStepToWidth[infoStep]}% mt-5 flex items-center justify-around`}> */}
            <div
              className="h-[2px] w-full bg-gradient-to-r mt-5 flex items-center justify-around"
              style={{
                background: `linear-gradient(to right, #FF9F1C ${infoStepToWidth[infoStep]}%, #D4D3D8 ${infoStepToWidth[infoStep]}%)`
              }}
            >
              <div className={`${infoStep >= 1 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
                1
                <span className={`${infoStep >= 1 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Personal Info</span>
              </div>
              <div className={`${infoStep >= 2 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
                2
                <span className={`${infoStep >= 2 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Professional Info</span>
              </div>
              <div className={`${infoStep >= 3 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
                3
                <span className={`${infoStep >= 3 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Verification</span>
              </div>
              <div className={`${infoStep >= 4 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
                4
                <span className={`${infoStep >= 4 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Questionaries</span>
              </div>
            </div>

          </div>
        
        <div className='flex-1 space-y-4'>
          


        </div>

        <div className='py-4 w-[80%] flex items-center justify-center gap-4'>
        <button onClick={handleBack} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center border-[1px] text-secondary flex items-center justify-center rounded-md'>Back</button>
        {infoStep < 4 && <button onClick={handleNext} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>NEXT</button>}
        {infoStep == 4 && <button onClick={handleSubmit} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>SUBMIT</button>}
        </div>

      </div>

    </div>
  )
}

export default RegistrationInfo