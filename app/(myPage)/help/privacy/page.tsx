"use client"
import { backIcon } from '@/constants/icons';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react'

function Help() {
  const router = useRouter();
  const t = useTranslations("MyPage.settings.privacyPolicyPage")

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  return (
    <div className='flex flex-col h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("privacy")}</span>
      </header>

      <div className='mx-8 py-8 space-y-8 md:max-w-[800px] md:mx-auto flex-1 overflow-y-scroll no-scrollbar'>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy1.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy1.d1")}</p>
          <div className='pl-4 space-y-2'>
                <div className=''>
                  <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy1.sub1")} : </span>
                  <ul className='list-disc'>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d1")}</p></li>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d2")}</p></li>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d3")}</p></li>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d4")}</p></li>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d5")}</p></li>
                  </ul>
                </div>
          </div>
          <div className='pl-4 space-y-2'>
                <div className=''>
                  <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy1.sub2")} : </span>
                  <ul className='list-disc'>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub2d1")}</p></li>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub2d2")}</p></li>
                    <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub2d3")}</p></li>
                  </ul>
                </div>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy2.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy2.d1")}</p>
          <div className='pl-4 space-y-2'>
            <ol className='list-disc'>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d1")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d2")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d3")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d4")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy1.sub1d5")}</p></li>
            </ol>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy3.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy3.description")}</p>
          <div className='pl-4 space-y-2'>
            <ol className='list-disc'>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d1")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d2")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d3")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d4")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d5")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d6")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d7")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d8")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d9")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d10")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d11")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d12")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d13")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d14")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d15")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d16")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d17")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d18")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d19")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy3.d20")}</p></li>
            </ol>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy4.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy4.description")}</p>
          <div className='pl-4 space-y-2'>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub1")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub1d1")}</p>
            </div>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub2")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub2d1")}</p>
            </div>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub3")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub3d1")}</p>
            </div>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub4")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub4d1")}</p>
            </div>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub5")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub5d1")}</p>
            </div>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub6")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub6d1")}</p>
            </div>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub7")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub7d1")}</p>
            </div>
            <div className=''>
              <span className='font-semibold text-[16px] leading-[20px] text-[#333333]'>{t("policy4.sub8")} : </span>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("policy4.sub8d1")}</p>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy5.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy5.description")}</p>
          <div className='pl-4 space-y-2'>
            <Link href={"https://policies.google.com/technologies/partner-sites"} ><p className='font-normal text-[14px] leading-[20px] text-blue-600 underline py-1'>{t("policy5.link1d")}</p></Link>
            <Link href={"https://tools.google.com/dlpage/gaoptout?hl=jp"} ><p className='font-normal text-[14px] leading-[20px] text-blue-600 underline py-1'>{t("policy5.link2d")}</p></Link>
            <Link href={"https://support.google.com/analytics/answer/3450482?hl=ja"} ><p className='font-normal text-[14px] leading-[20px] text-blue-600 underline py-1'>{t("policy5.link3d")}</p></Link>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy6.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy6.description")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy7.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy7.description")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy8.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy8.description")}</p>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy8.d1")}</p>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy8.d2")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy9.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy9.description")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy10.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy10.description")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy11.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy11.description")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("policy12.name")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("policy12.description")}</p>
        </div>

      </div>

    </div>
  )
}

export default Help