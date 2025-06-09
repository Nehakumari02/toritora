"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { backIcon } from '@/constants/icons';
import { useLogout } from '@/lib/logout';
import { acceptRequest, deleteRequest, fetchRequests } from '@/lib/requestHandler';
import { Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Ghost from '@/public/images/mypage/ghost.gif'
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import { useTranslations } from 'use-intl';

interface User {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
}

interface BookingRequestRecieved {
  _id: string;
  slot_id: string;
  user_id: string;
  user_id_2: User;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;

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
}

interface BookingRequestSent {
  _id: string;
  slot_id: string;
  user_id: User;
  user_id_2: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;

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
}

function ShootingRequestList() {
  const router = useRouter();
  const t = useTranslations("MyPage.shootingRequestListPage")
  const [selectedMode,setSelectedMode] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sentRequests,setSentRequests] = useState<BookingRequestSent[]>([]);
  const [recievedRequests,setRecievedRequests] = useState<BookingRequestRecieved[]>([]);
  const [reqLoading,setReqLoading] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const handleToggleExpand = (requestId: string) => {
    setExpandedRequest((prevState) => (prevState === requestId ? null : requestId));
  };

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  const logout = useLogout();

  const handleAction = async (action: "accept" | "reject" | "cancel", requestId: string): Promise<void> => {
    console.log(`Action: ${action}, Request ID: ${requestId}`);
    
    try {
      setReqLoading(true)
      if(action === "accept"){
        const data = await acceptRequest(requestId,logout);
        if(data.status === 200){
          const updatedData = {status: "approved"}
          setRecievedRequests(prevRequests =>
            prevRequests.map(request =>
                request._id === requestId ? { ...request, ...updatedData } : request
            )
          );
          toast ({
            title:"Success",
            description:`${data?.message}`,
            variant:"success"
          })
        } else {
          toast ({
            title:"Error",
            description:`${data?.message}`,
            variant:"destructive"
          })
        }
      } else if(action === "reject"){
        const data = await deleteRequest(requestId,"receiver",logout);
        if(data.status === 200){
          const updatedData = {status: "rejected"}
          setRecievedRequests(prevRequests =>
            prevRequests.map(request =>
                request._id === requestId ? { ...request, ...updatedData } : request
            )
          );
          toast ({
            title:"Success",
            description:`${data?.message}`,
            variant:"success"
          })
        } else {
          toast ({
            title:"Error",
            description:`${data?.message}`,
            variant:"destructive"
          })
        }
      } else if(action === "cancel"){
        const data = await deleteRequest(requestId,"sender",logout);
        if(data.status === 200){
          const updatedData = {status: "cancelled_by_sender"}
          setRecievedRequests(prevRequests =>
            prevRequests.map(request =>
                request._id === requestId ? { ...request, ...updatedData } : request
            )
          );
          toast ({
            title:"Success",
            description:`${data?.message}`,
            variant:"success"
          })
        } else {
          toast ({
            title:"Error",
            description:`${data?.message}`,
            variant:"destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title:"Server internal error",
        description:`Error: ${error}`,
        variant:"destructive"
      })
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
              const data = await fetchRequests(logout);
              setRecievedRequests(data?.received)
              setSentRequests(data?.sent)
              console.log("Booking Requests:", data);
          } catch (error:any) {
              // console.error("Error fetching booking requests:", error);
              toast({
                title: "Error",
                description: `Error fetching booking requests: ${error?.message}`,
                variant: "destructive"
              })
          } finally {
            setLoading(false);
          }
      };

      fetchData();
      setLoading(false)
  }, []);

  return (
    <div className='flex flex-col h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("shootingRequestList")}</span>
      </header>

      {/* Tab selector */}
      <div className='bg-primary-foreground my-4'>
        <div className='max-w-[800px] mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-center gap-[8px] transition-all duration-300'>
          <button onClick={()=>setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>{t("requestRecieved")}</button>
          <button onClick={()=>setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>{t("requestSent")}</button>
        </div>
      </div>

      <div className='py-6 overflow-y-scroll max-w-[800px] w-full mx-auto flex-1 no-scrollbar'>

        {selectedMode === 0 &&
        <div className={`${loading ? "hidden" : ""} mx-2`}>
          {recievedRequests.length > 0 ? (
            <div className="space-y-4">
              {recievedRequests.map((request,index) => {
                const formattedDate = new Date(request.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                const formattedStartTime = new Date(request.startTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const formattedEndTime = new Date(request.endTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const isExpanded = expandedRequest === request._id;

                return (
                  <div
                    key={index}
                    className="shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-2 md:p-4 rounded-lg flex flex-wrap gap-2 justify-between items-center"
                  >
                    <div className='flex flex-wrap items-center justify-start gap-2 min-w-[220px]'>
                      <div className=''>
                        <Image height={64} width={64} src={request.user_id_2?.profilePicture||userAvatar} alt='profile picture' className='h-[48px] w-[48px] rounded-full animate-in object-cover object-center' />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">
                          {request.user_id_2?.firstName || "Toritora User"} {request.user_id_2?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formattedDate} <br />({formattedStartTime} - {formattedEndTime})
                        </p>
                      </div>
                    </div>
                    <div className="space-x-2 min-w-[90px]">
                      {request.status === "pending" &&
                        <>
                          <button
                            className="border border-green-500 bg-green-50 text-white px-2 py-2 rounded-full"
                            onClick={() => handleAction("accept", request._id)}
                          >
                            <Check color="green" size={20} /> 
                          </button>
                          <button
                            className="border border-red-500 bg-red-50 text-white px-2 py-2 rounded-full"
                            onClick={() => handleAction("reject", request._id)}
                          >
                            <X color="red" size={20} /> 
                          </button>
                        </>
                      }
                      {request.status === "approved" && <span className='text-right font-semibold text-[16px] leading-[24px] text-green-500'>{t("accepted")}</span>}
                      {request.status === "rejected" && <span className='text-right font-semibold text-[16px] leading-[24px] text-red-500'>{t("rejected")}</span>}
                      {request.status === "cancelled_by_sender" && <span className='text-right font-semibold text-[16px] leading-[24px] text-red-500'>{t("cancelled")}</span>}
                    </div>

                      <div className='w-full flex justify-end'>
                        <button onClick={() => handleToggleExpand(request._id)} className='underline'>{isExpanded?t("hideDetails"):t("showDetails")}</button>
                      </div>
                      <div className={`w-full p-4 border-t space-y-4 border-gray-200 ${isExpanded?"":"hidden"}`}>
                        <div className=''>
                          <span className='text-[14px] font-semibold'>{t("normalOccasion")}</span>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shootingPlace")}:</span> {request?.shootingPlace || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shootingLocation")}:</span> {request?.shootingLocation || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("meetingPoint")}:</span> {request?.meetingPoint || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shootingConcept")}:</span> {request?.shootingConcept || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("clothingType")}:</span> {request?.clothingType || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shoesType")}:</span> {request?.shoesType || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("itemsType")}:</span> {request?.itemsType || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("makeupType")}:</span> {request?.makeUpType || "N/A" }</p>
                        </div>
                        <div className=''>
                          <span className='text-[14px] font-semibold'>{t("rainyOccasion")}</span>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shootingPlace")}:</span> {request?.shootingPlaceRainy || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shootingLocation")}:</span> {request?.shootingLocationRainy || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("meetingPoint")}:</span> {request?.meetingPointRainy || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shootingConcept")}:</span> {request?.shootingConceptRainy || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("clothingType")}:</span> {request?.clothingTypeRainy || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("shoesType")}:</span> {request?.shoesTypeRainy || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("itemsType")}:</span> {request?.itemsTypeRainy || "N/A" }</p>
                          <p className='text-[12px] text-[#777777] font-normal'><span className='text-[14px] text-[#111111] font-medium'>{t("makeupType")}:</span> {request?.makeUpTypeRainy || "N/A" }</p>
                        </div>
                      </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center flex flex-col items-center justify-center">
              <Image height={150} width={150} src={Ghost} alt='' className=''/>
              <span>{t("noReceivedRequests")}</span>
            </div>
          )}
        </div>
        }

        {selectedMode === 1 &&
        <div className={`${loading ? "hidden" : ""} mx-2`}>
          {sentRequests.length > 0 ? (
            <div className="space-y-4">
              {sentRequests.map((request,index) => {
                const formattedDate = new Date(request.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                const formattedStartTime = new Date(request.startTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const formattedEndTime = new Date(request.endTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                <div
                  key={index}
                  className="shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-2 md:p-4 rounded-lg flex flex-wrap gap-2 justify-between items-center"
                >
                  <div className='flex flex-wrap items-center justify-start gap-2 min-w-[220px]'>
                    <div className=''>
                      <Image height={64} width={64} src={request.user_id?.profilePicture||userAvatar} alt='profile picture' className='h-[48px] w-[48px] rounded-full animate-in object-cover object-center' />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {request.user_id?.firstName || "Toritora User"} {request.user_id?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formattedDate} <br />({formattedStartTime} - {formattedEndTime})
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2 min-w-[90px]">
                    {request.status === "pending" &&
                      <>
                        <button
                          className="border border-red-500 bg-red-50 text-white px-2 py-2 rounded-full"
                          onClick={() => handleAction("cancel", request._id)}
                        >
                          <X color="red" size={20} /> 
                        </button>
                      </>
                    }
                    {request.status === "approved" && <span className='text-right font-semibold text-[16px] leading-[24px] text-green-500'>{t("accepted")}</span>}
                    {request.status === "rejected" && <span className='text-right font-semibold text-[16px] leading-[24px] text-red-500'>{t("rejected")}</span>}
                    {request.status === "cancelled_by_sender" && <span className='text-right font-semibold text-[16px] leading-[24px] text-red-500'>{t("cancelled")}</span>}
                  </div>
                </div>);
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center flex flex-col items-center justify-center">
              <Image height={150} width={150} src={Ghost} alt='' className=''/>
              <span>{t("noSentRequests")}</span>
            </div>
          )}
        </div>
        }

      </div>

    </div>
  )
}

export default ShootingRequestList