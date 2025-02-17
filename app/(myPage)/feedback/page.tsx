"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import greenTick from '@/public/images/common/greenTick.png';
import Image from 'next/image';

function Feedback() {
  const router = useRouter();
  const [feedbackText,setFeedbackText] = useState("");
  const [feedbackSent,setFeedbackSent] = useState(false);

  const handleGoBack = ()=>{
    router.back();
  }

  const handleSendFeedback = async ()=>{


    setFeedbackSent(true);
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  if(feedbackSent){
    return(
      <div className='absolute bg-white h-full w-full flex flex-col gap-16 items-center justify-center'>
        
        <div>
          <Image src={greenTick} alt='Success' className='w-[100px] aspect-square'/>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='w-[80%] text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>Your feedback is sent successfully. </span>
          <span className='w-[80%] text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>Thank you for giving time for Toritora.</span>
        </div>

        <div className='border-t-[1px] w-[20%]'></div>

        <div>
        <button onClick={()=>handleGoToLink("/")} className='w-full h-[54px] text-[14px] leading-[21px] font-medium text-center flex items-center justify-center text-secondary rounded-md'>Go to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className=''>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Give Feedback</span>
      </header>
      <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] my-8 space-y-8'>
        <div className='space-y-2 flex flex-col'>
          <span className='font-semibold text-[16px] leading-[24px] text-[#333333]'>Give Feedback</span>
          <span className='font-normal text-[14px] leading-[20px] text-[#333333]'>Your thoughts are valuable in helping improving our product.</span>
        </div>

        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Let us know what is on your mind"
          className="w-full h-60 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] no-scrollbar"
        />

        <button onClick={handleSendFeedback} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>SEND</button>
      </div>
    </div>
  )
}

export default Feedback