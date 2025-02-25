"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import Image from 'next/image';
import { backIcon } from '@/constants/icons';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';

function Profile() {
  const router = useRouter();
  const logout = useLogout();
  const [progressBarStep, setProgressBarStep] = useState(2);
  const [name,setName] = useState("")
  const [userName,setUserName] = useState("")
  const [userId,setUserId] = useState("")
  const [intro,setIntro] = useState("")
  const [location,setLocation] = useState("")
  const [genre,setGenre] = useState("")
  const [achievements,setAchievements] = useState<string[]>([])
  const [shootingPrice,setShootingPrice] = useState("")
  const [loading,setLoading] = useState(true)
  const [profileImage,setProfileImage] = useState("");

  const progressBarWidth: { [key: number]: string } = useMemo(() => ({
    1: "0",
    2: "50",
    3: "100"
  }), []);

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  useEffect( ()=>{
      setProgressBarStep(2)
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
            setUserId(data.user?.userId ?? '');
            setIntro(data.user?.selfIntroduction ?? 'No introduction provided');
            setLocation(data.user?.address ?? 'Location not available');
            setGenre(data.user?.genres ?? '');
            setAchievements(data.user?.achievements ?? []);
            setShootingPrice(data.user?.shootingPrice ?? 'Price not set');            
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
        toast({
          title:"Server internal error",
          description:`Error : ${error}`,
          variant:"destructive"
        })
        console.error("error",error)
      } finally{
        setLoading(false)
      }
    },[])

  return (
    <div className='flex flex-col h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">My Profile</span>
        <Link href={'/editProfile'} className="absolute right-4 text-[16px] leading-[30px] text-[#FF9F1C] text-center font-medium">Edit</Link>
      </header>

      <div className='bg-[#f8fcfd] p-4 py-6 overflow-y-scroll flex-1 no-scrollbar'>
        <div className='min-h-[120px] max-w-[800px] mx-auto bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-between gap-4 px-4'>
          <div className='h-[88px] w-[88px] flex items-center justify-center rounded-full border-[3px] border-secondary overflow-hidden'>
            {profileImage === "" ?
            <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" className='h-full w-full rounded-full p-[2px]'/>
            :
            <Image src={profileImage} alt="User" height={88} width={88} className='h-full w-full object-cover object-center rounded-full p-[2px]'/>
            }
          </div>
          <div className='flex-1 flex items-center justify-between flex-wrap space-y-2'>
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
              <Link className='font-medium text-[10px] leading-[15px] text-[#E10101] flex items-center justify-center ' href={'/points-history'}>POINTS HISTORY {rightArrowIcon}</Link>
            </div>
            <div className='flex flex-col items-center justify-center text-[10px] leading-[15px] font-normal text-[#111111]'>
              {yellowBadgeIcon}
              Gold User
            </div>
          </div>
        </div>

        <div className='max-w-[600px] mx-auto mt-8 mb-4 px-4'>
          <div
            className="h-[5px] w-full rounded-full bg-gradient-to-r mt-5 flex items-center justify-between"
            style={{
              background: `linear-gradient(to right, #2EC458 ${progressBarWidth[progressBarStep]}%, #D4D3D8 ${progressBarWidth[progressBarStep]}%)`
            }}
          >
            <div className={`${progressBarStep >= 1 ? "" : ""} relative flex items-center justify-center rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              {progressBarStep >= 1 ? greenBgTickIcon : <span className='h-[23px] w-[23px] rounded-full bg-[#D9D9D9]'></span>}
            </div>
            <div className={`${progressBarStep >= 2 ? "" : ""} relative flex items-center justify-center rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              {progressBarStep >= 2 ? greenBgTickIcon : <span className='h-[23px] w-[23px] rounded-full bg-[#D9D9D9]'></span>}
            </div>
            <div className={`${progressBarStep >= 3 ? "" : ""} relative flex items-center justify-center rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              {progressBarStep >= 3 ? greenBgTickIcon : <span className='h-[23px] w-[23px] rounded-full bg-[#D9D9D9]'></span>}
            </div>
          </div>

        </div>

        <div className='flex flex-row items-center justify-center flex-wrap gap-4 py-6'>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='h-[98px] w-[108px] rounded-md flex flex-col items-center justify-center gap-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
              {bronzeBadgeIcon}
              <span className='font-semibold text-[14px] leading-[21px] text-[#111111]'>Bronze</span>
            </div>
            <span className='font-semibold text-[12px] leading-[18px] text-[#999999]'>100 PTS</span>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='h-[98px] w-[108px] rounded-md flex flex-col items-center justify-center gap-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
              {yellowBadgeIcon}
              <span className='font-semibold text-[14px] leading-[21px] text-[#111111]'>Gold</span>
            </div>
            <span className='font-semibold text-[12px] leading-[18px] text-[#999999]'> &gt;800 PTS</span>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='h-[98px] w-[108px] rounded-md flex flex-col items-center justify-center gap-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
              {diamongBadgeIcon}
              <span className='font-semibold text-[14px] leading-[21px] text-[#111111]'>Platinum</span>
            </div>
            <span className='font-semibold text-[12px] leading-[18px] text-[#999999]'>&gt;1500 PTS</span>
          </div>
        </div>

        <div className='max-w-[800px] mx-auto'>
          <span className='text-[14px] leading-[20px] font-semibold text-[#111111]'>Professional Information</span>
        </div>

        <div className='max-w-[800px] mx-auto mt-4 bg-white p-4 space-y-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
          <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
            <span className='flex-1 min-w-[150px] font-medium text-[14px] leading-[25px] text-[#111111]'>User Name</span>
              {loading ?
              <>
              <div className='h-4 min-w-[180px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <span className='flex-1 min-w-[180px] font-normal text-[12px] leading-[18px] text-[#777777]'>{userName}</span>
              </>              
              }
          </div>

          <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
            <span className='flex-1 min-w-[150px] font-medium text-[14px] leading-[25px] text-[#111111]'>User Id</span>
              {loading ?
              <>
              <div className='h-4 min-w-[180px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <span className='flex-1 min-w-[180px] font-normal text-[12px] leading-[18px] text-[#777777]'>{userId}</span>
              </>              
              }
          </div>

          <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
            <span className='flex-1 min-w-[150px] font-medium text-[14px] leading-[25px] text-[#111111]'>Self Introduction</span>
              {loading ?
              <>
              <div className='h-4 min-w-[180px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <span className='flex-1 min-w-[180px] font-normal text-[12px] leading-[18px] text-[#777777]'>{intro}</span>
              </>              
              }
          </div>

          <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
            <span className='flex-1 min-w-[150px] font-medium text-[14px] leading-[25px] text-[#111111]'>Main area</span>
              {loading ?
              <>
              <div className='h-4 min-w-[180px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <span className='flex-1 min-w-[180px] font-normal text-[12px] leading-[18px] text-[#777777]'>{location}</span>
              </>              
              }
          </div>

          <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
            <span className='flex-1 min-w-[150px] font-medium text-[14px] leading-[25px] text-[#111111]'>Genre of expertise</span>
              {loading ?
              <>
              <div className='h-4 min-w-[180px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <span className='flex-1 min-w-[180px] font-normal text-[12px] leading-[18px] text-[#777777]'>{genre}</span>
              </>              
              }
          </div>

          <div className='flex flex-row gap-4 flex-wrap items-start justify-between'>
            <span className='flex-1 min-w-[150px] font-medium text-[14px] leading-[25px] text-[#111111]'>Achievements</span>
              {loading ?
              <>
              <div className='h-4 min-w-[180px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <div className='flex-1 min-w-[180px]'>
                {
                  achievements.map((achievement,index)=>{
                    return(
                      <span key={index}><span className='flex-1 min-w-[180px] font-normal text-[12px] leading-[18px] text-[#777777]'>{achievement}</span><br></br></span>
                    )
                  })
                }
              </div>
              </>              
              }
          </div>

          <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
            <span className='flex-1 min-w-[150px] font-medium text-[14px] leading-[25px] text-[#111111]'>Shooting price per hours</span>
              {loading ?
              <>
              <div className='h-4 min-w-[180px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
              </>:
              <>
              <span className='flex-1 min-w-[180px] font-normal text-[12px] leading-[18px] text-[#777777]'>{shootingPrice}</span>
              </>              
              }
          </div>
        </div>
      </div>

    </div>
  )
}

export default Profile


const yellowBadgeIcon = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8611 0.342165C15.5486 -0.114055 16.4485 -0.114055 17.136 0.342165L18.2484 1.07337C18.6234 1.3171 19.0608 1.43584 19.5045 1.41084L20.8357 1.3296C21.6607 1.2796 22.4356 1.72957 22.8043 2.46702L23.4043 3.66069C23.6043 4.06067 23.9293 4.3794 24.323 4.57938L25.5291 5.18559C26.2666 5.55432 26.7166 6.32927 26.6666 7.15421L26.5853 8.48537C26.5603 8.92909 26.6791 9.37281 26.9228 9.74154L27.6603 10.854C28.1165 11.5414 28.1165 12.4414 27.6603 13.1288L26.9228 14.2475C26.6791 14.6225 26.5603 15.0599 26.5853 15.5037L26.6666 16.8348C26.7166 17.6598 26.2666 18.4347 25.5291 18.8034L24.3355 19.4034C23.9355 19.6034 23.6168 19.9284 23.4168 20.3221L22.8106 21.5283C22.4419 22.2657 21.6669 22.7157 20.842 22.6657L19.5108 22.5844C19.0671 22.5594 18.6234 22.6782 18.2546 22.9219L17.1422 23.6594C16.4548 24.1156 15.5548 24.1156 14.8674 23.6594L13.7487 22.9219C13.3737 22.6782 12.9362 22.5594 12.4925 22.5844L11.1614 22.6657C10.3364 22.7157 9.56146 22.2657 9.19273 21.5283L8.59277 20.3346C8.39278 19.9346 8.06781 19.6159 7.67408 19.4159L6.46791 18.8097C5.73046 18.441 5.28049 17.666 5.33049 16.8411L5.41173 15.5099C5.43673 15.0662 5.31799 14.6225 5.07425 14.2537L4.34305 13.1351C3.88683 12.4476 3.88683 11.5477 4.34305 10.8602L5.07425 9.74779C5.31799 9.37281 5.43673 8.93534 5.41173 8.49162L5.33049 7.16046C5.28049 6.33552 5.73046 5.56057 6.46791 5.19184L7.66158 4.59188C8.06156 4.38565 8.38654 4.06067 8.58652 3.66069L9.18648 2.46702C9.55521 1.72957 10.3302 1.2796 11.1551 1.3296L12.4863 1.41084C12.93 1.43584 13.3737 1.3171 13.7424 1.07337L14.8611 0.342165ZM20.9982 11.9976C20.9982 9.23532 18.7608 6.99797 15.9985 6.99797C13.2362 6.99797 10.9989 9.23532 10.9989 11.9976C10.9989 14.76 13.2362 16.9973 15.9985 16.9973C18.7608 16.9973 20.9982 14.76 20.9982 11.9976ZM4.08057 27.6091L6.77414 21.2033C6.78664 21.2095 6.79289 21.2158 6.79914 21.2283L7.3991 22.4219C8.1303 23.8718 9.64895 24.753 11.2738 24.6593L12.605 24.5781C12.6175 24.5781 12.6363 24.5781 12.6488 24.5906L13.7612 25.328C14.0799 25.5342 14.4174 25.6967 14.7674 25.8092L12.4175 31.3901C12.2738 31.7338 11.955 31.9651 11.5863 31.9963C11.2176 32.0276 10.8614 31.8588 10.6614 31.5463L8.64902 28.4653L5.143 28.984C4.78677 29.034 4.43055 28.8903 4.20556 28.609C3.98058 28.3278 3.93683 27.9403 4.07432 27.6091H4.08057ZM19.5795 31.3839L17.2297 25.8092C17.5797 25.6967 17.9172 25.5405 18.2359 25.328L19.3483 24.5906C19.3608 24.5843 19.3733 24.5781 19.3921 24.5781L20.7232 24.6593C22.3481 24.753 23.8668 23.8718 24.598 22.4219L25.1979 21.2283C25.2042 21.2158 25.2104 21.2095 25.2229 21.2033L27.9227 27.6091C28.0602 27.9403 28.0102 28.3216 27.7915 28.609C27.5728 28.8965 27.2103 29.0403 26.8541 28.984L23.348 28.4653L21.3357 31.5401C21.1357 31.8526 20.7795 32.0213 20.4107 31.9901C20.042 31.9588 19.7233 31.7213 19.5795 31.3839Z" fill="#FF9F1C"/>
</svg>

const greenBadgeIcon = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8611 0.342165C15.5486 -0.114055 16.4485 -0.114055 17.136 0.342165L18.2484 1.07337C18.6234 1.3171 19.0608 1.43584 19.5045 1.41084L20.8357 1.3296C21.6607 1.2796 22.4356 1.72957 22.8043 2.46702L23.4043 3.66069C23.6043 4.06067 23.9293 4.3794 24.323 4.57938L25.5291 5.18559C26.2666 5.55432 26.7166 6.32927 26.6666 7.15421L26.5853 8.48537C26.5603 8.92909 26.6791 9.37281 26.9228 9.74154L27.6603 10.854C28.1165 11.5414 28.1165 12.4414 27.6603 13.1288L26.9228 14.2475C26.6791 14.6225 26.5603 15.0599 26.5853 15.5037L26.6666 16.8348C26.7166 17.6598 26.2666 18.4347 25.5291 18.8034L24.3355 19.4034C23.9355 19.6034 23.6168 19.9284 23.4168 20.3221L22.8106 21.5283C22.4419 22.2657 21.6669 22.7157 20.842 22.6657L19.5108 22.5844C19.0671 22.5594 18.6234 22.6782 18.2546 22.9219L17.1422 23.6594C16.4548 24.1156 15.5548 24.1156 14.8674 23.6594L13.7487 22.9219C13.3737 22.6782 12.9362 22.5594 12.4925 22.5844L11.1614 22.6657C10.3364 22.7157 9.56146 22.2657 9.19273 21.5283L8.59277 20.3346C8.39278 19.9346 8.06781 19.6159 7.67408 19.4159L6.46791 18.8097C5.73046 18.441 5.28049 17.666 5.33049 16.8411L5.41173 15.5099C5.43673 15.0662 5.31799 14.6225 5.07425 14.2537L4.34305 13.1351C3.88683 12.4476 3.88683 11.5477 4.34305 10.8602L5.07425 9.74779C5.31799 9.37281 5.43673 8.93534 5.41173 8.49162L5.33049 7.16046C5.28049 6.33552 5.73046 5.56057 6.46791 5.19184L7.66158 4.59188C8.06156 4.38565 8.38654 4.06067 8.58652 3.66069L9.18648 2.46702C9.55521 1.72957 10.3302 1.2796 11.1551 1.3296L12.4863 1.41084C12.93 1.43584 13.3737 1.3171 13.7424 1.07337L14.8611 0.342165ZM20.9982 11.9976C20.9982 9.23532 18.7608 6.99797 15.9985 6.99797C13.2362 6.99797 10.9989 9.23532 10.9989 11.9976C10.9989 14.76 13.2362 16.9973 15.9985 16.9973C18.7608 16.9973 20.9982 14.76 20.9982 11.9976ZM4.08057 27.6091L6.77414 21.2033C6.78664 21.2095 6.79289 21.2158 6.79914 21.2283L7.3991 22.4219C8.1303 23.8718 9.64895 24.753 11.2738 24.6593L12.605 24.5781C12.6175 24.5781 12.6363 24.5781 12.6488 24.5906L13.7612 25.328C14.0799 25.5342 14.4174 25.6967 14.7674 25.8092L12.4175 31.3901C12.2738 31.7338 11.955 31.9651 11.5863 31.9963C11.2176 32.0276 10.8614 31.8588 10.6614 31.5463L8.64902 28.4653L5.143 28.984C4.78677 29.034 4.43055 28.8903 4.20556 28.609C3.98058 28.3278 3.93683 27.9403 4.07432 27.6091H4.08057ZM19.5795 31.3839L17.2297 25.8092C17.5797 25.6967 17.9172 25.5405 18.2359 25.328L19.3483 24.5906C19.3608 24.5843 19.3733 24.5781 19.3921 24.5781L20.7232 24.6593C22.3481 24.753 23.8668 23.8718 24.598 22.4219L25.1979 21.2283C25.2042 21.2158 25.2104 21.2095 25.2229 21.2033L27.9227 27.6091C28.0602 27.9403 28.0102 28.3216 27.7915 28.609C27.5728 28.8965 27.2103 29.0403 26.8541 28.984L23.348 28.4653L21.3357 31.5401C21.1357 31.8526 20.7795 32.0213 20.4107 31.9901C20.042 31.9588 19.7233 31.7213 19.5795 31.3839Z" fill="#2EC4B6"/>
</svg>

const bronzeBadgeIcon = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8611 0.342165C15.5486 -0.114055 16.4485 -0.114055 17.136 0.342165L18.2484 1.07337C18.6234 1.3171 19.0608 1.43584 19.5045 1.41084L20.8357 1.3296C21.6607 1.2796 22.4356 1.72957 22.8043 2.46702L23.4043 3.66069C23.6043 4.06067 23.9293 4.3794 24.323 4.57938L25.5291 5.18559C26.2666 5.55432 26.7166 6.32927 26.6666 7.15421L26.5853 8.48537C26.5603 8.92909 26.6791 9.37281 26.9228 9.74154L27.6603 10.854C28.1165 11.5414 28.1165 12.4414 27.6603 13.1288L26.9228 14.2475C26.6791 14.6225 26.5603 15.0599 26.5853 15.5037L26.6666 16.8348C26.7166 17.6598 26.2666 18.4347 25.5291 18.8034L24.3355 19.4034C23.9355 19.6034 23.6168 19.9284 23.4168 20.3221L22.8106 21.5283C22.4419 22.2657 21.6669 22.7157 20.842 22.6657L19.5108 22.5844C19.0671 22.5594 18.6234 22.6782 18.2546 22.9219L17.1422 23.6594C16.4548 24.1156 15.5548 24.1156 14.8674 23.6594L13.7487 22.9219C13.3737 22.6782 12.9362 22.5594 12.4925 22.5844L11.1614 22.6657C10.3364 22.7157 9.56146 22.2657 9.19273 21.5283L8.59277 20.3346C8.39278 19.9346 8.06781 19.6159 7.67408 19.4159L6.46791 18.8097C5.73046 18.441 5.28049 17.666 5.33049 16.8411L5.41173 15.5099C5.43673 15.0662 5.31799 14.6225 5.07425 14.2537L4.34305 13.1351C3.88683 12.4476 3.88683 11.5477 4.34305 10.8602L5.07425 9.74779C5.31799 9.37281 5.43673 8.93534 5.41173 8.49162L5.33049 7.16046C5.28049 6.33552 5.73046 5.56057 6.46791 5.19184L7.66158 4.59188C8.06156 4.38565 8.38654 4.06067 8.58652 3.66069L9.18648 2.46702C9.55521 1.72957 10.3302 1.2796 11.1551 1.3296L12.4863 1.41084C12.93 1.43584 13.3737 1.3171 13.7424 1.07337L14.8611 0.342165ZM20.9982 11.9976C20.9982 9.23532 18.7608 6.99797 15.9985 6.99797C13.2362 6.99797 10.9989 9.23532 10.9989 11.9976C10.9989 14.76 13.2362 16.9973 15.9985 16.9973C18.7608 16.9973 20.9982 14.76 20.9982 11.9976ZM4.08057 27.6091L6.77414 21.2033C6.78664 21.2095 6.79289 21.2158 6.79914 21.2283L7.3991 22.4219C8.1303 23.8718 9.64895 24.753 11.2738 24.6593L12.605 24.5781C12.6175 24.5781 12.6363 24.5781 12.6488 24.5906L13.7612 25.328C14.0799 25.5342 14.4174 25.6967 14.7674 25.8092L12.4175 31.3901C12.2738 31.7338 11.955 31.9651 11.5863 31.9963C11.2176 32.0276 10.8614 31.8588 10.6614 31.5463L8.64902 28.4653L5.143 28.984C4.78677 29.034 4.43055 28.8903 4.20556 28.609C3.98058 28.3278 3.93683 27.9403 4.07432 27.6091H4.08057ZM19.5795 31.3839L17.2297 25.8092C17.5797 25.6967 17.9172 25.5405 18.2359 25.328L19.3483 24.5906C19.3608 24.5843 19.3733 24.5781 19.3921 24.5781L20.7232 24.6593C22.3481 24.753 23.8668 23.8718 24.598 22.4219L25.1979 21.2283C25.2042 21.2158 25.2104 21.2095 25.2229 21.2033L27.9227 27.6091C28.0602 27.9403 28.0102 28.3216 27.7915 28.609C27.5728 28.8965 27.2103 29.0403 26.8541 28.984L23.348 28.4653L21.3357 31.5401C21.1357 31.8526 20.7795 32.0213 20.4107 31.9901C20.042 31.9588 19.7233 31.7213 19.5795 31.3839Z" fill="#C05F3E"/>
</svg>

const silverBadgeIcon = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8611 0.342165C15.5486 -0.114055 16.4485 -0.114055 17.136 0.342165L18.2484 1.07337C18.6234 1.3171 19.0608 1.43584 19.5045 1.41084L20.8357 1.3296C21.6607 1.2796 22.4356 1.72957 22.8043 2.46702L23.4043 3.66069C23.6043 4.06067 23.9293 4.3794 24.323 4.57938L25.5291 5.18559C26.2666 5.55432 26.7166 6.32927 26.6666 7.15421L26.5853 8.48537C26.5603 8.92909 26.6791 9.37281 26.9228 9.74154L27.6603 10.854C28.1165 11.5414 28.1165 12.4414 27.6603 13.1288L26.9228 14.2475C26.6791 14.6225 26.5603 15.0599 26.5853 15.5037L26.6666 16.8348C26.7166 17.6598 26.2666 18.4347 25.5291 18.8034L24.3355 19.4034C23.9355 19.6034 23.6168 19.9284 23.4168 20.3221L22.8106 21.5283C22.4419 22.2657 21.6669 22.7157 20.842 22.6657L19.5108 22.5844C19.0671 22.5594 18.6234 22.6782 18.2546 22.9219L17.1422 23.6594C16.4548 24.1156 15.5548 24.1156 14.8674 23.6594L13.7487 22.9219C13.3737 22.6782 12.9362 22.5594 12.4925 22.5844L11.1614 22.6657C10.3364 22.7157 9.56146 22.2657 9.19273 21.5283L8.59277 20.3346C8.39278 19.9346 8.06781 19.6159 7.67408 19.4159L6.46791 18.8097C5.73046 18.441 5.28049 17.666 5.33049 16.8411L5.41173 15.5099C5.43673 15.0662 5.31799 14.6225 5.07425 14.2537L4.34305 13.1351C3.88683 12.4476 3.88683 11.5477 4.34305 10.8602L5.07425 9.74779C5.31799 9.37281 5.43673 8.93534 5.41173 8.49162L5.33049 7.16046C5.28049 6.33552 5.73046 5.56057 6.46791 5.19184L7.66158 4.59188C8.06156 4.38565 8.38654 4.06067 8.58652 3.66069L9.18648 2.46702C9.55521 1.72957 10.3302 1.2796 11.1551 1.3296L12.4863 1.41084C12.93 1.43584 13.3737 1.3171 13.7424 1.07337L14.8611 0.342165ZM20.9982 11.9976C20.9982 9.23532 18.7608 6.99797 15.9985 6.99797C13.2362 6.99797 10.9989 9.23532 10.9989 11.9976C10.9989 14.76 13.2362 16.9973 15.9985 16.9973C18.7608 16.9973 20.9982 14.76 20.9982 11.9976ZM4.08057 27.6091L6.77414 21.2033C6.78664 21.2095 6.79289 21.2158 6.79914 21.2283L7.3991 22.4219C8.1303 23.8718 9.64895 24.753 11.2738 24.6593L12.605 24.5781C12.6175 24.5781 12.6363 24.5781 12.6488 24.5906L13.7612 25.328C14.0799 25.5342 14.4174 25.6967 14.7674 25.8092L12.4175 31.3901C12.2738 31.7338 11.955 31.9651 11.5863 31.9963C11.2176 32.0276 10.8614 31.8588 10.6614 31.5463L8.64902 28.4653L5.143 28.984C4.78677 29.034 4.43055 28.8903 4.20556 28.609C3.98058 28.3278 3.93683 27.9403 4.07432 27.6091H4.08057ZM19.5795 31.3839L17.2297 25.8092C17.5797 25.6967 17.9172 25.5405 18.2359 25.328L19.3483 24.5906C19.3608 24.5843 19.3733 24.5781 19.3921 24.5781L20.7232 24.6593C22.3481 24.753 23.8668 23.8718 24.598 22.4219L25.1979 21.2283C25.2042 21.2158 25.2104 21.2095 25.2229 21.2033L27.9227 27.6091C28.0602 27.9403 28.0102 28.3216 27.7915 28.609C27.5728 28.8965 27.2103 29.0403 26.8541 28.984L23.348 28.4653L21.3357 31.5401C21.1357 31.8526 20.7795 32.0213 20.4107 31.9901C20.042 31.9588 19.7233 31.7213 19.5795 31.3839Z" fill="#929395"/>
</svg>

const diamongBadgeIcon = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8611 0.342165C15.5486 -0.114055 16.4485 -0.114055 17.136 0.342165L18.2484 1.07337C18.6234 1.3171 19.0608 1.43584 19.5045 1.41084L20.8357 1.3296C21.6607 1.2796 22.4356 1.72957 22.8043 2.46702L23.4043 3.66069C23.6043 4.06067 23.9293 4.3794 24.323 4.57938L25.5291 5.18559C26.2666 5.55432 26.7166 6.32927 26.6666 7.15421L26.5853 8.48537C26.5603 8.92909 26.6791 9.37281 26.9228 9.74154L27.6603 10.854C28.1165 11.5414 28.1165 12.4414 27.6603 13.1288L26.9228 14.2475C26.6791 14.6225 26.5603 15.0599 26.5853 15.5037L26.6666 16.8348C26.7166 17.6598 26.2666 18.4347 25.5291 18.8034L24.3355 19.4034C23.9355 19.6034 23.6168 19.9284 23.4168 20.3221L22.8106 21.5283C22.4419 22.2657 21.6669 22.7157 20.842 22.6657L19.5108 22.5844C19.0671 22.5594 18.6234 22.6782 18.2546 22.9219L17.1422 23.6594C16.4548 24.1156 15.5548 24.1156 14.8674 23.6594L13.7487 22.9219C13.3737 22.6782 12.9362 22.5594 12.4925 22.5844L11.1614 22.6657C10.3364 22.7157 9.56146 22.2657 9.19273 21.5283L8.59277 20.3346C8.39278 19.9346 8.06781 19.6159 7.67408 19.4159L6.46791 18.8097C5.73046 18.441 5.28049 17.666 5.33049 16.8411L5.41173 15.5099C5.43673 15.0662 5.31799 14.6225 5.07425 14.2537L4.34305 13.1351C3.88683 12.4476 3.88683 11.5477 4.34305 10.8602L5.07425 9.74779C5.31799 9.37281 5.43673 8.93534 5.41173 8.49162L5.33049 7.16046C5.28049 6.33552 5.73046 5.56057 6.46791 5.19184L7.66158 4.59188C8.06156 4.38565 8.38654 4.06067 8.58652 3.66069L9.18648 2.46702C9.55521 1.72957 10.3302 1.2796 11.1551 1.3296L12.4863 1.41084C12.93 1.43584 13.3737 1.3171 13.7424 1.07337L14.8611 0.342165ZM20.9982 11.9976C20.9982 9.23532 18.7608 6.99797 15.9985 6.99797C13.2362 6.99797 10.9989 9.23532 10.9989 11.9976C10.9989 14.76 13.2362 16.9973 15.9985 16.9973C18.7608 16.9973 20.9982 14.76 20.9982 11.9976ZM4.08057 27.6091L6.77414 21.2033C6.78664 21.2095 6.79289 21.2158 6.79914 21.2283L7.3991 22.4219C8.1303 23.8718 9.64895 24.753 11.2738 24.6593L12.605 24.5781C12.6175 24.5781 12.6363 24.5781 12.6488 24.5906L13.7612 25.328C14.0799 25.5342 14.4174 25.6967 14.7674 25.8092L12.4175 31.3901C12.2738 31.7338 11.955 31.9651 11.5863 31.9963C11.2176 32.0276 10.8614 31.8588 10.6614 31.5463L8.64902 28.4653L5.143 28.984C4.78677 29.034 4.43055 28.8903 4.20556 28.609C3.98058 28.3278 3.93683 27.9403 4.07432 27.6091H4.08057ZM19.5795 31.3839L17.2297 25.8092C17.5797 25.6967 17.9172 25.5405 18.2359 25.328L19.3483 24.5906C19.3608 24.5843 19.3733 24.5781 19.3921 24.5781L20.7232 24.6593C22.3481 24.753 23.8668 23.8718 24.598 22.4219L25.1979 21.2283C25.2042 21.2158 25.2104 21.2095 25.2229 21.2033L27.9227 27.6091C28.0602 27.9403 28.0102 28.3216 27.7915 28.609C27.5728 28.8965 27.2103 29.0403 26.8541 28.984L23.348 28.4653L21.3357 31.5401C21.1357 31.8526 20.7795 32.0213 20.4107 31.9901C20.042 31.9588 19.7233 31.7213 19.5795 31.3839Z" fill="#71A5EC"/>
</svg>

const rightArrowIcon = <svg width="15" height="15" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.25 7.5L14.75 12L10.25 16.5" stroke="#E10101" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

const greenBgTickIcon = <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="11.5" r="11" fill="#2EC458" stroke="#2EC458"/>
<path d="M7.78033 11.9416C7.48744 11.6487 7.01256 11.6487 6.71967 11.9416C6.42678 12.2345 6.42678 12.7094 6.71967 13.0023L9.44202 15.7246C9.73492 16.0175 10.2098 16.0175 10.5027 15.7246L16.947 9.28033C17.2399 8.98744 17.2399 8.51256 16.947 8.21967C16.6541 7.92678 16.1792 7.92678 15.8863 8.21967L9.97235 14.1337L7.78033 11.9416Z" fill="white"/>
</svg>
