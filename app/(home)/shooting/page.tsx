import React from 'react'
import feedbackHeroImage from '@/public/images/common/feedbackHeroImage.png';
import Image from 'next/image';


function Shooting() {
  return (
    <div className='h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <span className="text-[16px] leading-[24px] text-center font-semibold">Shooting</span>
      </header>

      <div className='h-full flex flex-col items-center justify-center gap-32'>
        <div className='flex items-center justify-center mt-8'>
          <Image src={feedbackHeroImage} alt='Success' className='w-[220px] aspect-square'/>
        </div>
        <div className='text-center'>
          <span className='font-semibold text-[40px] leading-[64px] text-secondary'>Coming soon</span>
        </div>
      </div>
    </div>
  )
}

export default Shooting