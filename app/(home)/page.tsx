"use client"
import React, { useEffect, useState } from 'react'

import { starIcon,bellIcon,chatIcon,searchIcon,locationIcon,locationWhiteIcon } from '@/constants/icons'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination,EffectFade,Autoplay } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const modelCarouselList = [
  {
    name:"Minami",
    location:"Tokai",
    image:"/images/home/carousel1.png"
  },
  {
    name:"Minami",
    location:"Tokai",
    image:"/images/home/carousel2.png"
  },
  {
    name:"Minami",
    location:"Tokai",
    image:"/images/home/carousel3.png"
  },
  {
    name:"Minami",
    location:"Tokai",
    image:"/images/home/carousel1.png"
  },
]

const newModelList = [
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    profilePic:"/images/home/model1.png",
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
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    profilePic:"/images/home/model1.png",
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

const eventCarouselList = [
  {
    name:"Kikaku New Event",
    location:"Tokai",
    image:"/images/home/event1.jpeg"
  },
  {
    name:"Kikaku New Event",
    location:"Tokai",
    image:"/images/home/event5.jpeg"
  },
  {
    name:"Kikaku New Event",
    location:"Tokai",
    image:"/images/home/event3.jpeg"
  },
  {
    name:"Kikaku New Event",
    location:"Tokai",
    image:"/images/home/event4.jpeg"
  },
]

const popularEventList = [
  {
    name:"Event Name",
    location:"Tokyo",
    eventPic:"/images/home/event1.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Green Kikaku",
    location:"Tokyo",
    eventPic:"/images/home/event2.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Green",
    location:"Tokyo",
    eventPic:"/images/home/event3.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    eventPic:"/images/home/event5.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Momoka",
    location:"Tokyo",
    eventPic:"/images/home/event2.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Arisa",
    location:"Tokyo",
    eventPic:"/images/home/event3.jpeg",
    date:"29/01/03",
    eventId:"",
  },
]

const miniSessionsList = [
  {
    name:"Event Name",
    location:"Tokyo",
    eventPic:"/images/home/event5.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Green Kikaku",
    location:"Tokyo",
    eventPic:"/images/home/event4.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Green",
    location:"Tokyo",
    eventPic:"/images/home/event3.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    eventPic:"/images/home/event1.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Momoka",
    location:"Tokyo",
    eventPic:"/images/home/event2.jpeg",
    date:"29/01/03",
    eventId:"",
  },
  {
    name:"Arisa",
    location:"Tokyo",
    eventPic:"/images/home/event3.jpeg",
    date:"29/01/03",
    eventId:"",
  },
]

function Home() {
  // Mode is 0 for model section and 1 for event section
  const [selectedMode,setSelectedMode] = useState(0);
  const [notificationCount, setNotificationCount] = useState(5);
  const [messageCount, setMessageCount] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(()=>{
    setNotificationCount(7);
    setMessageCount(5);
  },[])

  return (
    <div>
      {/* Header */}
      <header className='flex items-center justify-between p-8'>
        <span className='text-[14px] font-bold tracking-[8px]'>TORITORA</span>
        <div className='flex items-center justify-center gap-4'>
          <Link href={"/"} className='relative'>
          {starIcon}
          </Link>
          <Link href={"/"} className='relative'>
          {bellIcon}
          <span className='text-center text-white p-0 text-[10px] bg-primary h-4 w-4 absolute -top-2 -right-1 rounded-full'>{notificationCount}</span>
          </Link>
          <Link href={"/"} className='relative'>
          {chatIcon}
          <span className='text-center text-white p-0 text-[10px] bg-primary h-4 w-4 absolute -top-2 -right-1 rounded-full'>{messageCount}</span>
          </Link>
        </div>
      </header>

      {/* Tab selector */}
      <div className='h-[52px] w-full flex items-center justify-center gap-[8px] bg-primary-foreground transition-all duration-300'>
        <button onClick={()=>setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>Model</button>
        <button onClick={()=>setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>Kikaku / Satueikai</button>
      </div>

      {/* Search Bar */}
      <div className='relative h-[42px] w-full px-[24px] my-[12px]'>
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

      {/* Carousel Container for models */}
      {selectedMode === 0 &&
      <div className='px-[24px] mt-[24px] flex items-center justify-center w-full'>
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        effect="fade"
        spaceBetween={20}
        className="flex items-center justify-center"
        modules={[Autoplay, Pagination, EffectFade]}
      >
        {modelCarouselList.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="h-[180px] w-full relative">
              <Image
                src={item.image}
                alt="Carousel List Image"
                height={180}
                width={380}
                className="w-full aspect-[380/180] rounded-md object-cover"
              />
              <div className="absolute inset-0 bg-black/40 rounded-md"></div>
              <div className="absolute bottom-5 left-5 text-white flex flex-col items-start">
                <span className='text-[16px] leading-[24px] font-medium'>{item.name}</span>
                <span className="flex flex-row items-center justify-center gap-2 text-[12px] leading-[16px] font-normal">
                  {locationWhiteIcon}
                  {item.location}
                </span>
              </div>
              <span className='absolute top-4 right-3 px-3 py-1 text-[10px] leading-[15px] font-normal text-white rounded-lg bg-[#11111180]'>{index+1}/{modelCarouselList.length}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      }

      {/* New Models section */}
      {selectedMode === 0 &&
      <div className='px-[24px] space-y-2 pt-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>New Models</span>
          <Link href={"/"} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</Link>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll py-2 no-scrollbar px-2 rounded-md'>
          {newModelList.map((item,index)=>(
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
      }

      {/* Availabel Models section */}
      {selectedMode === 0 &&
      <div className='px-[24px] space-y-2 my-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>Available this week</span>
          <Link href={"/"} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</Link>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll py-2 no-scrollbar px-2 rounded-md'>
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
      }

      {/* Carousel Container for events */}
      {selectedMode === 1 &&
      <div className='px-[24px] mt-[24px] flex items-center justify-center w-full'>
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        effect="fade"
        spaceBetween={20}
        className="flex items-center justify-center"
        modules={[Autoplay, Pagination, EffectFade]}
      >
        {eventCarouselList.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="h-[180px] w-full relative">
              <Image
                src={item.image}
                alt="Carousel List Image"
                height={180}
                width={380}
                className="w-full aspect-[380/180] rounded-md object-cover"
              />
              <div className="absolute inset-0 bg-black/40 rounded-md"></div>
              <div className="absolute bottom-5 left-5 text-white flex flex-col items-start">
                <span className='text-[16px] leading-[24px] font-medium'>{item.name}</span>
                <span className="flex flex-row items-center justify-center gap-2 text-[12px] leading-[16px] font-normal">
                  {locationWhiteIcon}
                  {item.location}
                </span>
              </div>
              <span className='absolute top-4 right-3 px-3 py-1 text-[10px] leading-[15px] font-normal text-white rounded-lg bg-[#11111180]'>{index+1}/{modelCarouselList.length}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      }

      {/* New Events section */}
      {selectedMode === 1 &&
      <div className='px-[24px] space-y-2 pt-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>New Models</span>
          <Link href={"/"} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</Link>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll py-2 no-scrollbar px-2 rounded-md'>
          {popularEventList.map((item,index)=>(
            <div key={index} className='bg-white h-[226px] w-[172px] flex-shrink-0 rounded-md flex flex-col gap-2 items-center justify-between px-[12px] py-[14px]'>

              <div className='relative'>
                <Image src={item.eventPic} alt='userImage' width={148} height={151} className='h-[151px] w-[148px] rounded-md object-cover'></Image>
                <span className='absolute top-0 left-0 bg-secondary w-[64px] h-[18px] text-center text-white text-[10px] leading-[15px] font-medium rounded-tl-md rounded-br-md'>{item.date}</span>
              </div>

              <div className='flex flex-col items-start justify-center w-full'>
                <span className='text-[14px] leading-[21px] font-medium'>{item.name}</span>
                <div className='flex items-center justify-between w-full'>
                  <span className='flex flex-row items-center justify-center gap-2 text-[10px] leading-[15px] font-normal text-[#999999]'>{locationIcon}{item.location}</span>
                  <Link href={`/eventDetails?eventId=${item.eventId}`} className='text-primary text-[12px] font-medium leading-[18px]'>View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      }

      {/* Availabel Events section */}
      {selectedMode === 1 &&
      <div className='px-[24px] space-y-2 my-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>Available this week</span>
          <Link href={"/"} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</Link>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll py-2 no-scrollbar px-2 rounded-md'>
          {miniSessionsList.map((item,index)=>(
            <div key={index} className='bg-white h-[226px] w-[172px] flex-shrink-0 rounded-md flex flex-col gap-2 items-center justify-between px-[12px] py-[14px]'>

              <div className='relative'>
                <Image src={item.eventPic} alt='userImage' width={148} height={151} className='h-[151px] w-[148px] rounded-md object-cover'></Image>
                <span className='absolute top-0 left-0 bg-secondary w-[64px] h-[18px] text-center text-white text-[10px] leading-[15px] font-medium rounded-tl-md rounded-br-md'>{item.date}</span>
              </div>

              <div className='flex flex-col items-start justify-center w-full'>
                <span className='text-[14px] leading-[21px] font-medium'>{item.name}</span>
                <div className='flex items-center justify-between w-full'>
                  <span className='flex flex-row items-center justify-center gap-2 text-[10px] leading-[15px] font-normal text-[#999999]'>{locationIcon}{item.location}</span>
                  <Link href={`/eventDetails?eventId=${item.eventId}`} className='text-primary text-[12px] font-medium leading-[18px]'>View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      }

    </div>
  )
}

export default Home