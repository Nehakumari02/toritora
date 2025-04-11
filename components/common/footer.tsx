"use client"
import React from 'react'

import { homeIcon,homeSelectedIcon,calendarIcon,calendarSelectedIcon,cameraFocusIcon,cameraFocusSelectedIcon,userAvatarIcon,userAvatarSelectedIcon } from '@/constants/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const bottomTabs = [
  {
    name:"home",
    link:"/",
    icon:homeIcon,
    iconSelected:homeSelectedIcon
  },
  {
    name:"calendar",
    link:"/calendar",
    icon:calendarIcon,
    iconSelected:calendarSelectedIcon
  },
  {
    name:"shooting",
    link:"/shooting",
    icon:cameraFocusIcon,
    iconSelected:cameraFocusSelectedIcon
  },
  {
    name:"mypage",
    link:"/mypage",
    icon:userAvatarIcon,
    iconSelected:userAvatarSelectedIcon
  },
]

function Footer() {
  const pathname = usePathname();
  const path = pathname.split("/");
  const t = useTranslations('FooterNav');
  return (
    <div className='flex items-center justify-around w-full h-[88px] text-[#B2B2B2] shadow-[0px_-5px_20px_rgba(0,0,0,0.1)]'>
      <div className='max-w-[800px] mx-auto flex items-center justify-around w-full'>
      {
        bottomTabs.map((tab,index)=>{
          return(
            <Link href={tab.link} key={index} className='flex flex-col items-center justify-center gap-2 transition-all duration-300 active:translate-y-2 active:scale-90 '>
              {tab.link===`/${path[1]}`?tab.iconSelected:tab.icon}
              <span className={`${tab.link===`/${path[1]}`?"text-secondary":""} text-[10px] leading-[15px] text-center font-normal`}>
                {t.rich(tab.name)}
              </span>
            </Link>
          )
        })
      }
      </div>
    </div>
  )
}

export default Footer