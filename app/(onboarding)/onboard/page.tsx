"use client"
import React from 'react'

import image1 from '@/public/images/onboard/1.png'
import image2 from '@/public/images/onboard/2.png'
import Image from 'next/image'
import Link from 'next/link'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination,EffectFade } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

function Onboard() {
  return (
    <div className='flex flex-col min-h-full flex-1 justify-center gap-12 md:max-w-[800px] md:mx-auto'>
        <div className='onboard-swiper' >
        <Swiper
        pagination={{ clickable: true }}
        effect="fade"
        spaceBetween={20}
        className="flex items-center justify-center"
        modules={[Pagination, EffectFade]}
      >
          <SwiperSlide>
          <div className={`pb-10 w-full flex flex-col items-center justify-center gap-4 bg-white`}>
                <Image src={image1} alt='Onboard Image' height={310} width={310} className='h-[310px] w-[310px]'/>
                <span className='text-center font-semibold text-[22px] leading-[33px] text-[#333333]'>Let&apos;s get started</span>
                <p className='w-[70%] text-center font-normal text-[14px] leading-[21px] text-[#777777]'>
                A great application for Photographers & Models and it&apos;s Easy to use, High Security & Great Usability
                </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
          <div className={`pb-10 w-full flex flex-col items-center justify-center gap-4 bg-white`}>
                <Image src={image2} alt='Onboard Image' height={310} width={310} className='h-[310px] w-[310px]'/>
                <span className='text-center font-semibold text-[22px] leading-[33px] text-[#333333]'>Let&apos;s get started</span>
                <p className='w-[70%] text-center font-normal text-[14px] leading-[21px] text-[#777777]'>
                A place where &quot;I want to shoot&quot; and &quot;I want to be photographed&quot; spead
                </p>
            </div>
          </SwiperSlide>
      </Swiper>
        </div>

        <div className='flex flex-col items-center justify-center gap-4'>
            <Link href={'/registration'} className='w-[90%] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Join now</Link>
            <Link href={'/login'} className='w-[90%] h-[54px] text-[16px] leading-[24px] font-bold text-center flex items-center justify-center text-secondary rounded-md'>Login</Link>
        </div>

    </div>
  )
}

export default Onboard