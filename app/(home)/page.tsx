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
import { useRouter } from 'next/navigation'
import { EventTile, UserTile } from '@/components/common/tile'
import { useToast } from '@/hooks/use-toast'
import TileSkeleton from '@/components/common/tileSkeleton'
import { preloadFont } from 'next/dist/server/app-render/entry-base'

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
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Momoka",
    location:"Tokyo",
    profilePic:"/images/home/model2.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Arisa",
    location:"Tokyo",
    profilePic:"/images/home/model3.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    profilePic:"/images/home/model1.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Momoka",
    location:"Tokyo",
    profilePic:"/images/home/model2.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Arisa",
    location:"Tokyo",
    profilePic:"/images/home/model3.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
]

const availableModelList = [
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    profilePic:"/images/home/model4.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Momoka",
    location:"Tokyo",
    profilePic:"/images/home/model3.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Arisa",
    location:"Tokyo",
    profilePic:"/images/home/model1.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Satomi Ishihara",
    location:"Tokyo",
    profilePic:"/images/home/model4.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Momoka",
    location:"Tokyo",
    profilePic:"/images/home/model2.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    name:"Arisa",
    location:"Tokyo",
    profilePic:"/images/home/model3.png",
    userId:"harish32380",
    dateOfJoining: new Date(new Date().setDate(new Date().getDate() - 10))
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
  const router = useRouter();
  const [loading,setLoading] = useState(true);
  const {toast} = useToast();
  const [profession,setProfession] = useState("");
  const [modelsNew,setModelsNew] = useState([]);
  
    const handleGoToLink = (route:string)=>{
      router.push(route)
    }

  useEffect(()=>{
    setNotificationCount(7);
    setMessageCount(5);
  },[])

  useEffect(()=>{
      try {
        const fetchUser = async ()=>{
          setLoading(true);
          const professionFromLS = localStorage.getItem('userProfession') || '';
          setProfession(professionFromLS);
          const pageNo = 1;
          const pageSize = 10;
          const isNew = true;
          const type = professionFromLS;
          const queryParams = new URLSearchParams({
            pageNo: pageNo.toString(),
            pageSize: pageSize.toString(),
            isNew: isNew.toString(),
            type: type,
          }).toString();
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/data/models?${queryParams}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials:"include",
          });
  
          if(res.status===200){
            const data = await res.json();
            const transformedModels = data.models.map((user:any) => ({
              name: `${user.firstName} ${user.lastName}`.trim(),
              location: user.address,
              profilePic: user.profilePicture,
              userId: user.userId,
              dateOfJoining: new Date(user.createdAt) // Convert to Date object
            }));
            setModelsNew(transformedModels)
          }
          else{
            // toast({
            //   title:"Error",
            //   description:"Unauthorized request",
            //   variant:"destructive"
            // })
          }
          
        }
  
        fetchUser();
  
        
      } catch (error) {
        console.log("Error",error)
      } finally{
        setLoading(false)
      }
    },[])

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <header className='flex items-center justify-between p-8'>
        <span className='text-[14px] font-bold tracking-[8px]'>TORITORA</span>
        <div className='flex items-center justify-center gap-4'>
          <button onClick={()=>{handleGoToLink("/favourites")}} className='relative'>
          {starIcon}
          </button>
          <button onClick={()=>{handleGoToLink("/notifications")}} className='relative'>
          {bellIcon}
          <span className='text-center text-white p-0 text-[10px] bg-primary h-4 w-4 absolute -top-2 -right-1 rounded-full'>{notificationCount}</span>
          </button>
          <button onClick={()=>{handleGoToLink("/chats")}} className='relative'>
          {chatIcon}
          <span className='text-center text-white p-0 text-[10px] bg-primary h-4 w-4 absolute -top-2 -right-1 rounded-full'>{messageCount}</span>
          </button>
        </div>
      </header>

      {/* Tab selector */}
      <div className='bg-primary-foreground'>
        <div className='max-w-[800px] mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-center gap-[8px] transition-all duration-300'>
          <button onClick={()=>setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>Model</button>
          <button onClick={()=>setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>Kikaku / Satueikai</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className='max-w-[800px] mx-auto relative h-[42px] w-full px-[24px] my-[12px]'>
        <input 
        type="text" 
        className='bg-[#EEF2F5] h-[42px] w-full pl-[20px] pr-[40px] rounded-md outline-none focus:outline-none'
        placeholder='Find your favourite Model'
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        onFocus={()=>{handleGoToLink("/search")}}
        />
        <div className='absolute top-[50%] translate-y-[-50%] right-[34px]'>
          {searchIcon}
        </div>
      </div>

      <div className='flex-1 overflow-y-scroll no-scrollbar'>
        
      {/* Carousel Container for models */}
      {selectedMode === 0 &&
      <div className='max-w-[800px] mx-auto px-[24px] mt-[24px] flex items-center justify-center w-full'>
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
            <div className="h-[180px] md:h-[380px] w-full relative">
              <Image
                src={item.image}
                alt="Carousel List Image"
                height={180}
                width={380}
                objectFit="cover"
                objectPosition='center'
                className="w-full bg-center rounded-md"
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
      <div className='max-w-[800px] mx-auto px-[24px] space-y-2 pt-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>New {profession === "modelling"? "Photographers" : profession === "photographer" ? "Models" : "Users" }</span>
          <button onClick={()=>handleGoToLink("/")} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</button>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll md:flex-wrap py-2 no-scrollbar px-2 rounded-md'>
          {loading ? <TileSkeleton/> : modelsNew.map((item,index)=>(
            <UserTile key={index} user={item} />
          ))}
          {
            !loading && !modelsNew.length && <span className='text-sm font-semibold text-[#999999]'>No new models</span>
          }
        </div>
        
      </div>
      }

      {/* Availabel Models section */}
      {selectedMode === 0 &&
      <div className='max-w-[800px] mx-auto px-[24px] space-y-2 my-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>Available this week</span>
          <button onClick={()=>handleGoToLink("/")} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</button>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll md:flex-wrap py-2 no-scrollbar px-2 rounded-md'>
          {loading ? <TileSkeleton/> : availableModelList.map((item,index)=>(
            <UserTile key={index} user={item} />
          ))}
        </div>
        
      </div>
      }

      {/* Carousel Container for events */}
      {selectedMode === 1 &&
      <div className='max-w-[800px] mx-auto px-[24px] mt-[24px] flex items-center justify-center w-full'>
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
            <div className="h-[180px] md:h-[380px] w-full relative">
              <Image
                src={item.image}
                alt="Carousel List Image"
                height={180}
                width={380}
                objectFit="cover"
                objectPosition='center'
                className="w-full bg-center rounded-md"
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
      <div className='max-w-[800px] mx-auto px-[24px] space-y-2 pt-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>Popular Events</span>
          <button onClick={()=>handleGoToLink("/")} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</button>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll md:flex-wrap py-2 no-scrollbar px-2 rounded-md'>
          {loading ? <TileSkeleton/> : popularEventList.map((item,index)=>(
            <EventTile key={index} event={item} />
          ))}
        </div>
        
      </div>
      }

      {/* Availabel Events section */}
      {selectedMode === 1 &&
      <div className='max-w-[800px] mx-auto px-[24px] space-y-2 my-[24px]'>
        <div className='flex items-center justify-between'>
          <span className='text-[16px] font-medium leading-[24px]'>Mini Sessions</span>
          <button onClick={()=>handleGoToLink("/")} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</button>
        </div>

        <div className='bg-[#F0F0F1] flex flex-row items-center gap-[10px] overflow-x-scroll md:flex-wrap py-2 no-scrollbar px-2 rounded-md'>
          {loading ? <TileSkeleton/> : miniSessionsList.map((item,index)=>(
            <EventTile key={index} event={item} />
          ))}
        </div>
        
      </div>
      }

    </div>

    </div>
  )
}

export default Home