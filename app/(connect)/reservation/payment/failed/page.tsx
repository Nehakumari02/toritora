"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import greenTick from '@/public/images/common/greenTick.png';
import Image from 'next/image';
import { useTranslations } from 'next-intl'

function Page() {
  const t = useTranslations('Payment');
  const router = useRouter();
  const handleGoToLink = (route: string) => {
    router.push(route)
  }
  return (
    <div className='absolute bg-white h-full w-full flex flex-col gap-8 items-center justify-center'>
      <div>
        <Image src={greenTick} alt='Success' className='w-[100px] aspect-square' />
      </div>

      <span className='text-center font-semibold text-[13px] text-[#999999]'>{t("retryLater")}</span>
      <span className='px-4 text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>{t("paymentFailedTitle")}</span>

      <div className='flex flex-col items-center justify-center space-y-2'>
        <span className='px-4 text-center font-normal text-[12px] text-[#1C1C1C]'>{t("paymentFailedMessage")}</span>
        {/* <span className='px-4 text-center font-semibold text-[12px] text-primary'>T23409237590237409231</span> */}
      </div>

      <div className='border-t-[1px] w-[20%]'></div>

      <div>
        <button onClick={() => handleGoToLink("/")} className='w-full h-[54px] text-[14px] leading-[21px] font-medium text-center flex items-center justify-center text-secondary rounded-md'>{t("goToHome")}</button>
      </div>
    </div>
  )
}

export default Page

const exclamationIcon = <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M53.7861 77.4531C52.6464 77.4531 51.5322 77.7938 50.5845 78.4321C49.6369 79.0703 48.8983 79.9776 48.4621 81.039C48.0259 82.1004 47.9118 83.2683 48.1342 84.3951C48.3565 85.5219 48.9054 86.5569 49.7113 87.3693C50.5172 88.1816 51.544 88.7349 52.6619 88.959C53.7797 89.1831 54.9384 89.0681 55.9914 88.6284C57.0444 88.1888 57.9444 87.4443 58.5776 86.489C59.2108 85.5338 59.5488 84.4107 59.5488 83.2619C59.5488 81.7213 58.9416 80.2438 57.8609 79.1545C56.7802 78.0651 55.3145 77.4531 53.7861 77.4531Z" fill="#E10101" />
  <path d="M49.9414 23.2344H57.625V65.8318H49.9414V23.2344Z" fill="#E10101" />
  <path d="M107.57 54.2149H99.8863C99.8863 41.8903 95.0292 30.0705 86.3835 21.3557C77.7379 12.6409 66.0118 7.74499 53.7849 7.74499C41.5581 7.74499 29.832 12.6409 21.1863 21.3557C12.5407 30.0705 7.68356 41.8903 7.68356 54.2149H0C0 39.8362 5.66661 26.0464 15.7532 15.8792C25.8399 5.71191 39.5203 0 53.7849 0C68.0496 0 81.73 5.71191 91.8166 15.8792C101.903 26.0464 107.57 39.8362 107.57 54.2149Z" fill="#E10101" />
  <path d="M107.57 53.7851H99.8863C99.8863 66.1097 95.0292 77.9295 86.3835 86.6443C77.7379 95.3591 66.0118 100.255 53.7849 100.255C41.5581 100.255 29.832 95.3591 21.1863 86.6443C12.5407 77.9295 7.68356 66.1097 7.68356 53.7851H0C0 68.1638 5.66661 81.9536 15.7532 92.1208C25.8399 102.288 39.5203 108 53.7849 108C68.0496 108 81.73 102.288 91.8166 92.1208C101.903 81.9536 107.57 68.1638 107.57 53.7851Z" fill="#E10101" />
</svg>
