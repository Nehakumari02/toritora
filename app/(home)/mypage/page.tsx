"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';

function MyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name,setName] = useState("")
  const [userName,setUserName] = useState("")
  const [loading,setLoading] = useState(true)
  const [profileImage,setProfileImage] = useState("");
  const logout = useLogout();

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  useEffect( ()=>{
    try {
      const fetchUser = async ()=>{
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials:"include",
        });

        const data = await res.json();

        if(res.status===200){
          setName(`${data.user?.firstName ?? 'Guest'} ${data.user?.lastName ?? ''}`.trim());
          setUserName(data.user?.username ?? 'Anonymous');
          setProfileImage(data.user?.profilePicture ?? '');
        }
        else if(res.status === 401){
          toast({
            title:"Error",
            description:"Unauthorized request",
            variant:"destructive"
          })
          logout();
        }
        else {
          toast({
            title:"Internal server error",
            description:`Error: ${data.message}`,
            variant:"destructive"
          })
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
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
        <span className="text-[16px] leading-[24px] text-center font-semibold">My Page</span>
      </header>

      <div className='bg-[#f8fcfd] overflow-y-scroll flex-1 no-scrollbar'>
      <div className='max-w-[800px] mx-auto p-4 py-6'>
        <div className='h-[120px] bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-between gap-4 px-4'>
          <div className='h-[88px] w-[88px] rounded-full border-[3px] border-secondary'>
            {profileImage === "" ?
            <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" className='h-full w-full rounded-full p-[2px]'/>
            :
            <Image src={profileImage} alt="User" height={88} width={88} className='h-full w-full object-cover object-center rounded-full p-[2px]'/>
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
              <span className='font-medium text-[10px] leading-[15px] text-[#999999]'>{userName}</span>
              </>              
              }
            </div>
            <button onClick={()=>handleGoToLink("/profile")} className='bg-[#FF9F1C] px-8 py-2 rounded-md text-white font-medium text-[10px] leading-[15px]'>
              View
            </button>
          </div>
        </div>

        <div className='flex flex-row items-center justify-center gap-4 flex-wrap py-6'>
          <button onClick={()=>handleGoToLink("/mypage")} className='h-[98px] w-[170px] rounded-md flex flex-col items-center justify-center gap-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
            {cameraIcon}
            <span className='font-normal text-[12px] leading-[18px] text-[#111111]'>Shooting request list</span>
          </button>
          <button onClick={()=>handleGoToLink("/mypage")} className='h-[98px] w-[170px] rounded-md flex flex-col items-center justify-center gap-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
            {smileIcon}
            <span className='font-normal text-[12px] leading-[18px] text-[#111111]'>Toritai Toraretai</span>
          </button>
          <button onClick={()=>handleGoToLink("/mypage")} className='h-[98px] w-[170px] rounded-md flex flex-col items-center justify-center gap-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
            {starIcon}
            <span className='font-normal text-[12px] leading-[18px] text-[#111111]'>My Favourites</span>
          </button>
          <button onClick={()=>handleGoToLink("/mypage")} className='h-[98px] w-[170px] rounded-md flex flex-col items-center justify-center gap-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
            {fileIcon}
            <span className='font-normal text-[12px] leading-[18px] text-[#111111]'>Toritora college</span>
          </button>
        </div>

        <div className='space-y-4'>
          <span className='font-medium text-[12px] leading-[18px] text-[#999999]'>Other Settings</span>
          <div className='flex flex-col items-center justify-center gap-6 p-8 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
            {otherSettings.map((item,index)=>{
              return(
                <button className='w-full h-8 flex items-center justify-between' key={index} onClick={()=>handleGoToLink(item.link)}>
                  <span className='flex items-center justify-center gap-4 font-normal text-[12px] leading-[18px] text-[#111111]'>{item.icon} {item.name}</span>

                  {rightArrowIcon}
                </button>
              )
            })}
          </div>
        </div>

        <div className='mt-4'>
          <button onClick={logout} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Logout</button>
        </div>
      </div>
      </div>

    </div>
  )
}

export default MyPage


const cameraIcon = <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.97271 4.61644V5.61644C8.32838 5.61644 8.65728 5.42753 8.83649 5.12031L7.97271 4.61644ZM10.0823 1V0C9.72663 0 9.39773 0.188911 9.21852 0.496129L10.0823 1ZM17.9179 1L18.7817 0.496129C18.6025 0.188911 18.2736 0 17.9179 0V1ZM20.0275 4.61644L19.1637 5.12031C19.3429 5.42753 19.6718 5.61644 20.0275 5.61644V4.61644ZM2.94531 19.9863V7.63014H0.945312V19.9863H2.94531ZM4.95901 5.61644H7.97271V3.61644H4.95901V5.61644ZM8.83649 5.12031L10.9461 1.50387L9.21852 0.496129L7.10893 4.11257L8.83649 5.12031ZM10.0823 2H17.9179V0H10.0823V2ZM17.0541 1.50387L19.1637 5.12031L20.8913 4.11257L18.7817 0.496129L17.0541 1.50387ZM20.0275 5.61644H23.0412V3.61644H20.0275V5.61644ZM25.0549 7.63014V19.9863H27.0549V7.63014H25.0549ZM25.0549 19.9863C25.0549 21.0984 24.1533 22 23.0412 22V24C25.2579 24 27.0549 22.203 27.0549 19.9863H25.0549ZM23.0412 5.61644C24.1533 5.61644 25.0549 6.518 25.0549 7.63014H27.0549C27.0549 5.41343 25.2579 3.61644 23.0412 3.61644V5.61644ZM2.94531 7.63014C2.94531 6.518 3.84688 5.61644 4.95901 5.61644V3.61644C2.74231 3.61644 0.945312 5.41343 0.945312 7.63014H2.94531ZM4.95901 22C3.84688 22 2.94531 21.0984 2.94531 19.9863H0.945312C0.945312 22.203 2.74231 24 4.95901 24V22ZM17.5207 13.0548C17.5207 14.9991 15.9445 16.5753 14.0001 16.5753V18.5753C17.049 18.5753 19.5207 16.1037 19.5207 13.0548H17.5207ZM14.0001 16.5753C12.0558 16.5753 10.4796 14.9991 10.4796 13.0548H8.47956C8.47956 16.1037 10.9512 18.5753 14.0001 18.5753V16.5753ZM10.4796 13.0548C10.4796 11.1104 12.0558 9.53425 14.0001 9.53425V7.53425C10.9512 7.53425 8.47956 10.0059 8.47956 13.0548H10.4796ZM14.0001 9.53425C15.9445 9.53425 17.5207 11.1104 17.5207 13.0548H19.5207C19.5207 10.0059 17.049 7.53425 14.0001 7.53425V9.53425ZM23.0412 22H4.95901V24H23.0412V22Z" fill="#2EC4B6"/>
</svg>

const smileIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.7 8.7V7.7C8.14772 7.7 7.7 8.14772 7.7 8.7H8.7ZM8.80957 8.7H9.80957C9.80957 8.14772 9.36185 7.7 8.80957 7.7V8.7ZM15.3 8.7V7.7C14.7477 7.7 14.3 8.14772 14.3 8.7H15.3ZM15.3974 8.7H16.3974C16.3974 8.14772 15.9497 7.7 15.3974 7.7V8.7ZM8.80957 8.78809V9.78809C9.36185 9.78809 9.80957 9.34037 9.80957 8.78809H8.80957ZM8.7 8.78809H7.7C7.7 9.34037 8.14772 9.78809 8.7 9.78809V8.78809ZM15.3974 8.78809V9.78809C15.9497 9.78809 16.3974 9.34037 16.3974 8.78809H15.3974ZM15.3 8.78809H14.3C14.3 9.34037 14.7477 9.78809 15.3 9.78809V8.78809ZM9.03689 14.8185C8.74621 14.3489 8.12988 14.2039 7.66028 14.4946C7.19069 14.7853 7.04565 15.4016 7.33633 15.8712L9.03689 14.8185ZM16.6637 15.8712C16.9544 15.4016 16.8093 14.7853 16.3397 14.4946C15.8701 14.2039 15.2538 14.3489 14.9631 14.8185L16.6637 15.8712ZM22 12C22 17.5228 17.5228 22 12 22V24C18.6274 24 24 18.6274 24 12H22ZM12 22C6.47715 22 2 17.5228 2 12H0C0 18.6274 5.37258 24 12 24V22ZM2 12C2 6.47715 6.47715 2 12 2V0C5.37258 0 0 5.37258 0 12H2ZM12 2C17.5228 2 22 6.47715 22 12H24C24 5.37258 18.6274 0 12 0V2ZM8.7 9.7H8.80957V7.7H8.7V9.7ZM15.3 9.7H15.3974V7.7H15.3V9.7ZM7.80957 8.7V8.78809H9.80957V8.7H7.80957ZM8.80957 7.78809H8.7V9.78809H8.80957V7.78809ZM9.7 8.78809V8.7H7.7V8.78809H9.7ZM14.3974 8.7V8.78809H16.3974V8.7H14.3974ZM15.3974 7.78809H15.3V9.78809H15.3974V7.78809ZM16.3 8.78809V8.7H14.3V8.78809H16.3ZM12 16.4999C10.7662 16.4999 9.66909 15.8399 9.03689 14.8185L7.33633 15.8712C8.30816 17.4412 10.0274 18.4999 12 18.4999V16.4999ZM14.9631 14.8185C14.3309 15.8399 13.2338 16.4999 12 16.4999V18.4999C13.9726 18.4999 15.6918 17.4412 16.6637 15.8712L14.9631 14.8185Z" fill="#2EC4B6"/>
</svg>

const starIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 19.4307L6.66777 22.794C6.43222 22.951 6.18597 23.0182 5.929 22.9958C5.67204 22.9734 5.4472 22.8837 5.25447 22.7267C5.06175 22.5698 4.91186 22.3738 4.80479 22.1388C4.69772 21.903 4.67631 21.6393 4.74055 21.3478L6.15385 14.9912L1.43215 10.7199C1.21801 10.5181 1.08439 10.288 1.03128 10.0297C0.977323 9.77231 0.993169 9.52029 1.07882 9.27365C1.16448 9.02701 1.29296 8.82521 1.46427 8.66826C1.63558 8.51131 1.87113 8.41041 2.17092 8.36557L8.40227 7.79381L10.8113 1.80719C10.9184 1.53812 11.0845 1.33633 11.3098 1.2018C11.5342 1.06727 11.7642 1 11.9998 1C12.2353 1 12.4657 1.06727 12.691 1.2018C12.9154 1.33633 13.0811 1.53812 13.1882 1.80719L15.5972 7.79381L21.8286 8.36557C22.1284 8.41041 22.3639 8.51131 22.5352 8.66826C22.7066 8.82521 22.835 9.02701 22.9207 9.27365C23.0063 9.52029 23.0226 9.77231 22.9695 10.0297C22.9156 10.288 22.7815 10.5181 22.5674 10.7199L17.8457 14.9912L19.259 21.3478C19.3232 21.6393 19.3018 21.903 19.1947 22.1388C19.0877 22.3738 18.9378 22.5698 18.745 22.7267C18.5523 22.8837 18.3275 22.9734 18.0705 22.9958C17.8135 23.0182 17.5673 22.951 17.3317 22.794L11.9998 19.4307Z" stroke="#2EC4B6" strokeWidth="2"/>
</svg>

const fileIcon = <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.4379 1V5.125C13.4379 5.88439 14.0535 6.5 14.8129 6.5H18.9379M5.87543 6.5H8.62543M5.87543 10.625H14.1254M5.87543 14.75H14.1254M16.8754 3.0625C16.2635 2.51495 15.6284 1.86554 15.2276 1.44376C14.9608 1.16309 14.5922 1 14.205 1H3.81261C2.29383 1 1.06262 2.23121 1.06261 3.74999L1.0625 20.2499C1.06249 21.7687 2.2937 22.9999 3.81249 23L16.1875 23C17.7063 23 18.9375 21.7688 18.9376 20.2501L18.9379 5.67252C18.9379 5.32093 18.8038 4.98296 18.5598 4.72984C18.1086 4.26178 17.3551 3.49164 16.8754 3.0625Z" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

const profileIcon = <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1285 10.7087C12.228 10.7088 13.285 11.1333 14.0791 11.8937C14.8733 12.6542 15.3432 13.6918 15.3909 14.7902L15.3952 14.9754V15.8287C15.3953 16.2593 15.2327 16.674 14.9399 16.9897C14.6471 17.3055 14.2458 17.4989 13.8165 17.5312L13.6885 17.5354H1.74182C1.31125 17.5356 0.896539 17.3729 0.580822 17.0802C0.265104 16.7874 0.0717159 16.3861 0.039423 15.9567L0.0351562 15.8287V14.9754C0.0352198 13.8759 0.459725 12.8189 1.22015 12.0248C1.98057 11.2307 3.0182 10.7607 4.11665 10.713L4.30182 10.7087H11.1285ZM7.71516 0.46875C8.84675 0.46875 9.93199 0.918272 10.7321 1.71843C11.5323 2.51858 11.9818 3.60383 11.9818 4.73542C11.9818 5.86701 11.5323 6.95225 10.7321 7.75241C9.93199 8.55256 8.84675 9.00208 7.71516 9.00208C6.58357 9.00208 5.49832 8.55256 4.69817 7.75241C3.89801 6.95225 3.44849 5.86701 3.44849 4.73542C3.44849 3.60383 3.89801 2.51858 4.69817 1.71843C5.49832 0.918272 6.58357 0.46875 7.71516 0.46875Z" fill="#2EC4B6"/>
</svg>

const pointsIcon = <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.42 0.76C7.63508 0.259948 8.93606 0.00179152 10.25 0C11.56 0 12.86 0.26 14.08 0.76C15.29 1.26 16.39 2 17.32 2.93C18.25 3.86 18.99 4.96 19.49 6.17C19.99 7.39 20.25 8.69 20.25 10C20.25 12.65 19.2 15.2 17.32 17.07C16.3925 17.9998 15.2905 18.7373 14.0772 19.2401C12.8639 19.7429 11.5633 20.0011 10.25 20C8.93606 19.9982 7.63508 19.7401 6.42 19.24C5.20776 18.7369 4.10672 17.9994 3.18 17.07C2.2502 16.1425 1.51273 15.0405 1.00992 13.8272C0.507113 12.6139 0.248866 11.3133 0.250004 10C0.250004 7.35 1.3 4.8 3.18 2.93C4.11 2 5.21 1.26 6.42 0.76ZM10.25 15L11.81 11.58L15.25 10L11.81 8.44L10.25 5L8.68 8.44L5.25 10L8.68 11.58L10.25 15Z" fill="#2EC4B6"/>
</svg>

const settingsIcon = <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.41 18H9.57C9.78 18 9.96 17.9322 10.11 17.7966C10.26 17.6622 10.365 17.49 10.425 17.28L10.83 15.3C11.19 15.15 11.5278 14.9928 11.8434 14.8284C12.1578 14.6628 12.48 14.46 12.81 14.22L14.745 14.805C14.955 14.865 15.15 14.8578 15.33 14.7834C15.51 14.7078 15.66 14.58 15.78 14.4L16.86 12.6C16.98 12.42 17.01 12.225 16.95 12.015C16.89 11.805 16.785 11.625 16.635 11.475L15.15 10.17C15.21 9.75 15.24 9.36 15.24 9C15.24 8.64 15.21 8.25 15.15 7.83L16.635 6.525C16.785 6.375 16.89 6.195 16.95 5.985C17.01 5.775 16.98 5.58 16.86 5.4L15.78 3.6C15.66 3.42 15.51 3.2922 15.33 3.2166C15.15 3.1422 14.955 3.135 14.745 3.195L12.81 3.78C12.48 3.54 12.1578 3.3372 11.8434 3.1716C11.5278 3.0072 11.19 2.85 10.83 2.7L10.425 0.72C10.365 0.51 10.26 0.3372 10.11 0.2016C9.96 0.0672 9.78 0 9.57 0H7.41C7.2 0 7.02 0.0672 6.87 0.2016C6.72 0.3372 6.615 0.51 6.555 0.72L6.15 2.7C5.79 2.85 5.4522 3.0072 5.1366 3.1716C4.8222 3.3372 4.5 3.54 4.17 3.78L2.235 3.195C2.025 3.135 1.83 3.1422 1.65 3.2166C1.47 3.2922 1.32 3.42 1.2 3.6L0.12 5.4C-3.8892e-07 5.58 -0.0299999 5.775 0.0300001 5.985C0.0900001 6.195 0.195 6.375 0.345 6.525L1.83 7.83C1.77 8.25 1.74 8.64 1.74 9C1.74 9.36 1.77 9.75 1.83 10.17L0.345 11.475C0.195 11.625 0.0900001 11.805 0.0300001 12.015C-0.0299999 12.225 -3.8892e-07 12.42 0.12 12.6L1.2 14.4C1.32 14.58 1.47 14.7078 1.65 14.7834C1.83 14.8578 2.025 14.865 2.235 14.805L4.17 14.22C4.5 14.46 4.8222 14.6628 5.1366 14.8284C5.4522 14.9928 5.79 15.15 6.15 15.3L6.555 17.28C6.615 17.49 6.72 17.6622 6.87 17.7966C7.02 17.9322 7.2 18 7.41 18ZM8.49 12.6C7.5 12.6 6.6528 12.2472 5.9484 11.5416C5.2428 10.8372 4.89 9.99 4.89 9C4.89 8.01 5.2428 7.1622 5.9484 6.4566C6.6528 5.7522 7.5 5.4 8.49 5.4C9.48 5.4 10.3278 5.7522 11.0334 6.4566C11.7378 7.1622 12.09 8.01 12.09 9C12.09 9.99 11.7378 10.8372 11.0334 11.5416C10.3278 12.2472 9.48 12.6 8.49 12.6Z" fill="#2EC4B6"/>
</svg>

const questionIcon = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.955 14.4C9.27 14.4 9.5364 14.2911 9.7542 14.0733C9.9714 13.8561 10.08 13.59 10.08 13.275C10.08 12.96 9.9714 12.6939 9.7542 12.4767C9.5364 12.2589 9.27 12.15 8.955 12.15C8.64 12.15 8.3736 12.2589 8.1558 12.4767C7.9386 12.6939 7.83 12.96 7.83 13.275C7.83 13.59 7.9386 13.8561 8.1558 14.0733C8.3736 14.2911 8.64 14.4 8.955 14.4ZM8.145 10.935H9.81C9.81 10.44 9.8664 10.05 9.9792 9.765C10.0914 9.48 10.41 9.09 10.935 8.595C11.325 8.205 11.6325 7.8336 11.8575 7.4808C12.0825 7.1286 12.195 6.705 12.195 6.21C12.195 5.37 11.8875 4.725 11.2725 4.275C10.6575 3.825 9.93 3.6 9.09 3.6C8.235 3.6 7.5414 3.825 7.0092 4.275C6.4764 4.725 6.105 5.265 5.895 5.895L7.38 6.48C7.455 6.21 7.6239 5.9175 7.8867 5.6025C8.1489 5.2875 8.55 5.13 9.09 5.13C9.57 5.13 9.93 5.2611 10.17 5.5233C10.41 5.7861 10.53 6.075 10.53 6.39C10.53 6.69 10.44 6.9711 10.26 7.2333C10.08 7.4961 9.855 7.74 9.585 7.965C8.925 8.55 8.52 8.9925 8.37 9.2925C8.22 9.5925 8.145 10.14 8.145 10.935ZM9 18C7.755 18 6.585 17.7636 5.49 17.2908C4.395 16.8186 3.4425 16.1775 2.6325 15.3675C1.8225 14.5575 1.1814 13.605 0.7092 12.51C0.2364 11.415 0 10.245 0 9C0 7.755 0.2364 6.585 0.7092 5.49C1.1814 4.395 1.8225 3.4425 2.6325 2.6325C3.4425 1.8225 4.395 1.1811 5.49 0.7083C6.585 0.2361 7.755 0 9 0C10.245 0 11.415 0.2361 12.51 0.7083C13.605 1.1811 14.5575 1.8225 15.3675 2.6325C16.1775 3.4425 16.8186 4.395 17.2908 5.49C17.7636 6.585 18 7.755 18 9C18 10.245 17.7636 11.415 17.2908 12.51C16.8186 13.605 16.1775 14.5575 15.3675 15.3675C14.5575 16.1775 13.605 16.8186 12.51 17.2908C11.415 17.7636 10.245 18 9 18Z" fill="#2EC4B6"/>
</svg>

const feedbackIcon = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.875 11.363C8.41206 11.363 8.92713 11.5875 9.30689 11.9871C9.68665 12.3866 9.9 12.9285 9.9 13.4936V14.9159L9.8928 15.0181C9.6138 17.0322 7.8948 18 5.0103 18C2.1366 18 0.3897 17.0436 0.0125999 15.0532L0 14.914V13.4936C0 12.9285 0.213348 12.3866 0.593109 11.9871C0.97287 11.5875 1.48794 11.363 2.025 11.363H7.875ZM4.95 3.78768C5.36366 3.78768 5.77328 3.8734 6.15545 4.03996C6.53763 4.20651 6.88488 4.45064 7.17739 4.75839C7.46989 5.06615 7.70192 5.4315 7.86022 5.8336C8.01852 6.2357 8.1 6.66667 8.1 7.1019C8.1 7.53713 8.01852 7.9681 7.86022 8.3702C7.70192 8.77229 7.46989 9.13765 7.17739 9.44541C6.88488 9.75316 6.53763 9.99728 6.15545 10.1638C5.77328 10.3304 5.36366 10.4161 4.95 10.4161C4.11457 10.4161 3.31335 10.0669 2.72261 9.44541C2.13187 8.82387 1.8 7.98088 1.8 7.1019C1.8 6.22291 2.13187 5.37993 2.72261 4.75839C3.31335 4.13686 4.11457 3.78768 4.95 3.78768ZM15.975 0C16.5121 0 17.0271 0.22447 17.4069 0.624029C17.7867 1.02359 18 1.56551 18 2.13057V5.44479C18 5.72458 17.9476 6.00163 17.8459 6.26012C17.7441 6.51862 17.5949 6.75349 17.4069 6.95133C17.2189 7.14917 16.9956 7.30611 16.7499 7.41318C16.5042 7.52025 16.2409 7.57536 15.975 7.57536H14.5773L12.2904 9.66521C12.1601 9.78439 11.9999 9.8616 11.829 9.88765C11.6582 9.9137 11.4838 9.88748 11.3266 9.81211C11.1695 9.73675 11.0363 9.61543 10.943 9.46261C10.8496 9.3098 10.8 9.13196 10.8 8.95029V7.5621C10.305 7.50387 9.84774 7.25573 9.51567 6.86513C9.18361 6.47452 9.00002 5.96885 9 5.44479V2.13057C9 1.56551 9.21335 1.02359 9.59311 0.624029C9.97287 0.22447 10.4879 0 11.025 0H15.975Z" fill="#2EC4B6"/>
</svg>

const rightArrowIcon = <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.25 7.5L14.75 12L10.25 16.5" stroke="#999999" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
</svg>


const otherSettings = [
  {
    name:"Edit Profile",
    link:"/editProfile",
    icon:profileIcon
  },
  {
    name:"Your Points",
    link:"/points",
    icon:pointsIcon
  },
  {
    name:"My Settings",
    link:"/settings",
    icon:settingsIcon
  },
  {
    name:"Help / How to use Toritora",
    link:"/help",
    icon:questionIcon
  },
  {
    name:"Give Feedback",
    link:"/feedback",
    icon:feedbackIcon
  }
]