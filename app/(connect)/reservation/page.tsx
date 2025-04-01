"use client"
import { backIcon } from '@/constants/icons';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';
import {cn} from '@/lib/utils'
import UserDetailsSkeleton from '@/components/skeleton/userDetailsSkeleton';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DialogTitle } from '@radix-ui/react-dialog';
import { format, parseISO } from 'date-fns';
import { useStripe } from '@stripe/react-stripe-js';
import getStripe from '@/lib/getStripe';

interface User {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
}

type Reservation = {
  _id: string;
  user_id: User;
  user_id_2: User;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  fees: number;
  transportation_fees: number;
  payment_status: "pending" | "paid" | "failed";
  reservation_status: "pending" | "completed" | "running";
  shootingPlace: string;
  shootingLocation: string;
  meetingPoint: string;
  shootingConcept: string;
  clothingType: string;
  shoesType: string;
  itemsType: string;
  makeUpType: string;
  shootingPlaceRainy: string;
  shootingLocationRainy: string;
  meetingPointRainy: string;
  shootingConceptRainy: string;
  clothingTypeRainy: string;
  shoesTypeRainy: string;
  itemsTypeRainy: string;
  makeUpTypeRainy: string;
  editRequestStatus: "none" | "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
};

function ReservationDetails() {
  const router = useRouter();
  const logout = useLogout();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const reservationId = searchParams.get("reservationId");
  const [selectedMode, setSelectedMode] = useState(0);
  const [reservation,setReservation] = useState<Reservation|null>(null);
  const [shootModePopup,setShootModePopup] = useState(false);
  const [otherUser,setOtherUser] = useState<User|null>(null);

  // const stripe = useStripe();

  const userIdRef = useRef<null|string>(null);
  const reservationIdRef = useRef<null|string>(null);

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  // const handleCheckout = async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create-payment-session`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({ reservationId }),
  //     });

  //     const { sessionId } = await response.json();
  //     console.log(response)
  //     const stripe = await getStripe();

  //     // Redirect to Stripe Checkout
  //     const { error } = await stripe!.redirectToCheckout({ sessionId });
  //     if (error) {
  //       console.error('Stripe checkout error:', error);
  //     }
  //   } catch (error) {
  //     console.error('Error initiating checkout:', error);
  //   }
  // }

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reservationId }),
      });
  
      const { clientSecret } = await response.json();
      
      // Redirect to your own payment page with clientSecret as a query param
      router.push(`reservation/payment?clientSecret=${clientSecret}`);
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };

  useEffect(() => {
    try {
      console.log(reservationId)
      const fetchReservation = async () => {
        try{
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reservations/reservation?reservation_id=${reservationId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials:"include",
          });

          if(res.status===200){
            const data = await res.json();
            userIdRef.current = data?.user_id;
            reservationIdRef.current = data?.reservation?._id;
            setReservation(data?.reservation)
            const userOther = data?.reservation?.user_id?._id === userIdRef.current ? data?.reservation?.user_id_2 : data?.reservation?.user_id
            setOtherUser(userOther);
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
            const data = await res.json();
            toast({
              title:"Internal server error",
              description:`Error: ${data.message}`,
              variant:"destructive"
            })
          }
        } catch (error:any) {
          toast({
            title:"Error",
            description: `Error during fetch: ${error.message}`,
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
      fetchReservation();
    } catch (error) {
      console.log("Error", error)
    }
  }, [])

  return (
    <div className='no-scrollbar flex flex-col h-full'>
      <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Shooting Details</span>
      </header>

      <div className='overflow-y-scroll flex-1 no-scrollbar mx-2 my-4 space-y-8'>
        <div className='mx-2 space-y-2'>
          <div className='flex items-center justify-between max-w-[800px] md:mx-auto'>
            <span className='text-[15px] font-semibold'>Shooting Details</span>
            <button className='text-[11px] font-semibold text-[#F45D48] underline underline-offset-1'>Cancel Shoot</button>
          </div>
          <div className='bg-[#F7F7F7] rounded-lg max-w-[800px] md:mx-auto min-h-[52px] p-2 w-full flex flex-wrap items-center gap-[8px] transition-all duration-300'>
            <div className='h-[48px] aspect-square flex items-center justify-center'>
                {loading ? 
                  <div className='h-[48px] w-[48px] bg-gray-200 animate-pulse rounded-full'></div> : 
                  <Image height={64} width={64} src={otherUser?.profilePicture||userAvatar} alt='profile picture' className='h-[48px] w-[48px] rounded-full animate-in object-cover object-center' />
                }
            </div>
            <div className='flex flex-col items-start gap-1'>
                <span className='text-[#B9B9B9] text-[11px] font-normal'>Name of the photographer</span>
                <span className='text-[14px] font-semibold'>{loading ? <div className='h-[14px] w-[120px] bg-gray-200 animate-pulse rounded-lg'></div> : otherUser?.firstName||"Toritora User"} {otherUser?.lastName}</span>
            </div>
          </div>
        </div>

        <div className='mx-2 space-y-2'>
          <div className='flex items-center justify-between max-w-[800px] md:mx-auto'>
            <span className='text-[15px] font-semibold'>Payment Details</span>
          </div>
          <div className='bg-[#F7F7F7] rounded-lg max-w-[800px] md:mx-auto min-h-[52px] p-2 w-full flex flex-wrap items-center gap-[8px] transition-all duration-300'>
            <div className='h-[48px] aspect-square flex items-center justify-center'>
                {yenIcon}
            </div>
            <div className='flex flex-col items-start gap-1'>
                <span className='text-[#B9B9B9] text-[11px] font-normal'>Price of photoshoot</span>
                <span className='text-[17px] font-semibold flex gap-2 items-center justify-center'>{loading ? <div className='h-[17px] w-[40px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.fees}{" "}JPY</span>
            </div>
          </div>
          <div>
            {reservation?.payment_status === "pending" ?
            <span className='text-[16px] font-medium text-[#111111]'>Payment is pending <button onClick={handleCheckout} className={`${reservation?.user_id?._id === userIdRef.current ? "hidden" : "" } text-white bg-secondary px-8 py-2 rounded-lg text-[16px] font-semibold`}> Pay Now </button></span> :
            reservation?.payment_status === "failed" ?
            <span className='text-[16px] font-medium text-[#111111]'>Payment failed <button onClick={handleCheckout} className={`${reservation?.user_id?._id === userIdRef.current ? "hidden" : "" } text-white bg-secondary px-8 py-2 rounded-lg text-[16px] font-semibold`}> Pay Now </button></span> :
            reservation?.payment_status === "paid" ?
            <span className='text-[16px] font-medium text-[#111111]'>Paid</span> :
            <></>
            }
          </div>
        </div>

        <div className='mx-2 space-y-2'>
          <div className='flex items-center justify-between max-w-[800px] md:mx-auto'>
            <span className='text-[15px] font-semibold'>Date & Time</span>
            {/* <button className='text-[11px] font-semibold text-[#F45D48] underline underline-offset-1'>{editIcon}</button> */}
          </div>
          <div className='bg-[#F7F7F7] rounded-lg max-w-[800px] md:mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-around px-4 gap-[8px] transition-all duration-300'>
            <div className='flex items-center flex-wrap gap-2'>
              <div className='h-[22px] aspect-square flex items-center justify-center'>
                  {calendarIcon}
              </div>
              <div className='flex flex-col items-start gap-1'>
                  <span className='text-[#B9B9B9] text-[10px] font-normal'>Date of shoot</span>
                  <span className='text-[11px] font-semibold'>{loading ? <div className='h-[11px] w-[60px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.date && format(parseISO(reservation?.date!), "EEE, dd MMM yyyy")}</span>
              </div>
            </div>
            <div className='h-[40px] w-[2px] bg-[#EAE9E9]'></div>
            <div className='flex items-center flex-wrap gap-2'>
              <div className='h-[22px] aspect-square flex items-center justify-center'>
                  {clockIcon}
              </div>
              <div className='flex flex-col items-start gap-1'>
                  <span className='text-[#B9B9B9] text-[10px] font-normal'>Time of shoot</span>
                  <span className='text-[11px] font-semibold'>{loading ? <div className='h-[11px] w-[60px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.startTime && format(parseISO(reservation?.startTime!), "hh:mm a")} {loading ? "" : " - "} {reservation?.endTime && format(parseISO(reservation?.endTime!), "hh:mm a")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mx-2 space-y-2'>
          <div className='flex items-center justify-between max-w-[800px] md:mx-auto'>
            <span className='text-[15px] font-semibold'>Specifications</span>
            {/* <button className='text-[11px] font-semibold text-[#F45D48] underline underline-offset-1'>{editIcon}</button> */}
          </div>
          <div className='bg-[#F7F7F7] rounded-lg max-w-[800px] md:mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-center gap-[8px] transition-all duration-300'>
            <button onClick={() => setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] w-[45%] text-center font-semibold text-[14px] leading-[21px] transition-all duration-300`}>Normal</button>
            <button onClick={() => setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] w-[45%] text-center font-semibold text-[14px] leading-[21px] transition-all duration-300`}>Raining</button>
          </div>
        </div>

        <div className='relative w-full max-w-[800px] md:mx-auto h-auto'>

          <div className={`w-full space-y-4 mx-2 opacity-0`}>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Place</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Location</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Meeting Point</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Concept</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Clothing Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shoes Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Items Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Make-Up Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>NA</span>
            </div>
          </div>
          
          <div className={`absolute top-0 left-0 w-full space-y-4 mx-2 ${selectedMode === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"} transition-all duration-300 ease-out`}>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Place</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shootingPlace ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Location</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shootingLocation ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Meeting Point</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.meetingPoint ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Concept</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shootingConcept ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Clothing Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.clothingType ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shoes Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shoesType ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Items Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.itemsType ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Make-Up Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.makeUpType ?? "NA"}</span>
            </div>
          </div>

          <div className={`absolute top-0 left-0 w-full space-y-4 mx-2 ${selectedMode === 0 ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"} transition-all duration-300 ease-out`}>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Place</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shootingPlaceRainy ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Location</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shootingLocationRainy ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Meeting Point</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.meetingPointRainy ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shooting Concept</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shootingConceptRainy ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Clothing Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.clothingTypeRainy ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Shoes Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.shoesTypeRainy ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Items Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.itemsTypeRainy ?? "NA"}</span>
            </div>
            <div className='space-y-2'>
              <span className='block md:inline-block md:w-[400px] text-[#AAAAAA] text-[15px] leading-[27px] font-normal'>Make-Up Type</span>
              <span className='block md:inline-block md:w-[400px] text-[#111111] text-[13px] font-semibold'>{loading ? <div className='h-[20px] w-[180px] bg-gray-300 animate-pulse rounded-md'></div> : reservation?.makeUpTypeRainy ?? "NA"}</span>
            </div>
          </div>
        </div>

      </div>

      <div className='flex items-center justify-center gap-6 w-full md:mx-auto py-4 px-2 shadow-[0_4px_20px_rgba(0,0,0,0.15)] '>
        <Drawer open={shootModePopup} onOpenChange={setShootModePopup}>
          <DrawerTrigger className='md:max-w-[800px] w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Use Shooting Mode</DrawerTrigger>
          <DrawerContent>
          <DrawerHeader className='flex items-center justify-between'>
            <DialogTitle className='hidden'></DialogTitle>
          </DrawerHeader>
          <div className='space-y-8 mx-4 md:max-w-[800px] md:w-full md:mx-auto'>
            <div className='text-center space-y-4'>
            <span className='font-medium text-[16px] leading-[21px]'>Do you want to enable shooting mode ?</span>
            <p className='text-[#313634] text-[13px] font-normal'>When you press this button, a 4-digit number will be sent by SMS. Enter OTP & Shooting will start immediately after both persons have entered.</p>
            <p className='text-[#313634] text-[13px] font-normal'>In addition, the location information at the time of shooting will be shared.</p>
            <span className='text-[#FF0000] text-[13px] font-medium'>Click here if the other person cannot use the shooting mode</span>
            </div>

            <div className='flex flex-col items-center justify-between flex-wrap'>
              <button className='w-full mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Start Now</button>
              <button onClick={()=>setShootModePopup(false)} className='w-full mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-white flex items-center justify-center text-[#ADB2B9] rounded-md'>Cancel</button>
            </div>
          </div>
          <DrawerFooter className=''>
          </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<UserDetailsSkeleton/>}>
      <ReservationDetails />
    </Suspense>
  );
}

const editIcon = <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.9055 0.663809C13.2887 0.757399 12.7654 0.99563 12.2336 1.4253C12.0635 1.56143 9.52375 4.07988 6.57989 7.02374L1.2367 12.3797L1.17289 12.6775C0.279518 16.8253 0.113606 17.6421 0.139131 17.7824C0.177418 17.9781 0.381617 18.2121 0.577307 18.2759C0.658136 18.3015 0.80703 18.3142 0.904876 18.3015C1.0325 18.2844 5.08669 17.4208 5.95028 17.2294C6.06514 17.1996 16.6962 6.61109 17.0493 6.16866C18.2362 4.68396 18.0022 2.5101 16.5346 1.35723C15.8156 0.795685 14.7989 0.527676 13.9055 0.663809ZM14.8542 2.04215C15.8879 2.25911 16.5984 3.29286 16.424 4.32662C16.3261 4.91794 16.173 5.14767 15.2541 6.08358L14.4373 6.91739L12.9909 5.46673L11.5445 4.02032L12.3995 3.16949C13.1398 2.42927 13.2887 2.30165 13.5311 2.1953C13.9991 1.98259 14.3692 1.94005 14.8542 2.04215ZM11.9273 9.42733C11.085 10.2696 9.25574 12.0862 7.86464 13.4645L5.32918 15.9659L3.52968 16.3531C2.53846 16.5658 1.72167 16.7359 1.71316 16.7274C1.70891 16.7232 1.87482 15.9021 2.08752 14.9109L2.4704 13.1029L6.51608 9.04871L10.566 4.99877L12.0124 6.44518L13.4588 7.89158L11.9273 9.42733Z" fill="#2EC4B6"/>
</svg>

const yenIcon = <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_786_50899)">
<path d="M4.8422 0.970373C4.61822 1.08523 4.46316 1.33793 4.4689 1.57914C4.47465 1.75143 5.14084 2.99194 7.81712 7.80464C9.65491 11.1127 11.1711 13.8578 11.1883 13.9038C11.217 13.9785 10.9356 13.9899 8.8681 13.9899H6.51344L6.33541 14.1622C6.23777 14.2599 6.14588 14.4207 6.12865 14.524C6.10568 14.6274 6.09994 15.2419 6.11143 15.8966C6.12865 17.0625 6.12865 17.0855 6.26649 17.229C6.34689 17.3094 6.50196 17.4013 6.61107 17.4358C6.73742 17.4702 8.0009 17.4932 9.79274 17.4932H12.7619V18.3834V19.2736H9.63768H6.51918L6.36412 19.4172C6.28372 19.4918 6.18609 19.6239 6.15737 19.7043C6.06548 19.9455 6.08271 22.1107 6.18034 22.3346C6.34689 22.7367 6.20906 22.7194 9.66065 22.7194H12.7619L12.7677 26.1768C12.7677 28.7037 12.7849 29.6915 12.8366 29.8408C12.8768 29.95 12.9916 30.0935 13.1008 30.1682C13.296 30.3003 13.3132 30.3003 15.2142 30.3003C16.805 30.3003 17.1669 30.2831 17.3219 30.2141C17.6837 30.0419 17.6722 30.2141 17.701 26.3089L17.7297 22.7481L20.9056 22.7194L24.0873 22.6907L24.2538 22.5012L24.4204 22.3174V21.008V19.6986L24.2538 19.5033L24.0873 19.3023L20.9113 19.2736L17.7297 19.2449L17.7125 18.3719L17.6952 17.499L20.8424 17.4817C23.7369 17.4645 24.0011 17.4588 24.139 17.3611C24.3974 17.1888 24.4204 17.0567 24.4204 15.6841V14.3977L24.2251 14.1967L24.0356 13.9899H21.6637C19.6019 13.9899 19.3033 13.9785 19.332 13.9038C19.3492 13.8578 20.8252 11.1127 22.617 7.80464C25.1383 3.14126 25.8734 1.73995 25.8734 1.5734C25.8849 1.33793 25.7298 1.08523 25.5058 0.970373C25.3163 0.87274 21.164 0.866997 20.9515 0.96463C20.8711 0.999088 20.7678 1.08523 20.7218 1.15415C20.6529 1.26327 16.0814 11.2907 15.6622 12.267C15.5703 12.4738 15.4841 12.6575 15.4612 12.6805C15.4439 12.7092 15.2372 12.2957 15.0075 11.7616C14.772 11.2333 13.4855 8.62016 12.1474 5.96111C10.0627 1.83183 9.67788 1.09672 9.52282 1.00483C9.35627 0.901455 9.20695 0.895712 7.16241 0.895712C5.54286 0.895712 4.94558 0.912941 4.8422 0.970373Z" fill="#FF9F1C"/>
</g>
<defs>
<clipPath id="clip0_786_50899">
<rect width="29.4046" height="29.4046" fill="white" transform="translate(0.472656 0.895691)"/>
</clipPath>
</defs>
</svg>

const calendarIcon = <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_786_50909)">
<path d="M5.65063 0.728052C5.43792 0.825897 5.2635 1.02584 5.20394 1.23855C5.18267 1.32363 5.1614 1.59164 5.1614 1.82562V2.25954L4.32334 2.27656C3.37892 2.29783 3.13643 2.35313 2.60892 2.63816C2.18351 2.87214 1.68577 3.39965 1.46456 3.84633C1.11147 4.56528 1.14125 3.81655 1.14125 12.3503C1.14125 20.8714 1.11572 20.1354 1.46031 20.8416C1.77511 21.4882 2.38771 22.02 3.11516 22.2795L3.48102 22.4114H11.6277H19.7744L20.1147 22.2923C21.0719 21.9562 21.7781 21.1947 22.0376 20.2205C22.1099 19.961 22.1141 19.459 22.1141 12.3503C22.1141 3.8123 22.1439 4.56954 21.7866 3.84208C21.5356 3.33158 21.0293 2.82534 20.5188 2.5786C20.0211 2.33186 19.6552 2.26805 18.7959 2.26805H18.094V1.82987C18.094 1.31512 18.0472 1.12369 17.877 0.927996C17.5069 0.511091 16.805 0.596174 16.5625 1.09391C16.4902 1.2428 16.4774 1.35766 16.4774 1.77032V2.26805H11.6319H6.78648L6.76947 1.72352C6.7567 1.23004 6.7482 1.16197 6.6546 1.02584C6.42063 0.689764 6.00372 0.56214 5.65063 0.728052ZM5.16991 4.38235C5.18693 4.96517 5.25499 5.14384 5.51024 5.33103C5.82079 5.5565 6.21643 5.53522 6.50996 5.27572C6.73543 5.07578 6.77797 4.93965 6.77797 4.37385V3.88462H11.6277H16.4774V4.37385C16.4774 4.93965 16.5199 5.07578 16.7454 5.27572C17.0475 5.53948 17.4601 5.55224 17.7792 5.30976C18.0046 5.13959 18.0684 4.94815 18.0855 4.38235L18.1025 3.88462H18.7789C19.3532 3.88462 19.4851 3.89738 19.685 3.9697C19.9786 4.08031 20.2381 4.3313 20.3827 4.64186L20.4976 4.88434L20.5103 6.19036L20.5273 7.50063H11.6277H2.72804L2.74505 6.19036C2.75782 5.05025 2.77058 4.86307 2.83439 4.71418C2.95351 4.44191 3.11516 4.24197 3.29809 4.1186C3.60439 3.9144 3.73201 3.88887 4.46372 3.88887L5.15289 3.88462L5.16991 4.38235ZM20.5103 14.4647L20.4976 19.8164L20.387 20.0503C20.2551 20.3311 20.0254 20.5651 19.7573 20.697L19.5616 20.7948H11.6277H3.69373L3.49804 20.697C3.22577 20.5651 3.0003 20.3354 2.86842 20.0546L2.75782 19.8164L2.74505 14.4647L2.73655 9.11721H11.6277H20.5188L20.5103 14.4647Z" fill="#FF9F1C"/>
</g>
<defs>
<clipPath id="clip0_786_50909">
<rect width="21.7812" height="21.7812" fill="white" transform="translate(0.738281 0.651489)"/>
</clipPath>
</defs>
</svg>

const clockIcon = <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.6732 0.681229C9.06093 0.834377 7.86126 1.17471 6.50419 1.86388C4.89613 2.68493 3.45398 3.97818 2.39895 5.5437C1.95652 6.20735 1.412 7.32619 1.14824 8.11746C0.939786 8.75558 0.769621 9.48303 0.667521 10.202C0.595201 10.704 0.595201 12.3801 0.667521 12.8821C0.846195 14.1371 1.17802 15.2346 1.69702 16.2854C2.27984 17.4766 2.85415 18.2763 3.79856 19.225C4.73873 20.1609 5.55127 20.7437 6.69563 21.3053C7.49541 21.6967 8.01016 21.8881 8.8227 22.0923C10.9498 22.6283 13.0853 22.5262 15.1614 21.7902C15.7995 21.5648 16.897 21.0117 17.4586 20.6374C18.7433 19.778 19.8962 18.5954 20.73 17.2851C21.0363 16.8044 21.5298 15.7834 21.7297 15.2176C22.7295 12.4014 22.555 9.38093 21.2405 6.73912C20.713 5.67558 20.1217 4.83752 19.2921 3.98244C18.3817 3.03802 17.4628 2.37012 16.2674 1.7788C15.0082 1.15769 13.8341 0.821615 12.4387 0.693991C12.0048 0.655704 11.0221 0.647196 10.6732 0.681229ZM12.9917 2.13614C15.6889 2.59134 17.9733 4.08028 19.4708 6.36901C20.194 7.46657 20.6875 8.76408 20.9129 10.1594C21.015 10.8103 21.015 12.2737 20.9129 12.9246C20.4535 15.7664 18.8965 18.1232 16.4801 19.6462C15.4464 20.297 14.1957 20.7565 12.8641 20.9735C12.209 21.0756 10.7498 21.0756 10.0989 20.9692C7.98463 20.6246 6.24044 19.744 4.75574 18.2636C3.28807 16.8044 2.3947 15.0389 2.05012 12.9246C1.94802 12.2737 1.94802 10.8103 2.05012 10.1594C2.4968 7.40701 3.95171 5.1268 6.23193 3.60382C7.5337 2.73172 9.10347 2.18719 10.7158 2.0383C11.1752 1.99576 12.494 2.05532 12.9917 2.13614Z" fill="#FF9F1C"/>
<path d="M11.256 5.0077C11.0475 5.08427 10.9837 5.14383 10.8816 5.33527C10.805 5.49267 10.8008 5.62455 10.8008 8.8194C10.8008 12.0185 10.805 12.1461 10.8816 12.2993C10.9284 12.3844 12.0685 13.5585 13.4256 14.9113C15.608 17.0894 15.9057 17.3702 16.0674 17.4128C16.3865 17.4978 16.6928 17.3617 16.8417 17.0724C16.9438 16.8767 16.948 16.6981 16.8672 16.5066C16.8331 16.4301 15.8079 15.375 14.4849 14.052L12.1621 11.7335V8.6152C12.1621 5.59902 12.1579 5.49267 12.077 5.33527C11.9281 5.04173 11.5623 4.89709 11.256 5.0077Z" fill="#FF9F1C"/>
</svg>
