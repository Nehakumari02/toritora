"use client"
import { backIcon } from '@/constants/icons';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import { useToast } from '@/hooks/use-toast';
import { Gallery } from '@/components/common/gallery';
import { useLogout } from '@/lib/logout';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfDay,
  startOfToday,
} from 'date-fns'
import { ja, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils'
import UserDetailsSkeleton from '@/components/skeleton/userDetailsSkeleton';
import BookingSlot from '@/components/common/bookingSlot';
import { addRequest } from '@/lib/requestHandler';
import { useLocale, useTranslations } from 'next-intl'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DialogTitle } from '@radix-ui/react-dialog';

interface SlotProps {
  _id: string;
  user_id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function UserDetails() {
  const router = useRouter();
  const locale = useLocale();
  const logout = useLogout();
  const { toast } = useToast();
  const [profession, setProfession] = useState("modelling");
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isToritaiSent, setIsToritaiSent] = useState(true);
  const [loadingSlotBooking, setLoadingSlotBooking] = useState(false);
  const userId = searchParams.get("userId");
  const [user, setUser] = useState<any | null>(null);
  const [selectedMode, setSelectedMode] = useState(0);
  const [slots, setSlots] = useState<SlotProps[]>([]);
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [favButtonDisabled, setFavButtonDisabled] = useState(false);

  const userIdRef = useRef<null | string>(null);
  const hasModeChanged = useRef(false);


  const t = useTranslations('MyPage.editProfile');

  // Calendar states
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  let [previousMonthDisabled, setPreviousMonthDisabled] = useState(true)

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  const leftIcon = <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.7163 17.75L11.0185 13.3132L15.7163 8.87637"
      stroke={previousMonthDisabled ? "#999999" : "#2EC4B6"}
      strokeWidth="2.08791" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

  const rightIcon = <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.2495 17.75L14.9473 13.3132L10.2495 8.87637" stroke="#2EC4B6" strokeWidth="2.08791" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  const fetchUserSlots = async () => {
    const date = parse(currentMonth, "MMM-yyyy", new Date());
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const res_slots = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/slot?user_id=${userIdRef.current}&month=${month}&year=${year}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });

    const data_slots = await res_slots.json();

    setSlots(data_slots.slots)
    console.log(data_slots)
  }

  const handleSlotBooking = async (slot: SlotProps) => {
    try {
      setLoadingSlotBooking(true);
      const data = await addRequest(slot?._id, logout, slot);
      console.log("Booking request sent:", data);
      if (data.status === 201) {
        setSlots((prevSlots) =>
          prevSlots.map((s) =>
            s._id === slot._id ? { ...s, status: "pending" } : s
          )
        );
        toast({
          title: "Success",
          description: `${data?.message}`,
          variant: "success"
        })
      } else {
        toast({
          title: "Error",
          description: `${data?.message}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error in booking slot:", error);
      toast({
        title: "Server internal error",
        description: `Error: ${error}`,
        variant: "destructive"
      })
    } finally {
      setLoadingSlotBooking(false);
    }
  }

  const handleFavourite = async () => {
    try {
      setFavButtonDisabled(true);
      let res, data;
      if (isFavourite) {
        res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({ f_user_id: user._id }),
        });
        data = await res.json();
      }
      else {
        res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({ f_user_id: user._id }),
        });
        data = await res.json();
      }

      if (res.status === 201) {
        setIsFavourite(!isFavourite);
        toast({
          title: "Success",
          description: `${data?.message}`,
          variant: "success"
        })
      } else if (res.status === 401) {
        toast({
          title: "Error",
          description: "unauthorized",
          variant: "destructive"
        })
        logout();
      } else {
        toast({
          title: "Error",
          description: `${data?.message}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error in booking slot:", error);
      toast({
        title: "Server internal error",
        description: `Error: ${error}`,
        variant: "destructive"
      })
    } finally {
      setFavButtonDisabled(false);
      setIsOptionMenuOpen(false);
    }
  }

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/data/user?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });

        const data = await res.json();

        if (res.status === 200) {
          setUser(data?.user);
          console.log(data)
          setProfession(data?.user?.profession)
          setIsToritaiSent(data?.isToritaiSent || false)
          userIdRef.current = data?.user?._id
          setIsFavourite(data?.isFavourite)
        }
        else if (res.status === 401) {
          toast({
            title: "Error",
            description: "Unauthorized request",
            variant: "destructive"
          })
          logout();
        }
        else {
          toast({
            title: "Internal server error",
            description: `Error: ${data.message}`,
            variant: "destructive"
          })
        }

      }

      fetchUser();


    } catch (error) {
      console.log("Error", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const todayMonth = format(today, 'MMM-yyyy');
    const isSameMonth = currentMonth === todayMonth;
    setPreviousMonthDisabled(isSameMonth);
  }, [today, currentMonth]);

  useEffect(() => {
    if (!hasModeChanged.current) {
      return;
    }

    fetchUserSlots();
  }, [currentMonth]);

  useEffect(() => {
    if (!hasModeChanged.current) {
      if (selectedMode === 0)
        return
      hasModeChanged.current = true;
      fetchUserSlots();
    }
  }, [selectedMode]);

  return (
    <div className='no-scrollbar flex flex-col h-full'>
      <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{profession === "modelling" ? t("modelDetails") : t("photographerDetail")}</span>
        <button onClick={() => { setIsOptionMenuOpen(!isOptionMenuOpen) }} className='absolute top-[50%] translate-y-[-50%] right-4'>{threeDotsIcon}</button>
      </header>

      <div className='bg-primary-foreground my-4'>
        <div className='max-w-[800px] mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-center gap-[8px] transition-all duration-300'>
          <button onClick={() => setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>{t("profile")}</button>
          <button onClick={() => setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>{t("calendar")}</button>
        </div>
      </div>

      <div className='overflow-y-scroll flex-1 no-scrollbar'>

        <div className={`${selectedMode === 0 ? "" : "hidden"} h-full pb-4`}>

          {/* Model profile view */}
          <div className={`${profession === "modelling" ? "" : "hidden"} max-w-[800px] md:mx-auto my-4 mx-2`}>

            {/* Profile image */}
            <div className='md:flex md:items-center md:justify-center my-8'>
              <div className='flex items-center justify-center md:w-[50%]'>
                <div className='h-[calc(min(100%,380px))] w-[calc(min(100%,380px))] flex items-center justify-center overflow-hidden aspect-square'>
                  {loading || user?.profilePicture === "" ?
                    <div className='w-full h-full md:h-[380px] md:w-[380px] rounded-md bg-gray-200 animate-pulse'></div>
                    :
                    (user?.profilePicture ? <Image src={user?.profilePicture} alt="User" height={380} width={380} className='h-full w-full rounded-md animate-in object-cover object-center' /> : <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" height={380} width={380} className='h-full w-full' />)
                  }
                </div>
              </div>

              <div className='md:w-[50%] md:h-[380px] md:p-4 p-2 flex items-center justify-between'>
                <div className={`${loading ? "animate-pulse" : ""} bg-primary px-6 py-2 rounded-full`}>
                  {loading ? <div className='h-6 w-20'></div> : <span className='h-6 w-20 flex items-center justify-center gap-2 font-medium text-[14px] leading-[25px] text-white'>{badgeIcon} {t("visitor")}</span>}
                </div>
                <div className='flex flex-col items-end justify-center md:space-y-2'>
                  {loading ? <>
                    <div className='h-4 w-24 rounded-md bg-gray-200 animate-pulse'></div>
                    <div className='h-4 w-20 rounded-md bg-gray-200 animate-pulse'></div>
                  </> :
                    <>
                      <span className='font-medium text-[14px] leading-[25px] text-[#111111]'>{user?.firstName} {user?.lastName}</span>
                      <span className='font-normal text-[12px] leading-[25px] text-primary'>{user?.username}</span>
                    </>}
                </div>
              </div>
            </div>

            {/* Model details section */}
            <div className='max-w-[800px] mx-auto mt-4 bg-white p-4 space-y-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("userName")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.username}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("userId")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.userId}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("selfIntroduction")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.selfIntroduction}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("address")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.address}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("genres")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.genres}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-start justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("achievements")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <div className='flex-1 min-w-[140px]'>
                      {
                        user?.achievements?.map((achievement: any, index: number) => {
                          return (
                            <span key={index}><span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{achievement}</span><br></br></span>
                          )
                        })
                      }
                    </div>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("shootingPrice")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.shootingPrice}</span>
                  </>
                }
              </div>

              {user?.snsUsername && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("snsUsername")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.snsUsername}</span>
                  </>
                }
              </div>}

              {user?.instagram && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("instagram")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.instagram}</span>
                  </>
                }
              </div>}

              {user?.twitter && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("twitter")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.twitter}</span>
                  </>
                }
              </div>}
            </div>

            {/* Gallery */}
            <div className='mt-8 mb-4'>
              <div className='max-w-[800px] mx-auto'>
                <span className='text-[14px] leading-[20px] font-semibold text-[#111111]'>{t("gallery")}</span>
              </div>
            </div>
            <div>
              <Gallery images={user?.images} loading={loading} />
            </div>

          </div>

          {/* Photographer profile view */}
          <div className={`${profession === "photographer" ? "" : "hidden"} max-w-[800px] md:mx-auto my-4 mx-2`}>

            {/* Profile image */}
            <div className='md:flex md:items-center md:justify-center my-8'>
              <div className='flex items-center justify-center md:w-[50%]'>
                <div className='h-[calc(min(100%,380px))] w-[calc(min(100%,380px))] flex items-center justify-center overflow-hidden aspect-square'>
                  {loading || user?.profilePicture === "" ?
                    <div className='w-full h-full md:h-[380px] md:w-[380px] rounded-md bg-gray-200 animate-pulse'></div>
                    :
                    (user?.profilePicture ? <Image src={user?.profilePicture} alt="User" height={380} width={380} className='h-full w-full rounded-md animate-in object-cover object-center' /> : <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" height={380} width={380} className='h-full w-full' />)
                  }
                </div>
              </div>

              <div className='md:w-[50%] md:h-[380px] p-4 flex items-center justify-between'>
                <div className={`${loading ? "animate-pulse" : ""} bg-primary px-6 py-2 rounded-full`}>
                  {loading ? <div className='h-6 w-20'></div> : <span className='h-6 w-20 flex items-center justify-center gap-2 font-medium text-[14px] leading-[25px] text-white'>{badgeIcon} {t("visitor")}</span>}
                </div>
                <div className='flex flex-col items-end justify-center space-y-2'>
                  {loading ? <>
                    <div className='h-4 w-24 rounded-md bg-gray-200 animate-pulse'></div>
                    <div className='h-4 w-20 rounded-md bg-gray-200 animate-pulse'></div>
                  </> :
                    <>
                      <span className='font-medium text-[14px] leading-[25px] text-[#111111]'>{user?.firstName} {user?.lastName}</span>
                      <span className='font-normal text-[12px] leading-[25px] text-primary'>{user?.username}</span>
                    </>}
                </div>
              </div>
            </div>

            {/* Photographer details section */}
            <div className='max-w-[800px] mx-auto mt-4 bg-white p-4 space-y-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("userName")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.username}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("cameraType")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.cameraType}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("photographyExperience")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.photographyExperience}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("mainArea")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.address}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("genres")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.genres}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-start justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("achievements")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <div className='flex-1 min-w-[140px]'>
                      {
                        user?.achievements?.map((achievement: any, index: number) => {
                          return (
                            <span key={index}><span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{achievement}</span><br></br></span>
                          )
                        })
                      }
                    </div>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("shootingPrice")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.shootingPrice}</span>
                  </>
                }
              </div>

              <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("transportationFee")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.transportationFee}</span>
                  </>
                }
              </div>

              {user?.snsUsername && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("snsUsername")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.snsUsername}</span>
                  </>
                }
              </div>}

              {user?.instagram && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("instagram")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.instagram}</span>
                  </>
                }
              </div>}

              {user?.twitter && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
                <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("twitter")}</span>
                {loading ?
                  <>
                    <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                  </> :
                  <>
                    <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.twitter}</span>
                  </>
                }
              </div>}
            </div>

            {/* Gallery */}
            <div className='mt-8 mb-4'>
              <div className='max-w-[800px] mx-auto'>
                <span className='text-[14px] leading-[20px] font-semibold text-[#111111]'>{t("gallery")}</span>
              </div>
            </div>
            <div>
              <Gallery images={user?.images} loading={loading} />
            </div>

          </div>

        </div>

        <div className={`${selectedMode === 1 ? "" : "hidden"} h-full pb-4`}>
          <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
            <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
              <div className="md:pr-14">
                <div className="flex items-center">
                  <h2 className="flex-auto font-semibold text-gray-900">
                    {format(firstDayCurrentMonth, locale === 'jn' ?  'yyyy年M月' : 'MMMM yyyy' , { locale: locale === 'jn' ? ja : enUS })}
                  </h2>
                  <button
                    type="button"
                    onClick={previousMonth}
                    disabled={previousMonthDisabled}
                    className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">{t("previousMonth")}</span>
                    {leftIcon}
                  </button>
                  <button
                    onClick={nextMonth}
                    type="button"
                    className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">{t("nextMonth")}</span>
                    {rightIcon}
                  </button>
                </div>
                <div className="grid grid-cols-7 mt-10 font-semibold text-center text-[15px] leading-[25px] text-[#111111]">
                  <div>{t("Su")}</div>
                  <div>{t("Mo")}</div>
                  <div>{t("Tu")}</div>
                  <div>{t("We")}</div>
                  <div>{t("Th")}</div>
                  <div>{t("Fr")}</div>
                  <div>{t("Sa")}</div>
                </div>
                <div className="grid grid-cols-7 mt-2 text-sm">
                  {days.map((day, dayIdx) => (
                    <div
                      key={day.toString()}
                      className={cn(
                        dayIdx === 0 && colStartClasses[getDay(day)],
                        'py-1'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        // disabled={getDay(day) === 0 || isBefore(day, startOfDay(new Date()))}
                        className={cn(
                          isEqual(day, selectedDay) && 'text-white',
                          isEqual(day, selectedDay) && isToday(day) && 'text-secondary',
                          !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          'text-secondary',
                          !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          'text-gray-900',
                          getDay(day) === 0 && 'text-[#999999]',
                          isBefore(day, startOfDay(new Date())) && 'text-[#999999]',
                          isEqual(day, selectedDay) && 'text-white',
                          isEqual(day, selectedDay) && isToday(day) && 'text-secondary',
                          !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          'text-gray-400',
                          isEqual(day, selectedDay) && isToday(day) && 'bg-[#CBF3F0]',
                          isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          'bg-secondary',
                          // !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                          (isEqual(day, selectedDay) || isToday(day)) &&
                          'font-semibold',
                          'mx-auto flex h-8 md:h-10 w-8 md:w-14 items-center justify-center rounded-full font-semibold text-center text-[15px] transition-all duration-300'
                        )}
                      >
                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                          {format(day, 'd')}
                        </time>
                      </button>

                      <div className="w-1 h-1 mx-auto mt-1">
                        {slots.some((slot) =>
                          isSameDay(parseISO(slot?.date), day)
                        ) && (
                            <div className="w-1 h-1 rounded-full bg-secondary"></div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex items-center justify-center pb-4 md:hidden'>
                  <div className='h-1 w-8 rounded-full bg-[#E8E8E8]'></div>
                </div>
              </div>

              <div className=''>
                <section className="mt-6 md:mt-0 md:pl-4">
                  <h2 className="font-semibold text-gray-900 pl-4">
                    {t("slotsFor")} {' '}
                    {format(selectedDay, locale === 'jn' ?  'yyyy年M月d日' : 'MMM dd, yyyy' , { locale: locale === 'jn' ? ja : enUS })}
                  </h2>
                  <ol className="mt-4 space-y-3 text-sm leading-6 text-gray-500 md:overflow-y-scroll md:h-[40vh] md:no-scrollbar">
                    {slots.length > 0 ? (
                      slots
                        .filter((slot) => {
                          const slotDate = new Date(slot.date).toDateString();
                          const selectedDate = selectedDay.toDateString();
                          return slotDate === selectedDate;
                        })
                        .map((slot, index) => (
                          <BookingSlot handleSlotBooking={handleSlotBooking} user={{ name: user?.firstName + " " + user?.lastName, _id: user?._id, shootingPrice: user?.shootingPrice, profileImage: user?.profilePicture }} slot={slot} index={index} key={index} />
                        ))
                    ) : (
                      <p>{t("noSlots")}</p>
                    )}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center gap-6 md:max-w-[800px] w-full md:mx-auto py-4 px-2 shadow-[0_4px_20px_rgba(0,0,0,0.15)] '>
        {/* Change disabled to isToritaiSent to handle toritai set value of disabled = isToritaiSent */}
        <button onClick={() => handleGoToLink(`/userDetails/toritai?fullName=${user?.firstName + " " + user?.lastName}&profileImage=${user?.profilePicture}&userId=${userIdRef.current}`)} className='w-[50%] h-[54px] text-[16px] leading-[24px] font-bold text-center border bg-white flex items-center justify-center text-secondary rounded-md'>{t("toritai")}</button>
        <button onClick={() => setSelectedMode(1)} className='w-[50%] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("bookNow")}</button>
      </div>

      <Drawer open={isOptionMenuOpen} onOpenChange={setIsOptionMenuOpen}>
        <DrawerContent aria-describedby={undefined}>
          <DrawerHeader className='flex items-center justify-between '>
            <DialogTitle className='hidden'></DialogTitle>
            <div className='flex items-end justify-end w-full'>
              <DrawerClose className=''>{closeIcon}</DrawerClose>
            </div>
          </DrawerHeader>
          <DrawerFooter className='pb-12'>
            <div className='flex flex-col items-center justify-center gap-4'>
              <button disabled={favButtonDisabled} onClick={handleFavourite} className='text-[#121212] font-semibold text-[16px] flex items-center justify-center gap-1'>{isFavourite ? favFillIcon : favIcon} {t("addToFavourite")}</button>
              <hr className='w-full' />
              <button onClick={handleFavourite} className='text-[#121212] font-semibold text-[16px] flex items-center justify-center gap-1'>{shareIcon} {t("share")}</button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<UserDetailsSkeleton />}>
      <UserDetails />
    </Suspense>
  );
}

const badgeIcon = <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.8611 0.342165C15.5486 -0.114055 16.4485 -0.114055 17.136 0.342165L18.2484 1.07337C18.6234 1.3171 19.0608 1.43584 19.5045 1.41084L20.8357 1.3296C21.6607 1.2796 22.4356 1.72957 22.8043 2.46702L23.4043 3.66069C23.6043 4.06067 23.9293 4.3794 24.323 4.57938L25.5291 5.18559C26.2666 5.55432 26.7166 6.32927 26.6666 7.15421L26.5853 8.48537C26.5603 8.92909 26.6791 9.37281 26.9228 9.74154L27.6603 10.854C28.1165 11.5414 28.1165 12.4414 27.6603 13.1288L26.9228 14.2475C26.6791 14.6225 26.5603 15.0599 26.5853 15.5037L26.6666 16.8348C26.7166 17.6598 26.2666 18.4347 25.5291 18.8034L24.3355 19.4034C23.9355 19.6034 23.6168 19.9284 23.4168 20.3221L22.8106 21.5283C22.4419 22.2657 21.6669 22.7157 20.842 22.6657L19.5108 22.5844C19.0671 22.5594 18.6234 22.6782 18.2546 22.9219L17.1422 23.6594C16.4548 24.1156 15.5548 24.1156 14.8674 23.6594L13.7487 22.9219C13.3737 22.6782 12.9362 22.5594 12.4925 22.5844L11.1614 22.6657C10.3364 22.7157 9.56146 22.2657 9.19273 21.5283L8.59277 20.3346C8.39278 19.9346 8.06781 19.6159 7.67408 19.4159L6.46791 18.8097C5.73046 18.441 5.28049 17.666 5.33049 16.8411L5.41173 15.5099C5.43673 15.0662 5.31799 14.6225 5.07425 14.2537L4.34305 13.1351C3.88683 12.4476 3.88683 11.5477 4.34305 10.8602L5.07425 9.74779C5.31799 9.37281 5.43673 8.93534 5.41173 8.49162L5.33049 7.16046C5.28049 6.33552 5.73046 5.56057 6.46791 5.19184L7.66158 4.59188C8.06156 4.38565 8.38654 4.06067 8.58652 3.66069L9.18648 2.46702C9.55521 1.72957 10.3302 1.2796 11.1551 1.3296L12.4863 1.41084C12.93 1.43584 13.3737 1.3171 13.7424 1.07337L14.8611 0.342165ZM20.9982 11.9976C20.9982 9.23532 18.7608 6.99797 15.9985 6.99797C13.2362 6.99797 10.9989 9.23532 10.9989 11.9976C10.9989 14.76 13.2362 16.9973 15.9985 16.9973C18.7608 16.9973 20.9982 14.76 20.9982 11.9976ZM4.08057 27.6091L6.77414 21.2033C6.78664 21.2095 6.79289 21.2158 6.79914 21.2283L7.3991 22.4219C8.1303 23.8718 9.64895 24.753 11.2738 24.6593L12.605 24.5781C12.6175 24.5781 12.6363 24.5781 12.6488 24.5906L13.7612 25.328C14.0799 25.5342 14.4174 25.6967 14.7674 25.8092L12.4175 31.3901C12.2738 31.7338 11.955 31.9651 11.5863 31.9963C11.2176 32.0276 10.8614 31.8588 10.6614 31.5463L8.64902 28.4653L5.143 28.984C4.78677 29.034 4.43055 28.8903 4.20556 28.609C3.98058 28.3278 3.93683 27.9403 4.07432 27.6091H4.08057ZM19.5795 31.3839L17.2297 25.8092C17.5797 25.6967 17.9172 25.5405 18.2359 25.328L19.3483 24.5906C19.3608 24.5843 19.3733 24.5781 19.3921 24.5781L20.7232 24.6593C22.3481 24.753 23.8668 23.8718 24.598 22.4219L25.1979 21.2283C25.2042 21.2158 25.2104 21.2095 25.2229 21.2033L27.9227 27.6091C28.0602 27.9403 28.0102 28.3216 27.7915 28.609C27.5728 28.8965 27.2103 29.0403 26.8541 28.984L23.348 28.4653L21.3357 31.5401C21.1357 31.8526 20.7795 32.0213 20.4107 31.9901C20.042 31.9588 19.7233 31.7213 19.5795 31.3839Z" fill="#FFFFFF" />
</svg>

const threeDotsIcon = <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.9993 25.6666C21.6182 25.6666 22.2117 25.9125 22.6493 26.35C23.0868 26.7876 23.3327 27.3811 23.3327 28C23.3327 28.6188 23.0868 29.2123 22.6493 29.6499C22.2117 30.0875 21.6182 30.3333 20.9993 30.3333C20.3805 30.3333 19.787 30.0875 19.3494 29.6499C18.9118 29.2123 18.666 28.6188 18.666 28C18.666 27.3811 18.9118 26.7876 19.3494 26.35C19.787 25.9125 20.3805 25.6666 20.9993 25.6666ZM20.9993 18.6666C21.6182 18.6666 22.2117 18.9125 22.6493 19.35C23.0868 19.7876 23.3327 20.3811 23.3327 21C23.3327 21.6188 23.0868 22.2123 22.6493 22.6499C22.2117 23.0875 21.6182 23.3333 20.9993 23.3333C20.3805 23.3333 19.787 23.0875 19.3494 22.6499C18.9118 22.2123 18.666 21.6188 18.666 21C18.666 20.3811 18.9118 19.7876 19.3494 19.35C19.787 18.9125 20.3805 18.6666 20.9993 18.6666ZM20.9993 11.6666C21.6182 11.6666 22.2117 11.9125 22.6493 12.35C23.0868 12.7876 23.3327 13.3811 23.3327 14C23.3327 14.6188 23.0868 15.2123 22.6493 15.6499C22.2117 16.0875 21.6182 16.3333 20.9993 16.3333C20.3805 16.3333 19.787 16.0875 19.3494 15.6499C18.9118 15.2123 18.666 14.6188 18.666 14C18.666 13.3811 18.9118 12.7876 19.3494 12.35C19.787 11.9125 20.3805 11.6666 20.9993 11.6666Z" fill="#2EC4B6" />
</svg>

const favIcon = <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="42" height="42" rx="6" fill="#F2F2F2" fillOpacity="0.1" />
  <path d="M21 10.75C21.0638 10.75 21.1353 10.7626 21.2188 10.7998L21.3066 10.8457C21.3573 10.8763 21.4058 10.9204 21.4492 10.9961L21.4912 11.085L21.4922 11.0869L23.9014 17.0742L24.0723 17.499L24.5283 17.541L30.7266 18.1084C30.9167 18.1381 30.9967 18.1927 31.0283 18.2217C31.0798 18.2689 31.1294 18.3317 31.1719 18.4209L31.2119 18.5195C31.2527 18.6368 31.2608 18.751 31.2354 18.876C31.2211 18.9443 31.1911 19.0169 31.1279 19.0947L31.0527 19.1738L26.3428 23.4346L26.0186 23.7275L26.1133 24.1543L27.5264 30.5107C27.5608 30.6681 27.5418 30.7629 27.5117 30.8291C27.466 30.929 27.4098 31.0112 27.3428 31.0801L27.2715 31.1455C27.2179 31.1892 27.1587 31.2195 27.085 31.2363L27.0049 31.249C26.9346 31.2551 26.8561 31.2419 26.748 31.1699L26.7402 31.165L26.7314 31.1592L21.3994 27.7959L21 27.5439L20.5996 27.7959L15.2676 31.1592L15.2598 31.165L15.252 31.1699C15.1705 31.2242 15.1058 31.2447 15.0488 31.249H14.9941C14.9092 31.2416 14.8425 31.2195 14.7842 31.1846L14.7285 31.1455C14.6539 31.0847 14.59 31.0118 14.5371 30.9229L14.4873 30.8281C14.4574 30.762 14.4384 30.6675 14.4727 30.5107L15.8857 24.1543L15.9805 23.7275L15.6572 23.4346L10.9453 19.1729C10.8595 19.0917 10.8123 19.0172 10.7861 18.9473L10.7656 18.8789V18.876L10.752 18.7842C10.7472 18.7239 10.7507 18.6656 10.7627 18.6074L10.7871 18.5195C10.837 18.3759 10.9021 18.2847 10.9707 18.2217C11.0023 18.1927 11.0829 18.1381 11.2734 18.1084L17.4707 17.541L17.9268 17.499L18.0977 17.0742L20.5068 11.0869L20.5078 11.085C20.5474 10.9855 20.5939 10.9237 20.6436 10.8818L20.6943 10.8457L20.6953 10.8447C20.8165 10.7721 20.915 10.75 21 10.75Z" stroke="#FF9F1C" strokeWidth="1.5" />
</svg>

const favFillIcon = <svg width="42" height="42" viewBox="0 0 42 42" fill="#FF9F1C" xmlns="http://www.w3.org/2000/svg">
  <rect width="42" height="42" rx="6" fill="none" fillOpacity="0.1" />
  <path d="M21 10.75C21.0638 10.75 21.1353 10.7626 21.2188 10.7998L21.3066 10.8457C21.3573 10.8763 21.4058 10.9204 21.4492 10.9961L21.4912 11.085L21.4922 11.0869L23.9014 17.0742L24.0723 17.499L24.5283 17.541L30.7266 18.1084C30.9167 18.1381 30.9967 18.1927 31.0283 18.2217C31.0798 18.2689 31.1294 18.3317 31.1719 18.4209L31.2119 18.5195C31.2527 18.6368 31.2608 18.751 31.2354 18.876C31.2211 18.9443 31.1911 19.0169 31.1279 19.0947L31.0527 19.1738L26.3428 23.4346L26.0186 23.7275L26.1133 24.1543L27.5264 30.5107C27.5608 30.6681 27.5418 30.7629 27.5117 30.8291C27.466 30.929 27.4098 31.0112 27.3428 31.0801L27.2715 31.1455C27.2179 31.1892 27.1587 31.2195 27.085 31.2363L27.0049 31.249C26.9346 31.2551 26.8561 31.2419 26.748 31.1699L26.7402 31.165L26.7314 31.1592L21.3994 27.7959L21 27.5439L20.5996 27.7959L15.2676 31.1592L15.2598 31.165L15.252 31.1699C15.1705 31.2242 15.1058 31.2447 15.0488 31.249H14.9941C14.9092 31.2416 14.8425 31.2195 14.7842 31.1846L14.7285 31.1455C14.6539 31.0847 14.59 31.0118 14.5371 30.9229L14.4873 30.8281C14.4574 30.762 14.4384 30.6675 14.4727 30.5107L15.8857 24.1543L15.9805 23.7275L15.6572 23.4346L10.9453 19.1729C10.8595 19.0917 10.8123 19.0172 10.7861 18.9473L10.7656 18.8789V18.876L10.752 18.7842C10.7472 18.7239 10.7507 18.6656 10.7627 18.6074L10.7871 18.5195C10.837 18.3759 10.9021 18.2847 10.9707 18.2217C11.0023 18.1927 11.0829 18.1381 11.2734 18.1084L17.4707 17.541L17.9268 17.499L18.0977 17.0742L20.5068 11.0869L20.5078 11.085C20.5474 10.9855 20.5939 10.9237 20.6436 10.8818L20.6943 10.8457L20.6953 10.8447C20.8165 10.7721 20.915 10.75 21 10.75Z" stroke="#FF9F1C" strokeWidth="1.5" />
</svg>

const shareIcon = <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="42" height="42" rx="6" fill="#F2F2F2" fillOpacity="0.1" />
  <path d="M27 31C26.1667 31 25.4583 30.7083 24.875 30.125C24.2917 29.5417 24 28.8333 24 28C24 27.8833 24.0083 27.7623 24.025 27.637C24.0417 27.5117 24.0667 27.3993 24.1 27.3L17.05 23.2C16.7667 23.45 16.45 23.646 16.1 23.788C15.75 23.93 15.3833 24.0007 15 24C14.1667 24 13.4583 23.7083 12.875 23.125C12.2917 22.5417 12 21.8333 12 21C12 20.1667 12.2917 19.4583 12.875 18.875C13.4583 18.2917 14.1667 18 15 18C15.3833 18 15.75 18.071 16.1 18.213C16.45 18.355 16.7667 18.5507 17.05 18.8L24.1 14.7C24.0667 14.6 24.0417 14.4877 24.025 14.363C24.0083 14.2383 24 14.1173 24 14C24 13.1667 24.2917 12.4583 24.875 11.875C25.4583 11.2917 26.1667 11 27 11C27.8333 11 28.5417 11.2917 29.125 11.875C29.7083 12.4583 30 13.1667 30 14C30 14.8333 29.7083 15.5417 29.125 16.125C28.5417 16.7083 27.8333 17 27 17C26.6167 17 26.25 16.9293 25.9 16.788C25.55 16.6467 25.2333 16.4507 24.95 16.2L17.9 20.3C17.9333 20.4 17.9583 20.5127 17.975 20.638C17.9917 20.7633 18 20.884 18 21C18 21.1167 17.9917 21.2377 17.975 21.363C17.9583 21.4883 17.9333 21.6007 17.9 21.7L24.95 25.8C25.2333 25.55 25.55 25.3543 25.9 25.213C26.25 25.0717 26.6167 25.0007 27 25C27.8333 25 28.5417 25.2917 29.125 25.875C29.7083 26.4583 30 27.1667 30 28C30 28.8333 29.7083 29.5417 29.125 30.125C28.5417 30.7083 27.8333 31 27 31ZM27 15C27.2833 15 27.521 14.904 27.713 14.712C27.905 14.52 28.0007 14.2827 28 14C28 13.7167 27.904 13.479 27.712 13.287C27.52 13.095 27.2827 12.9993 27 13C26.7167 13 26.479 13.096 26.287 13.288C26.095 13.48 25.9993 13.7173 26 14C26 14.2833 26.096 14.521 26.288 14.713C26.48 14.905 26.7173 15.0007 27 15ZM15 22C15.2833 22 15.521 21.904 15.713 21.712C15.905 21.52 16.0007 21.2827 16 21C16 20.7167 15.904 20.479 15.712 20.287C15.52 20.095 15.2827 19.9993 15 20C14.7167 20 14.479 20.096 14.287 20.288C14.095 20.48 13.9993 20.7173 14 21C14 21.2833 14.096 21.521 14.288 21.713C14.48 21.905 14.7173 22.0007 15 22ZM27 29C27.2833 29 27.521 28.904 27.713 28.712C27.905 28.52 28.0007 28.2827 28 28C28 27.7167 27.904 27.479 27.712 27.287C27.52 27.095 27.2827 26.9993 27 27C26.7167 27 26.479 27.096 26.287 27.288C26.095 27.48 25.9993 27.7173 26 28C26 28.2833 26.096 28.521 26.288 28.713C26.48 28.905 26.7173 29.0007 27 29Z" fill="#FF9F1C" />
</svg>

const closeIcon = <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="34" height="34" rx="17" fill="#E10101" fillOpacity="0.02" />
  <path d="M17 18.0646L13.2738 21.7909C13.1343 21.9303 12.9569 22 12.7414 22C12.526 22 12.3485 21.9303 12.2091 21.7909C12.0697 21.6515 12 21.474 12 21.2586C12 21.0431 12.0697 20.8657 12.2091 20.7262L15.9354 17L12.2091 13.2738C12.0697 13.1343 12 12.9569 12 12.7414C12 12.526 12.0697 12.3485 12.2091 12.2091C12.3485 12.0697 12.526 12 12.7414 12C12.9569 12 13.1343 12.0697 13.2738 12.2091L17 15.9354L20.7262 12.2091C20.8657 12.0697 21.0431 12 21.2586 12C21.474 12 21.6515 12.0697 21.7909 12.2091C21.9303 12.3485 22 12.526 22 12.7414C22 12.9569 21.9303 13.1343 21.7909 13.2738L18.0646 17L21.7909 20.7262C21.9303 20.8657 22 21.0431 22 21.2586C22 21.474 21.9303 21.6515 21.7909 21.7909C21.6515 21.9303 21.474 22 21.2586 22C21.0431 22 20.8657 21.9303 20.7262 21.7909L17 18.0646Z" fill="#E10101" />
</svg>

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]