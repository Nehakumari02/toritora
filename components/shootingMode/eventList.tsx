import Image from 'next/image'
import React from 'react'
import feedbackHeroImage from '@/public/images/common/feedbackHeroImage.png';

function EventList() {
  return (
    <div className='h-full flex flex-col items-center justify-center gap-32'>
    <div className='flex items-center justify-center mt-8'>
        <Image src={feedbackHeroImage} alt='Success' className='w-[220px] aspect-square'/>
    </div>
    <div className='text-center'>
        <span className='font-semibold text-[40px] leading-[64px] text-secondary'>Coming soon</span>
    </div>
    </div>
  )
}

export default EventList