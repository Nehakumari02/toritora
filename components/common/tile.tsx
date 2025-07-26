import { locationIcon } from '@/constants/icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import { useTranslations } from 'next-intl'

interface UserTileProps {
  user: {
    name: string;
    location: string;
    profilePic: string;
    userId: string;
    dateOfJoining?: Date;
  };
}

interface EventTileProps {
  event: {
    name: string;
    location: string;
    eventPic: string;
    date: string;
    eventId: string;
  };
}

const isFiveDaysOld = (dateOfJoining?: Date): boolean => {
  if (!dateOfJoining) return false;

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  return dateOfJoining <= fiveDaysAgo;
};

export function UserTile({ user }: UserTileProps) {
  const t = useTranslations('Registration');
  return (
    <div className='bg-white h-[226px] w-[172px] flex-shrink-0 rounded-md flex flex-col gap-2 items-center px-[12px] py-[14px]'>
      <div className='relative'>
        <Image src={user.profilePic || userAvatar} alt='userImage' width={148} height={151} className='h-[151px] w-[148px] rounded-md object-cover' />
        {!isFiveDaysOld(user?.dateOfJoining) && <span className='absolute top-0 left-0 bg-secondary w-[64px] h-[18px] text-center text-white text-[10px] leading-[15px] font-medium rounded-tl-md rounded-br-md'>New</span>}
      </div>
      <div className='flex flex-col items-start justify-center w-full'>
        <span className='text-[14px] leading-[21px] font-medium'>{user.name}</span>
        {/* <span className='text-[10px] text-gray-500'>Joined: {user.dateOfJoining?.toDateString()}</span> */}
        <div className='flex items-center justify-between w-full'>
          <span className='flex items-center justify-center gap-2 text-[10px] leading-[15px] font-normal text-[#999999]'>{locationIcon}{user.location}</span>
          <Link href={`/userDetails?userId=${user.userId}`} className='text-primary text-[12px] font-medium leading-[18px]'>{t("view")}</Link>
        </div>
      </div>
    </div>
  );
}

export function EventTile({ event }: EventTileProps) {
  return (
    <div className='bg-white min-h-[236px] w-[172px] flex-shrink-0 rounded-md flex flex-col gap-2 items-center px-[12px] py-[14px]'>
      <div className='relative'>
        <Image src={event.eventPic} alt='eventImage' width={148} height={151} className='h-[151px] w-[148px] rounded-md object-cover' />
        <span className='absolute top-0 left-0 bg-secondary w-[64px] h-[18px] text-center text-white text-[10px] leading-[15px] font-medium rounded-tl-md rounded-br-md'>{event.date}</span>
      </div>
      <div className='flex flex-col items-start justify-center w-full'>
        <span className='text-[14px] leading-[21px] font-medium'>{event.name}</span>
        <div className='flex items-center justify-between w-full'>
          <span className='flex items-center justify-center gap-2 text-[10px] leading-[15px] font-normal text-[#999999]'>{locationIcon}{event.location}</span>
          <Link href={`/eventDetails?eventId=${event.eventId}`} className='text-primary text-[12px] font-medium leading-[18px]'>View</Link>
        </div>
      </div>
    </div>
  );
}
