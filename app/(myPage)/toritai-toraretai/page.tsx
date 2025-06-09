"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { backIcon } from '@/constants/icons';
import { useLogout } from '@/lib/logout';
import { toast } from '@/hooks/use-toast';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import Ghost from '@/public/images/mypage/ghost.gif'
import { useTranslations } from 'next-intl';

export interface SentToritai {
  _id: string;
  user_id: string;
  user_id_2: {
    firstName: string;
    lastName: string;
    profilePicture: string
  };
  question1: string;
  question2?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RecToritai {
  _id: string;
  user_id: {
    firstName: string;
    lastName: string;
    profilePicture: string
  };
  user_id_2: string;
  question1: string;
  question2?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


function Toritai() {
  const router = useRouter();
  const t = useTranslations("MyPage.toritaiToraretaiPage")
  const [selectedMode,setSelectedMode] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sentToritai,setSentToritai] = useState<{ [date: string]: SentToritai[] }>({});
  const [recievedToritai,setReceivedToritai] = useState<{ [date: string]: RecToritai[] }>({});

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  const logout = useLogout();

  const groupByDate = (records: any[]) => {
    return records.reduce((acc: { [date: string]: any[] }, record) => {
      const dateKey = new Date(record.createdAt).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(record);
      return acc;
    }, {});
  };

  useEffect(() => {
      try {
        const fetchToritai = async () => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/toritai`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials:"include",
          });
  
          const data = await res.json();
  
          if(res.status===200){
            const { sentToritai, receivedToritai } = data;

            setSentToritai(groupByDate(sentToritai));
            setReceivedToritai(groupByDate(receivedToritai));
            console.log(data)
  
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
  
        fetchToritai();
  
  
      } catch (error) {
        console.log("Error", error)
      } finally {
        setLoading(false)
      }
    }, [])

  return (
    <div className='flex flex-col h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("toritaiToraretai")}</span>
      </header>

      <div className='pb-6 overflow-y-scroll max-w-[800px] w-full mx-auto flex-1 bg-[#f8fcfd] no-scrollbar'>
        {/* Tab selector */}
        <div className='bg-primary-foreground my-4'>
          <div className='max-w-[800px] mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-center gap-[8px] transition-all duration-300'>
            <button onClick={()=>setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>{t("toritai")}</button>
            <button onClick={()=>setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>{t("toraretai")}</button>
          </div>
        </div>

        <div className={`${selectedMode === 0 ? "" : "hidden"} h-full pb-4 px-4`}>
          {Object.entries(recievedToritai)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, records]) => (
            <div key={date} className='space-y-4'>
              <h3 className='text-[12px] leading-[18px] font-medium text-[#999999]'>{date}</h3>
              {records.map((record) => (
                <div key={record._id} className='bg-white min-h-[108px] flex flex-col items-center justify-center w-full gap-4 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
                  <div className='flex items-center flex-wrap gap-4 w-full'>
                  <div className=''>
                    <Image height={64} width={64} src={record.user_id?.profilePicture||userAvatar} alt='profile picture' className='h-[54px] w-[54px] rounded-full animate-in object-cover object-center' />
                  </div>
                  <div className='flex flex-col items-start justify-center'>
                    <span className='text-[12px] leading-[18px] font-semibold text-[#111111]'>{record.user_id?.firstName} {record.user_id?.lastName}</span>
                    <span className='text-[12px] leading-[18px] font-semibold text-[#999999]'>{record.user_id?.firstName} {t("gaveThanks")}</span>
                  </div>

                  <button className='ml-auto font-semibold text-[11px] leading-[17px] text-white bg-secondary text-center w-[94px] h-[32px] rounded-sm'>{t("thanks")}</button>
                  </div>
                  <div className='flex flex-col items-start justify-center w-full'>
                    <span className='text-[12px] leading-[18px] font-semibold text-[#111111]'>{record.question1}</span>
                    <span className='text-[12px] leading-[18px] font-semibold text-[#999999]'>{record?.question2}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={`${selectedMode === 1 ? "" : "hidden"} h-full pb-4 px-4 space-y-6`}>
          {Object.entries(sentToritai)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, records]) => (
            <div key={date} className='space-y-4'>
              <h3 className='text-[12px] leading-[18px] font-medium text-[#999999]'>{date}</h3>
              {records.map((record) => (
                <div key={record._id} className='bg-white min-h-[108px] flex items-center flex-wrap gap-4 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
                  <div className=''>
                    <Image height={64} width={64} src={record.user_id_2?.profilePicture||userAvatar} alt='profile picture' className='h-[54px] w-[54px] rounded-full animate-in object-cover object-center' />
                  </div>
                  <div className='flex flex-col items-start justify-center'>
                    <span className='text-[12px] leading-[18px] font-semibold text-[#111111]'>{record.user_id_2?.firstName} {record.user_id_2?.lastName}</span>
                    <span className='text-[12px] leading-[18px] font-semibold text-[#999999]'>{t("youSentToraretai")}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Toritai