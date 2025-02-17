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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Copyright</span>
      </header>

      <div className='mx-8 py-8 space-y-8 md:max-w-[800px] md:mx-auto'>
        {copyrightList.map((feature,index)=>{
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

const copyrightList = [
  {
    name: "⚖️ 1. Copyright Protection",
    subItems: [
      {
        name: "Content Ownership",
        description: "Ensure that photographers retain copyright of their uploaded photos.",
      },
      {
        name: "Watermarking",
        description: "Allow photographers to watermark their images for protection.",
      },
      {
        name: "Usage Rights",
        description: "Define clear terms for how uploaded content can be used by the platform.",
      }
    ]
  },
  {
    name: "🚨 2. Copyright Violation Reporting",
    subItems: [
      {
        name: "DMCA Policy",
        description: "Implement a process for reporting and removing copyright-infringing content.",
      },
      {
        name: "Takedown Requests",
        description: "Provide a form for users to submit content removal requests.",
      },
      {
        name: "Copyright Monitoring",
        description: "Use tools to detect and prevent unauthorized use of uploaded content.",
      }
    ]
  },
  {
    name: "📜 3. Licensing and Agreements",
    subItems: [
      {
        name: "Content Licensing",
        description: "Allow users to choose licensing terms for their uploaded photos.",
      },
      {
        name: "Model Release Forms",
        description: "Enable digital signing of model release agreements for shoots.",
      },
      {
        name: "Collaboration Agreements",
        description: "Facilitate e-contracts between photographers and models for copyright terms.",
      }
    ]
  }
];
