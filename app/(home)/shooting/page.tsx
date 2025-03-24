"use client"
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'


function Shooting() {
  const [selectedMode, setSelectedMode] = useState(0);
  const t = useTranslations('Shooting');

  return (
    <div className='h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("shooting")}</span>
      </header>

      <div className='bg-primary-foreground my-4'>
        <div className='max-w-[800px] mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-center gap-[8px] transition-all duration-300'>
          <button onClick={() => setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] text-center font-semibold text-[14px] leading-[21px] px-4 transition-all duration-300`}>{t("upcoming")}</button>
          <button onClick={() => setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] text-center font-semibold text-[14px] leading-[21px] px-4 transition-all duration-300`}>{t("requestList")}</button>
          <button onClick={() => setSelectedMode(2)} className={`${selectedMode === 2 ? "bg-primary text-white rounded-md" : ""} h-[40px] text-center font-semibold text-[14px] leading-[21px] px-4 transition-all duration-300`}>{t("kikaku")}</button>
        </div>
      </div>

      <div className='overflow-y-scroll flex-1 no-scrollbar mb-4'>
      </div>
    </div>
  )
}

export default Shooting