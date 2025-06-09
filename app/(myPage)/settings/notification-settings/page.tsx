"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React from 'react';
import feedbackHeroImage from '@/public/images/common/feedbackHeroImage.png';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

function NotificationSettings() {
  const router = useRouter();
  const t = useTranslations("MyPage.settings.notificationSettingsPage")

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
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("notificationSettings")}</span>
      </header>
      
      <div className='h-full flex flex-col items-center justify-center gap-32'>
        <div className='flex items-center justify-center mt-8'>
          <Image src={feedbackHeroImage} alt='Success' className='w-[220px] aspect-square'/>
        </div>
        <div className='text-center'>
          <span className='font-semibold text-[40px] leading-[64px] text-secondary'>{t("comingSoon")}</span>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings