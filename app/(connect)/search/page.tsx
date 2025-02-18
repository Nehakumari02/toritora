"use client"
import { backIcon, locationIcon, searchIcon } from '@/constants/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const availableModelList = [
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    profilePic:"/images/home/model4.png",
    username:"",
  },
  {
    name:"Momoka",
    location:"Tokyo",
    profilePic:"/images/home/model3.png",
    username:"",
  },
  {
    name:"Arisa",
    location:"Tokyo",
    profilePic:"/images/home/model1.png",
    username:"",
  },
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    profilePic:"/images/home/model4.png",
    username:"",
  },
  {
    name:"Momoka",
    location:"Tokyo",
    profilePic:"/images/home/model2.png",
    username:"",
  },
  {
    name:"Arisa",
    location:"Tokyo",
    profilePic:"/images/home/model3.png",
    username:"",
  },
]

function Favourites() {
  const router = useRouter();
  const [searchTerm,setSearchTerm] = useState("")

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  return (
    <div className=''>
      <header className="sticky z-10 top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Search</span>
      </header>
      
      {/* Search Bar */}
      <div className='overflow-y-scroll h-full no-scrollbar my-8'>
        <div className='max-w-[800px] mx-auto relative h-[42px] w-full px-[24px] my-[24px]'>
          <input 
          type="text" 
          className='bg-[#EEF2F5] h-[42px] w-full pl-[20px] pr-[40px] rounded-md outline-none focus:outline-none'
          placeholder='Find your favourite Model'
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <div className='absolute top-[50%] translate-y-[-50%] right-[34px]'>
            {searchIcon}
          </div>
        </div>

        <div className='max-w-[800px] mx-auto px-[24px] space-y-2 my-[24px]'>
          <div className='flex items-center justify-between'>
            <span className='text-[16px] font-medium leading-[24px]'>Search results</span>
            <Link href={"/"} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</Link>
          </div>

          <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] flex-wrap py-2 px-2 rounded-md'>
            {availableModelList.map((item,index)=>(
              <div key={index} className='bg-white h-[226px] w-[172px] flex-shrink-0 rounded-md flex flex-col gap-2 items-center justify-between px-[12px] py-[14px]'>

                <div className='relative'>
                  <Image src={item.profilePic} alt='userImage' width={148} height={151} className='h-[151px] w-[148px] rounded-md object-cover'></Image>
                  <span className='absolute top-0 left-0 bg-secondary w-[64px] h-[18px] text-center text-white text-[10px] leading-[15px] font-medium rounded-tl-md rounded-br-md'>New</span>
                </div>

                <div className='flex flex-col items-start justify-center w-full'>
                  <span className='text-[14px] leading-[21px] font-medium'>{item.name}</span>
                  <div className='flex items-center justify-between w-full'>
                    <span className='flex flex-row items-center justify-center gap-2 text-[10px] leading-[15px] font-normal text-[#999999]'>{locationIcon}{item.location}</span>
                    <Link href={`/userDetails?username=${item.username}`} className='text-primary text-[12px] font-medium leading-[18px]'>View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
    </div>
  )
}

export default Favourites
