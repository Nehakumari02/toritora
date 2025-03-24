"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import greenTick from '@/public/images/common/greenTick.png';
import feedbackHeroImage from '@/public/images/common/feedbackHeroImage.png';
import Image from 'next/image';
import { useTranslations } from 'next-intl'


function Feedback() {
  const router = useRouter();
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating, setRating] = useState(0);
  const t = useTranslations('MyPage.settings.feedback');

  const emojis = [
    '😥', // 1 - Very sad
    '☹️', // 2 - Sad
    '😐', // 3 - Neutral
    '😊', // 4 - Happy
    '😍', // 5 - Very happy
  ];

  const handleGoBack = () => {
    router.back();
  }

  const handleSendFeedback = async () => {


    setFeedbackSent(true);
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  if (feedbackSent) {
    return (
      <div className='absolute bg-white h-full w-full flex flex-col gap-16 items-center justify-center'>

        <div>
          <Image src={greenTick} alt='Success' className='w-[100px] aspect-square' />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='w-[80%] text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>{t("successMessage")} </span>
          <span className='w-[80%] text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>{t("thankYouMessage")}</span>
        </div>

        <div className='border-t-[1px] w-[20%]'></div>

        <div>
          <button onClick={() => handleGoToLink("/")} className='w-full h-[54px] text-[14px] leading-[21px] font-medium text-center flex items-center justify-center text-secondary rounded-md'>{t("goToHome")}</button>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("giveFeedback")}</span>
      </header>

      <div className='flex items-center justify-center mt-8'>
        <Image src={feedbackHeroImage} alt='Success' className='w-[220px] aspect-square' />
      </div>
      <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] my-8 space-y-8'>
        <div className='space-y-6 flex flex-col'>
          <span className='font-semibold text-[16px] leading-[24px] text-[#333333]'>{t("rateExperience")}</span>
          <div className="flex items-center justify-between mx-4">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                className={`text-2xl p-2 rounded-lg ${rating === index + 1 ? 'bg-[#CBF3F0]' : 'bg-gray-100'}`}
                onClick={() => setRating(index + 1)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("additionalComments")}</span>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Enter chracters upto 0 to 100 words"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] no-scrollbar"
          />
        </div>

        <button onClick={handleSendFeedback} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("send")}</button>
      </div>
    </div>
  )
}

export default Feedback