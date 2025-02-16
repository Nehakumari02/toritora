"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import { features } from 'process';
import React from 'react'

function Help() {
  const router = useRouter();

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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Features</span>
      </header>

      <div className='mx-8 py-8 space-y-8'>
        {featuresList.map((feature,index)=>{
          return(
            <div className='space-y-4' key={index}>
              <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{feature.name}</span>
              <div className='pl-4 space-y-2'>
                {feature.subItems.map((item,index)=>{
                  return(
                    <div className='' key={index}>
                      <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{item.name} : </span>
                      <span className='font-normal text-[14px] leading-[20px] text-[#333333]'>{item.description}</span>
                    </div>
                  )
                })}
              </div>
              <div className='pl-4'>
                <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>Features</span>
                <div className='flex flex-col gap-2'>
                  {feature.features.map((item,index)=>{
                    return(
                      <span className='font-normal text-[14px] leading-[20px] text-[#333333]' key={index}>{item}</span>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Help


const featuresList = [
  {
    name:"📸 1. Interactive Calendar with Slot Booking",
    subItems:[
      {
        name:"Photographers",
        description:"Can create and display available time slots with details (location, theme, price, etc.).",
      },
      {
        name:"Models",
        description:"Can view available slots and book them directly.",
      }
    ],
    features:[
      "Calendar view with color-coded availability.",
      "Real-time updates on bookings.",
      "Automatic slot removal once booked."
    ]
  },
  {
    name:"👤 2. Profiles with Portfolios and Reviews",
    subItems:[
      {
        name:"Photographers and Models",
        description:"Can create profiles showcasing their work and experiences.",
      },
    ],
    features:[
      "Photo galleries for showcasing previous shoots.",
      "Reviews and ratings from previous collaborations.",
      "Contact information and social media links."
    ]
  },
  {
    name:"🔔 3. Instant Notifications and Chat System",
    subItems:[
      {
        name:"Real-time Chat",
        description:"Allows quick discussions about shoot details.",
      },
      {
        name:"Push Notifications",
        description:"For booking confirmations, cancellations, or new slot openings.",
      }
    ],
    features:[
      "Message history for easy reference.",
      "Quick replies for common questions.",
      "Availability status (online/offline)."
    ]
  }
]