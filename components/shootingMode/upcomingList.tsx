"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { backIcon } from '@/constants/icons';
import { useLogout } from '@/lib/logout';
import { Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Ghost from '@/public/images/mypage/ghost.gif'
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface User {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
}

interface Reservation {
  _id: string;
  user_id: User;
  user_id_2: User;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  fees: string;
  transportation_fees: string;
  payment_mode: string;
  payment_id: string;
  payment_status: string;
  reservation_status: string;

  // Optional fields for both forms (normal and rainy day)
  shootingPlace?: string;
  shootingLocation?: string;
  meetingPoint?: string;
  shootingConcept?: string;
  clothingType?: string;
  shoesType?: string;
  itemsType?: string;
  makeUpType?: string;

  // Rainy day form fields
  shootingPlaceRainy?: string;
  shootingLocationRainy?: string;
  meetingPointRainy?: string;
  shootingConceptRainy?: string;
  clothingTypeRainy?: string;
  shoesTypeRainy?: string;
  itemsTypeRainy?: string;
  makeUpTypeRainy?: string;

  editedShootingPlace?: string;
  editedShootingLocation?: string;
  editedMeetingPoint?: string;
  editedShootingConcept?: string;
  editedClothingType?: string;
  editedShoesType?: string;
  editedItemsType?: string;
  editedMakeUpType?: string;

  editedShootingPlaceRainy?: string;
  editedShootingLocationRainy?: string;
  editedMeetingPointRainy?: string;
  editedShootingConceptRainy?: string;
  editedClothingTypeRainy?: string;
  editedShoesTypeRainy?: string;
  editedItemsTypeRainy?: string;
  editedMakeUpTypeRainy?: string;

  editRequestStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
}

interface DateGroupedReservations {
    date: string;
    reservations: Reservation[];
  }

const getOrdinalSuffix = (day:number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
};

const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};

function UpcomingList() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [groupedReservations, setGroupedReservations] = useState<DateGroupedReservations[]>([]);
  const [reservationLoading,setReservationLoading] = useState(false);
  const userIdRef = useRef<string>("");


  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  const logout = useLogout();

  const groupByDate = (reservations:Reservation[]) => {
    const grouped: { [key: string]: Reservation[] } = {};

    reservations.forEach((reservation) => {
    //   const date = new Date(reservation.date).toLocaleDateString(); // Format the date (you can customize this)
    const date = formatDate(reservation.date);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(reservation);
    });

    return Object.keys(grouped).map(date => ({
        date,
        reservations: grouped[date]
      }));
  };

  useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
            //   const data = await fetchRequests(logout);
            const res = await fetch(`http://localhost:8080/api/reservation`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            userIdRef.current = data?.user_id;
              setReservations(data?.reservations)
              const groupedReservations = groupByDate(data?.reservations);
              console.log(groupedReservations)
              setGroupedReservations(groupedReservations);
              console.log("Reservations:", data);
          } catch (error) {
              console.error("Error fetching booking requests:", error);
          } finally {
            setLoading(false);
          }
      };

      fetchData();
      setLoading(false)
  }, []);

  return (
    <div className='flex flex-col h-full'>

      <div className='py-6 overflow-y-scroll max-w-[800px] w-full mx-auto flex-1 no-scrollbar'>

        {loading ?
        <div>
        </div>
        :
        // <div className={`${loading ? "hidden" : ""} mx-2`}>
        //   {reservations.length > 0 ? (
        //     <div className="space-y-4">
        //       {reservations.map((reservation,index) => {
        //         const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
        //           weekday: "short",
        //           day: "2-digit",
        //           month: "short",
        //           year: "numeric",
        //         });

        //         const formattedStartTime = new Date(reservation.startTime).toLocaleTimeString("en-US", {
        //           hour: "2-digit",
        //           minute: "2-digit",
        //           hour12: true,
        //         });

        //         const formattedEndTime = new Date(reservation.endTime).toLocaleTimeString("en-US", {
        //           hour: "2-digit",
        //           minute: "2-digit",
        //           hour12: true,
        //         });

        //         return (
        //             <div key={index} className='space-y-2'>
        //             <div>
        //                 <span className='text-[13px] font-semibold'>{formattedStartTime} - {formattedEndTime}</span>
        //             </div>
        //             <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden' key={index}>
        //                 <div key={index} className="p-4 flex flex-wrap gap-2 justify-between items-center">
        //                     <div className='flex flex-wrap items-center justify-start gap-2 min-w-[220px]'>
        //                         <div className=''>
        //                             <Image height={64} width={64} src={reservation.user_id_2?.profilePicture||userAvatar} alt='profile picture' className='h-[48px] w-[48px] rounded-full animate-in object-cover object-center' />
        //                         </div>
        //                         <div>
        //                             <p className="text-lg font-semibold">
        //                             {reservation.user_id_2.firstName} {reservation.user_id_2.lastName}
        //                             </p>
        //                             <p className="text-sm text-gray-500">
        //                             {formattedDate} <br />({formattedStartTime} - {formattedEndTime})
        //                             </p>
        //                         </div>
        //                     </div>
        //                     <div className='flex flex-col gap-2 flex-wrap'>
        //                         {reservation.user_id_2?._id === userIdRef.current ? <button className='w-[100px] h-[30px] bg-primary text-white text-[9px] font-semibold flex items-center justify-center rounded-lg'>Edit Request</button>: <></>}
        //                         <button className='w-[100px] h-[30px] bg-primary text-white text-[9px] font-semibold flex items-center justify-center rounded-lg'>View Request</button>
        //                     </div>
        //                 </div>
        //                 <div className='p-4 flex flex-row flex-wrap items-center justify-start gap-2 border-t'>
        //                     <div>{locationIcon}</div>
        //                     <div className='flex flex-col items-start justify-center'>
        //                         <span className='text-[11px] text-[#000000] font-semibold'>{reservation?.shootingLocation || "Shooting location not provided"}</span>
        //                         <span className='text-[10px] text-[#919191] font-normal'>This is shooting location</span>
        //                     </div>
        //                 </div>
        //                 <div className='p-4 border-t'>
        //                     <span className='text-[11px] font-medium'>Payment Status: </span><span className={`${reservation?.payment_status !== "completed" ? "text-red-500" : "text-green-500"} text-[12px] font-normal capitalize`}>{reservation?.payment_status}</span>
        //                 </div>
        //                 <button onClick={()=>{handleGoToLink(`/reservation?reservationId=${reservation._id}`)}} className='w-full text-center h-[42px] flex items-center justify-center bg-secondary text-white font-medium text-[14px]'>Use Shoot Mode</button>
        //             </div>
        //             </div>
        //         );
        //       })}
        //     </div>
        //   ) : (
        //     <div className="text-gray-500 text-center flex flex-col items-center justify-center">
        //       <Image height={150} width={150} src={Ghost} alt='' className=''/>
        //       <span>No reservations.</span>
        //     </div>
        //   )}
        // </div>
        <div className={`${loading ? "hidden" : ""} mx-2`}>
            {groupedReservations.length > 0 ? (
                <div className="space-y-4">
                {
                    groupedReservations.map((groupedReservation,groupIndex)=>{

                        return(
                            <div key={groupIndex} className='space-y-4'>
                                <div className='bg-primary-foreground h-[46px] flex items-center'>
                                    <span className='text-[13px] font-semibold'>{groupedReservation?.date}</span>
                                </div>
                                {groupedReservation.reservations.map((reservation,index) => {
                                    const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    });
                    
                                    const formattedStartTime = new Date(reservation.startTime).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    });
                    
                                    const formattedEndTime = new Date(reservation.endTime).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    });

                                    const userOther:User = reservation?.user_id?._id === userIdRef.current ? reservation?.user_id_2 : reservation?.user_id
                    
                                    return (
                                        <div key={index} className='space-y-2'>
                                        <div>
                                            <span className='text-[13px] font-semibold'>{formattedStartTime} - {formattedEndTime}</span>
                                        </div>
                                        <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden' key={index}>
                                            <div key={index} className="p-4 flex flex-wrap gap-2 justify-between items-center">
                                                <div className='flex flex-wrap items-center justify-start gap-2 min-w-[220px]'>
                                                    <div className=''>
                                                        <Image height={64} width={64} src={userOther?.profilePicture||userAvatar} alt='profile picture' className='h-[48px] w-[48px] rounded-full animate-in object-cover object-center' />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold">
                                                        {userOther?.firstName} {userOther?.lastName}
                                                        </p>
                                                        {/* <p className="text-sm text-gray-500">
                                                        {formattedDate} <br />({formattedStartTime} - {formattedEndTime})
                                                        </p> */}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-2 flex-wrap'>
                                                    {reservation.user_id_2?._id === userIdRef.current ? <button className='w-[100px] h-[30px] bg-primary text-white text-[9px] font-semibold flex items-center justify-center rounded-lg'>Edit Request</button>: <></>}
                                                    <button className='w-[100px] h-[30px] bg-primary text-white text-[9px] font-semibold flex items-center justify-center rounded-lg'>View Request</button>
                                                </div>
                                            </div>
                                            <div className='p-4 flex flex-row flex-wrap items-center justify-start gap-2 border-t'>
                                                <div>{locationIcon}</div>
                                                <div className='flex flex-col items-start justify-center'>
                                                    <span className='text-[11px] text-[#000000] font-semibold'>{reservation?.shootingLocation || "Shooting location not provided"}</span>
                                                    <span className='text-[10px] text-[#919191] font-normal'>This is shooting location</span>
                                                </div>
                                            </div>
                                            <div className='p-4 border-t'>
                                                <span className='text-[11px] font-medium'>Payment Status: </span><span className={`${reservation?.payment_status !== "completed" ? "text-red-500" : "text-green-500"} text-[12px] font-normal capitalize`}>{reservation?.payment_status}</span>
                                            </div>
                                            <button onClick={()=>{handleGoToLink(`/reservation?reservationId=${reservation._id}`)}} className='w-full text-center h-[42px] flex items-center justify-center bg-secondary text-white font-medium text-[14px]'>Use Shoot Mode</button>
                                        </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    })
                }
                </div>
                ) : (
                <div className="text-gray-500 text-center flex flex-col items-center justify-center">
                    <Image height={150} width={150} src={Ghost} alt='' className=''/>
                    <span>No reservations.</span>
                </div>
            )}
        </div>
        }

      </div>

    

    </div>
  )
}

export default UpcomingList

const locationIcon = <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.69025 0.844677C5.86993 0.947802 4.97462 1.22437 4.21993 1.60405C1.41681 3.0103 -0.219128 6.01968 0.123059 9.13218C0.394934 11.6072 1.82462 14.6634 4.36056 18.1931C5.39181 19.6275 6.86368 21.4556 7.16368 21.6666C7.37462 21.8166 7.76837 21.8166 7.984 21.6666C8.16212 21.5353 9.11368 20.4103 9.84962 19.4494C12.9621 15.3947 14.7152 11.8931 15.0199 9.13218C15.2684 6.86811 14.4856 4.63686 12.8731 3.0103C11.8043 1.93686 10.4965 1.23843 9.00118 0.938427C8.45743 0.830614 7.21993 0.779053 6.69025 0.844677ZM8.74337 2.4103C11.1574 2.92593 12.9856 4.76343 13.4637 7.15874C13.5762 7.72593 13.5762 8.87436 13.4637 9.43686C12.9949 11.7853 11.4387 14.8322 9.11837 17.9306C8.59337 18.6291 7.66993 19.7447 7.59025 19.7681C7.51993 19.7916 6.53556 18.615 5.85587 17.6962C3.6715 14.7478 2.11056 11.6681 1.68868 9.46499C1.56681 8.82749 1.54806 8.0728 1.63712 7.45405C2.03556 4.73999 4.16368 2.67749 6.91525 2.32593C7.24337 2.28374 8.40118 2.33999 8.74337 2.4103Z" fill="#FF9F1C"/>
<path d="M7.03242 5.34475C6.41367 5.476 5.91211 5.74787 5.4668 6.19319C5.10586 6.55412 4.89492 6.88694 4.72617 7.36975C4.61836 7.66506 4.59961 7.78694 4.59961 8.29787C4.59961 8.8135 4.61367 8.926 4.72148 9.226C4.89492 9.7135 5.11055 10.051 5.46211 10.4072C6.64805 11.5885 8.49961 11.5932 9.68555 10.4119C10.6512 9.44631 10.8434 7.96975 10.1637 6.79787C9.80742 6.1885 9.12773 5.64475 8.46211 5.43381C8.11992 5.326 7.3418 5.27444 7.03242 5.34475ZM8.21836 6.94319C8.49961 7.08381 8.81836 7.40256 8.94492 7.67912C9.09023 7.9885 9.09023 8.60725 8.94961 8.91194C8.8043 9.22131 8.5418 9.49319 8.23711 9.64319C8.00742 9.75569 7.91367 9.77444 7.57148 9.77444C7.10273 9.77444 6.82617 9.66662 6.5168 9.35725C6.21211 9.04787 6.09961 8.76662 6.09961 8.29787C6.09961 7.96975 6.11836 7.85725 6.21211 7.66506C6.40898 7.26194 6.78867 6.95256 7.21992 6.84006C7.45898 6.77444 7.98398 6.83069 8.21836 6.94319Z" fill="#FF9F1C"/>
</svg>
