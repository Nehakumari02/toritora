"use client"
import { backIcon } from '@/constants/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import { useLogout } from '@/lib/logout';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

type FormValues = {
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  importantThing: string;
  stress: string;
  assistanceWithModels: string;
  hobbies: string;
  userName: string;
  userId: string;
  profileImage: string;
};

function BookSlot() {
  const router = useRouter();
  const logout = useLogout();
  const [profileImage,setProfileImage] = useState('');
  const [loading,setLoading] = useState(false);
  const [name,setName] = useState('Satomi Ishihara');
  const [hourlyPrice,setHourlyPrice] = useState(0);

  const searchParams = useSearchParams()
 
  const user = searchParams.get('user')
  const slot = searchParams.get('slot')

  const deserializedUser = user ? JSON.parse(user) : null;
  const deserializedSlot = slot ? JSON.parse(slot) : null;

  useEffect(()=>{
    setName(deserializedUser?.name);;
    setHourlyPrice(deserializedUser?.shootingPrice);
    setProfileImage(deserializedUser?.profileImage);

  },[searchParams])

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
        <span className="text-[16px] leading-[24px] text-center font-semibold">Book Slot</span>
      </header>
      
      <div className='max-w-[800px] mx-auto w-full'>
        <div className='m-4 p-2 min-h-[120px] bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-between flex-wrap gap-4 px-4'>
          <div className='h-[88px] w-[88px] rounded-full border-[2px] border-[#2EC4B626]'>
            {profileImage === "" ?
            <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" className='h-full w-full rounded-full'/>
            :
            <Image src={profileImage} alt="User" height={88} width={88} className='h-full w-full object-cover object-center rounded-full'/>
            }
          </div>
          <div className='flex-1 flex items-center justify-between'>
            <div className='flex flex-col items-start justify-center gap-1'>
              {loading ?
              <>
              <div className='h-4 w-32 bg-gray-200 animate-pulse rounded-md'></div>
              <div className='h-4 w-24 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <span className='font-semibold text-[16px] leading-[24px] text-[#111111]'>{name}</span>
              <span className='font-medium text-[10px] leading-[15px] text-[#999999]'>Price charged as Hourly rate</span>
              <span className='font-medium text-[14px] leading-[25px] text-[#999999] flex items-center justify-between flex-wrap gap-2'><span className='text-[#FF0000] flex items-center justify-center gap-2'>{clockIcon} 60 Min</span> <span className='text-[#2EC458] flex items-center justify-center gap-2'>{jpyIcon} {hourlyPrice}</span></span>
              </>              
              }
            </div>
          </div>
        </div>
      </div>

      <div className='bg-[#FFBF691A] border-[1px] border-[#99999914] min-h-[50px] py-2 font-medium text-[12px] leading-[18px] text-[#777777] flex items-center justify-start md:justify-center px-4'>
        By filling this, your request will go to “Model” and you get a notification when she/he accepts the request.
      </div>

      <div className='max-w-[800px] mx-auto w-full my-4 space-y-4'>
        <span className='text-[16px] font-semibold m-4'>Selected slot</span>
        <div className='mx-4 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-l-[6px] border-[#2EC458] rounded-md flex items-center justify-between'>
            <div className='flex flex-col items-start justify-between gap-2'>
              <span className='text-[14px] font-medium text-[#111111]'>Slot Choice</span>
              <span className='text-[12px] font-normal text-[#999999]'>Slot Booked on <span className='text-[12px] font-normal text-[#111111]'>{format(parseISO(deserializedSlot?.date), "dd-MM-yyyy")}</span></span>
            </div>
            <div>
              <span className='text-[12px] font-semibold text-primary'>{format(parseISO(deserializedSlot?.startTime), "h:mm a")} - {format(parseISO(deserializedSlot?.endTime), "h:mm a")}</span>
            </div>
        </div>
      </div>

      <div className='px-4 py-4 flex items-center justify-center'>
        <Link
          href={{
            pathname:"/userDetails/book-slot/booking-details",
            query: {
              slot: JSON.stringify(deserializedSlot)
            },
          }}
         className='w-[calc(min(100%,800px))] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Continue</Link>
      </div>

    </div>
  )
}

export default BookSlot

const clockIcon = <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 9.5H8.4C8.39986 9.57885 8.41526 9.65695 8.44532 9.72984C8.47538 9.80273 8.51952 9.86898 8.5752 9.9248L9 9.5ZM9 17.3C6.93131 17.3 4.94735 16.4782 3.48457 15.0154C2.02178 13.5526 1.2 11.5687 1.2 9.5H0C0 11.8869 0.948212 14.1761 2.63604 15.864C4.32387 17.5518 6.61305 18.5 9 18.5V17.3ZM16.8 9.5C16.8 10.5243 16.5982 11.5386 16.2063 12.4849C15.8143 13.4313 15.2397 14.2911 14.5154 15.0154C13.7911 15.7397 12.9313 16.3143 11.9849 16.7063C11.0386 17.0982 10.0243 17.3 9 17.3V18.5C11.3869 18.5 13.6761 17.5518 15.364 15.864C17.0518 14.1761 18 11.8869 18 9.5H16.8ZM9 1.7C10.0243 1.7 11.0386 1.90175 11.9849 2.29374C12.9313 2.68573 13.7911 3.26027 14.5154 3.98457C15.2397 4.70886 15.8143 5.56873 16.2063 6.51507C16.5982 7.46141 16.8 8.47569 16.8 9.5H18C18 7.11305 17.0518 4.82387 15.364 3.13604C13.6761 1.44821 11.3869 0.5 9 0.5V1.7ZM9 0.5C6.61305 0.5 4.32387 1.44821 2.63604 3.13604C0.948212 4.82387 0 7.11305 0 9.5H1.2C1.2 7.43131 2.02178 5.44735 3.48457 3.98457C4.94735 2.52178 6.93131 1.7 9 1.7V0.5ZM8.4 4.1V9.5H9.6V4.1H8.4ZM8.5752 9.9248L12.1752 13.5248L13.0248 12.6752L9.4248 9.0752L8.5752 9.9248Z" fill="#FF0000"/>
</svg>

const jpyIcon = <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 6L10 10.5M10 10.5L13 6M10 10.5V15.75M13 10.5H7M13 13.5H7M19 10.5C19 11.6819 18.7672 12.8522 18.3149 13.9442C17.8626 15.0361 17.1997 16.0282 16.364 16.864C15.5282 17.6997 14.5361 18.3626 13.4442 18.8149C12.3522 19.2672 11.1819 19.5 10 19.5C8.8181 19.5 7.64778 19.2672 6.55585 18.8149C5.46392 18.3626 4.47177 17.6997 3.63604 16.864C2.80031 16.0282 2.13738 15.0361 1.68508 13.9442C1.23279 12.8522 1 11.6819 1 10.5C1 8.11305 1.94821 5.82387 3.63604 4.13604C5.32387 2.44821 7.61305 1.5 10 1.5C12.3869 1.5 14.6761 2.44821 16.364 4.13604C18.0518 5.82387 19 8.11305 19 10.5Z" stroke="#2EC458" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
