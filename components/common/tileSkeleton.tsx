import { locationIcon } from '@/constants/icons'
import React from 'react'

function TileSkeleton({length=4}) {
  return (
    <>
      {[...Array(length)].map((_, index) => (
        <div key={index} className='bg-white min-h-[236px] w-[172px] flex-shrink-0 rounded-md flex flex-col gap-2 items-center px-[12px] py-[14px]'>
          <div className='relative'>
            <div className='h-[151px] w-[148px] rounded-md bg-gray-200 animate-pulse'></div>
            <span className='animate-pulse absolute top-0 left-0 bg-secondary w-[64px] h-[18px] text-center text-white text-[10px] leading-[15px] font-medium rounded-tl-md rounded-br-md'></span>
          </div>
          <div className='flex flex-col items-start justify-center w-full gap-2'>
            <span className='h-4 w-16 rounded-sm bg-gray-200 animate-pulse text-[14px] leading-[21px] font-medium'></span>
            <div className='flex items-center justify-between w-full'>
              <span className='h-3 w-12 rounded-sm bg-gray-200 animate-pulse flex items-center justify-center gap-2 text-[10px] leading-[15px] font-normal text-[#999999]'></span>
              <span className='h-3 w-8 rounded-sm bg-gray-200 animate-pulse'></span>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default TileSkeleton