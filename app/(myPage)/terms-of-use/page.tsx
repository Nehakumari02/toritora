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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Terms of uses</span>
      </header>

      <div className='mx-8 py-8 space-y-8 md:max-w-[800px] md:mx-auto'>
        {termsOfUseList.map((feature,index)=>{
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

const termsOfUseList = [
  {
    name: "📜 1. User Responsibilities",
    subItems: [
      {
        name: "Account Integrity",
        description: "Users must provide accurate information and maintain the security of their accounts.",
      },
      {
        name: "Lawful Use",
        description: "Users must comply with all applicable laws and not use the platform for illegal activities.",
      },
      {
        name: "Content Guidelines",
        description: "Users are responsible for ensuring that any content they upload adheres to community standards.",
      }
    ]
  },
  {
    name: "⚖️ 2. Platform Rights and Limitations",
    subItems: [
      {
        name: "Service Availability",
        description: "The platform reserves the right to modify, suspend, or terminate services without prior notice.",
      },
      {
        name: "Content Moderation",
        description: "The platform may remove content that violates terms or community standards.",
      },
      {
        name: "License to Content",
        description: "By uploading content, users grant the platform a license to use, display, and distribute it.",
      }
    ]
  },
  {
    name: "🚫 3. Prohibited Activities",
    subItems: [
      {
        name: "Misuse of Services",
        description: "Users may not spam, hack, or distribute malicious software.",
      },
      {
        name: "Harassment",
        description: "Users must not engage in harassment, threats, or abusive behavior.",
      },
      {
        name: "Impersonation",
        description: "Users must not impersonate others or misrepresent their identity.",
      }
    ]
  },
  {
    name: "📅 4. Modifications to Terms",
    subItems: [
      {
        name: "Policy Updates",
        description: "The platform reserves the right to update these terms at any time.",
      },
      {
        name: "Notification",
        description: "Users will be notified of significant changes to the terms.",
      },
      {
        name: "Continued Use",
        description: "Continued use of the platform constitutes acceptance of the updated terms.",
      }
    ]
  },
  {
    name: "💬 5. Dispute Resolution",
    subItems: [
      {
        name: "Arbitration",
        description: "Disputes must be resolved through arbitration rather than in court.",
      },
      {
        name: "Governing Law",
        description: "These terms are governed by the laws of the platform’s operating region.",
      },
      {
        name: "Limitation of Liability",
        description: "The platform is not liable for damages beyond the amount paid by the user for services.",
      }
    ]
  }
];
