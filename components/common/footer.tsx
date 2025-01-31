"use client"
import React from 'react'

import { homeIcon,homeSelectedIcon,calendarIcon,calendarSelectedIcon,cameraFocusIcon,cameraFocusSelectedIcon,userAvatarIcon,userAvatarSelectedIcon } from '@/constants/icons'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const bottomTabs = [
  {
    name:"Home",
    link:"/",
    icon:homeIcon,
    iconSelected:homeSelectedIcon
  },
  {
    name:"Calendar",
    link:"/calendar",
    icon:calendarIcon,
    iconSelected:calendarSelectedIcon
  },
  {
    name:"Shooting",
    link:"/shooting",
    icon:cameraFocusIcon,
    iconSelected:cameraFocusSelectedIcon
  },
  {
    name:"My Page",
    link:"/mypage",
    icon:userAvatarIcon,
    iconSelected:userAvatarSelectedIcon
  },
]

function Footer() {
  const pathname = usePathname();
  const path = pathname.split("/");
  return (
    <div className='flex items-center justify-around w-full h-[88px] border-t-[1px] border-[#999999] text-[#B2B2B2]'>
      {
        bottomTabs.map((tab,index)=>{
          return(
            <Link href={tab.link} key={index} className='flex flex-col items-center justify-center gap-2 transition-all duration-300'>
              {tab.link===`/${path[1]}`?tab.iconSelected:tab.icon}
              <span className={`${tab.link===`/${path[1]}`?"text-secondary":""} text-[10px] leading-[15px] text-center font-normal`}>
                {tab.name}
              </span>
            </Link>
          )
        })
      }
    </div>
  )
}

export default Footer