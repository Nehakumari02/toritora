"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import userAvatar from "@/public/images/mypage/user.png"
import Image from 'next/image';

function editProfile() {
  const router = useRouter();
  const [editProfileSection,setEditProfileSection] = useState(1);
  

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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Edit Profile</span>
      </header>

      <div className='mt-8 mb-4 gap-8 flex flex-col items-center justify-center'>
        <div className='relative h-[88px] w-[88px] rounded-full border-[3px] border-secondary'>
          <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" className='h-full w-full rounded-full p-[2px]'/>
          <span className='absolute -bottom-2 -right-2'>{editIcon}</span>
        </div>
        <div className='flex flex-row items-center justify-around w-full mx-4'>
          <button onClick={()=>setEditProfileSection(1)} className={`font-medium text-[12px] leading-[18px] px-[15px] py-[8px] rounded-lg transition-all duration-300 ${editProfileSection === 1 ? "text-white bg-[#FF9F1C]" : "text-[#111111] bg-white"}`}>Professional Info</button>
          <button onClick={()=>setEditProfileSection(2)} className={`font-medium text-[12px] leading-[18px] px-[15px] py-[8px] rounded-lg transition-all duration-300 ${editProfileSection === 2 ? "text-white bg-[#FF9F1C]" : "text-[#111111] bg-white"}`}>Personal Detail</button>
          <button onClick={()=>setEditProfileSection(3)} className={`font-medium text-[12px] leading-[18px] px-[15px] py-[8px] rounded-lg transition-all duration-300 ${editProfileSection === 3 ? "text-white bg-[#FF9F1C]" : "text-[#111111] bg-white"}`}>Questionaries</button>
        </div>
      </div>

      <div className='bg-[#FFBF691A] border-[1px] border-[#99999914] h-[50px] font-medium text-[12px] leading-[18px] text-[#777777] flex items-center justify-start px-4'>
        {editProfileSection === 1 && "This is shown in your profile"}
        {editProfileSection === 2 && "This won’t be shown to anyone"}
        {editProfileSection === 3 && "This will be sent to the photographer before the shooting."}
      </div>

      <div className='flex-1 overflow-y-scroll no-scrollbar my-8'>

      </div>

      <div className='mx-4 py-4'>
        <button className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>SAVE</button>
      </div>

    </div>
  )
}

export default editProfile

const editIcon = <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="15.293" cy="15" r="14" fill="#2EC4B6" stroke="#F9FCFD" strokeWidth="2"/>
<path d="M19.2117 13.3836L16.8863 11.0822L17.6523 10.3151C17.8621 10.105 18.1198 10 18.4255 10C18.7308 10 18.9883 10.105 19.1981 10.3151L19.9641 11.0822C20.1738 11.2922 20.2833 11.5458 20.2924 11.8427C20.3015 12.1394 20.2012 12.3927 19.9915 12.6027L19.2117 13.3836ZM18.4184 14.1918L12.6184 20H10.293V17.6712L16.0929 11.863L18.4184 14.1918Z" fill="white"/>
</svg>