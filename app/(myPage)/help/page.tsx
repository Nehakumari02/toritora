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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Help / How to use Toritora</span>
      </header>

      <div className='flex flex-col items-center justify-center gap-6 p-4 mx-4 mt-4 bg-white rounded-lg shadow-md md:max-w-[800px] md:mx-auto'>
            {helpMenuList.map((item,index)=>{
              return(
                <button className='w-full h-8 flex items-center justify-between' key={index} onClick={()=>handleGoToLink(item.link)}>
                  <span className='flex items-center justify-center gap-4 font-normal text-[12px] leading-[18px] text-[#111111]'>{item.icon} {item.name}</span>

                  {rightArrowIcon}
                </button>
              )
            })}
          </div>

    </div>
  )
}

export default Help

const questionIcon = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.955 14.4C9.27 14.4 9.5364 14.2911 9.7542 14.0733C9.9714 13.8561 10.08 13.59 10.08 13.275C10.08 12.96 9.9714 12.6939 9.7542 12.4767C9.5364 12.2589 9.27 12.15 8.955 12.15C8.64 12.15 8.3736 12.2589 8.1558 12.4767C7.9386 12.6939 7.83 12.96 7.83 13.275C7.83 13.59 7.9386 13.8561 8.1558 14.0733C8.3736 14.2911 8.64 14.4 8.955 14.4ZM8.145 10.935H9.81C9.81 10.44 9.8664 10.05 9.9792 9.765C10.0914 9.48 10.41 9.09 10.935 8.595C11.325 8.205 11.6325 7.8336 11.8575 7.4808C12.0825 7.1286 12.195 6.705 12.195 6.21C12.195 5.37 11.8875 4.725 11.2725 4.275C10.6575 3.825 9.93 3.6 9.09 3.6C8.235 3.6 7.5414 3.825 7.0092 4.275C6.4764 4.725 6.105 5.265 5.895 5.895L7.38 6.48C7.455 6.21 7.6239 5.9175 7.8867 5.6025C8.1489 5.2875 8.55 5.13 9.09 5.13C9.57 5.13 9.93 5.2611 10.17 5.5233C10.41 5.7861 10.53 6.075 10.53 6.39C10.53 6.69 10.44 6.9711 10.26 7.2333C10.08 7.4961 9.855 7.74 9.585 7.965C8.925 8.55 8.52 8.9925 8.37 9.2925C8.22 9.5925 8.145 10.14 8.145 10.935ZM9 18C7.755 18 6.585 17.7636 5.49 17.2908C4.395 16.8186 3.4425 16.1775 2.6325 15.3675C1.8225 14.5575 1.1814 13.605 0.7092 12.51C0.2364 11.415 0 10.245 0 9C0 7.755 0.2364 6.585 0.7092 5.49C1.1814 4.395 1.8225 3.4425 2.6325 2.6325C3.4425 1.8225 4.395 1.1811 5.49 0.7083C6.585 0.2361 7.755 0 9 0C10.245 0 11.415 0.2361 12.51 0.7083C13.605 1.1811 14.5575 1.8225 15.3675 2.6325C16.1775 3.4425 16.8186 4.395 17.2908 5.49C17.7636 6.585 18 7.755 18 9C18 10.245 17.7636 11.415 17.2908 12.51C16.8186 13.605 16.1775 14.5575 15.3675 15.3675C14.5575 16.1775 13.605 16.8186 12.51 17.2908C11.415 17.7636 10.245 18 9 18Z" fill="#2EC4B6"/>
</svg>

const rightArrowIcon = <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.25 7.5L14.75 12L10.25 16.5" stroke="#999999" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

const helpMenuList = [
  {
    name:"Features",
    link:"/help/features",
    icon:questionIcon
  },
  {
    name:"Safety",
    link:"/help/safety",
    icon:questionIcon
  },
  {
    name:"Privacy",
    link:"/help/privacy",
    icon:questionIcon
  },
  {
    name:"Copyright",
    link:"/help/copy-right",
    icon:questionIcon
  },
]