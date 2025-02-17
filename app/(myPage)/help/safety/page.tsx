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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Safety</span>
      </header>

      <div className='mx-8 py-8 space-y-8 md:max-w-[800px] md:mx-auto'>
        {safetyPrecautionsList.map((feature,index)=>{
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

const safetyPrecautionsList = [
  {
    name: "🛡️ 1. User Verification & Identity Protection",
    subItems: [
      {
        name: "KYC (Know Your Customer)",
        description: "Require ID verification for photographers and models to prevent fake profiles.",
      },
      {
        name: "Profile Moderation",
        description: "Review profiles and portfolios before making them public.",
      },
      {
        name: "Privacy Controls",
        description: "Allow users to hide personal contact information and only share after booking confirmation.",
      }
    ]
  },
  {
    name: "🔐 2. Secure Payments & Contracts",
    subItems: [
      {
        name: "Escrow System",
        description: "Hold payments securely until the shoot is completed.",
      },
      {
        name: "Secure Payment Gateway",
        description: "Use trusted providers (e.g., Stripe, PayPal) for safe transactions.",
      },
      {
        name: "Digital Contracts",
        description: "Provide e-signed agreements to protect both parties and outline terms clearly.",
      }
    ]
  },
  {
    name: "🚨 3. Reporting and Safety Features",
    subItems: [
      {
        name: "Report Button",
        description: "Enable users to report inappropriate behavior or harassment.",
      },
      {
        name: "User Blocking",
        description: "Allow users to block suspicious or abusive members.",
      },
      {
        name: "Review System",
        description: "Let users leave honest feedback and flag inappropriate behavior.",
      }
    ]
  },
  {
    name: "🔒 4. Data Protection & Platform Security",
    subItems: [
      {
        name: "HTTPS Encryption",
        description: "Use SSL certificates for secure data transmission.",
      },
      {
        name: "Two-Factor Authentication (2FA)",
        description: "Add an extra layer of login security.",
      },
      {
        name: "GDPR Compliance",
        description: "Protect user data and provide options to delete accounts.",
      }
    ]
  },
  {
    name: "🧾 5. Clear Terms & Support Systems",
    subItems: [
      {
        name: "Terms of Use",
        description: "Clearly outline rules for bookings, cancellations, and refunds.",
      },
      {
        name: "Safety Guidelines",
        description: "Offer safety tips for shoots (e.g., meet in public for first shoots).",
      },
      {
        name: "24/7 Support",
        description: "Provide customer support for disputes or emergencies.",
      }
    ]
  }
];
