"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Privacy</span>
      </header>

      <div className='mx-8 py-8 space-y-8 md:max-w-[800px] md:mx-auto'>
        {privacyList.map((feature,index)=>{
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
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Help

const privacyList = [
  {
    name: "🔒 1. Privacy Protection Measures",
    subItems: [
      {
        name: "Data Encryption",
        description: "Ensure user data is encrypted during storage and transmission.",
      },
      {
        name: "Anonymous Browsing",
        description: "Allow users to browse profiles without revealing their identity.",
      },
      {
        name: "Consent Management",
        description: "Request user consent for data collection and usage as per privacy laws.",
      }
    ]
  },
  {
    name: "📝 2. Data Access and Control",
    subItems: [
      {
        name: "Downloadable Data",
        description: "Let users download their profile and booking history.",
      },
      {
        name: "Data Deletion",
        description: "Allow users to delete their account and personal data permanently.",
      },
      {
        name: "Privacy Settings",
        description: "Offer customizable privacy controls for visibility and sharing preferences.",
      }
    ]
  },
  {
    name: "🔐 3. Secure Login and Authentication",
    subItems: [
      {
        name: "Two-Factor Authentication",
        description: "Add an extra layer of security to user accounts.",
      },
      {
        name: "Login Alerts",
        description: "Notify users of new logins from unrecognized devices.",
      },
      {
        name: "Password Protection",
        description: "Ensure strong password policies and secure storage.",
      }
    ]
  }
];
