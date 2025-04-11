"use client"
import { backIcon, infoIcon } from '@/constants/icons';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import { useToast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import ToritaiSkeleton from '@/components/skeleton/toritoraSkeletion';
import greenTick from '@/public/images/common/greenTick.png';

function Toritai() {
  const router = useRouter();
  const logout = useLogout();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [disabled, setDisabled] = useState(true);
  const [sendingStatus, setSendingStatus] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const userId = searchParams.get("userId");
  const [fullName,setFullName] = useState("");
  const [displayPicture,setDisplayPicture] = useState("");
  const [formValues,setFormValues] = useState({
    "question1":"",
    "question2":""
  })

  const userIdRef = useRef<null|string>(null);

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  const handleInputChange = (field:string, value:string) => {
    const updatedFormValues = { ...formValues, [field]: value };
    setFormValues(updatedFormValues);
  };

  const handleSendMessage = async () => {
    try {
      setSendingStatus(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/toritai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({ 
          "user_id_2":userIdRef.current,
          "question1":formValues.question1,
          "question2":formValues.question2
      }),
      });

      const data = await res.json();

      if(res.status===201){
        toast({
          title:"Success",
          description:"Toritai sent successfully",
          variant:"success"
        })

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
    } catch (error) {
      console.log("Error", error)
    } finally {
      setSendingStatus(false)
      setMessageSent(true);
    }
  }

  useEffect(() => {
    const fullNameLS = searchParams.get('fullName') || ""
    const DP = searchParams.get("profileImage") || ""
    const userIdLS = searchParams.get("userId") || ""
    setFullName(fullNameLS)
    setDisplayPicture(DP)
    userIdRef.current = userIdLS

  }, [])

  useEffect(()=>{
    if(formValues.question1) setDisabled(false)
    else setDisabled(true)
  },[formValues])

  if(messageSent){
    return(
      <div className='absolute bg-white h-full w-full flex flex-col gap-24 items-center justify-center'>
        <div className='w-full flex flex-col gap-4 items-center justify-center'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <Image src={greenTick} alt='Success' className='w-[100px] aspect-square'/>
            <span className='font-semibold text-[14px] leading-[20px] text-[#999999]'>Congratulations..!!</span>
          </div>
          <div className='flex flex-col items-center justify-center px-4'>
            <span className='text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>Your message has been sent to</span>
            <span className=' text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>{fullName || "Toritora User"}</span>
          </div>

          <div className='border-t-[1px] max-w-[40px] w-[20%]'></div>
        </div>

        <div>
        <button onClick={handleGoBack} className='w-full h-[54px] text-[14px] leading-[21px] font-medium text-center flex items-center justify-center text-secondary rounded-md'>Go to Profile</button>
        </div>
      </div>
    )
  }

  return (
    <div className='no-scrollbar flex flex-col h-full'>
      <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Toritai</span>
        <Link href={"/userDetails/toritai/toritai-info"} className='h-11 w-11 flex items-center justify-center absolute top-[50%] translate-y-[-50%] right-4'>{infoIcon}</Link>
      </header>

      <div className='bg-[#FFBF691A] border-[1px] border-[#99999914] py-4 font-medium text-[12px] leading-[18px] text-[#777777] flex flex-col items-start justify-start px-4'>
        <div className='space-y-3 md:w-[800px] md:mx-auto'>
          <span className='font-medium text-[#111111] text-[13px]'>Tap on icon to know more about on</span>
          <div className='flex flex-col'>
            <ul className='list-disc pl-4'>
              <li><span>What&apos;s Toritai?</span></li>
              <li><span>You can only send once to same person</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className='overflow-y-scroll space-y-4 max-w-[800px] w-full md:mx-auto py-6 px-4 flex-1 no-scrollbar'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='h-[88px] w-[88px] rounded-full border-[2px] border-[#2EC4B626]'>
            {displayPicture === "" ?
            <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" className='h-full w-full rounded-full'/>
            :
            <Image src={displayPicture} alt="User" height={88} width={88} className='h-full w-full object-cover object-center rounded-full'/>
            }
          </div>
          <div className='flex flex-col'>
            <span className='text-center font-normal text-[16px]leading-[24px] text-[#022D47]'>Send a message to </span> <span className='text-center font-semibold text-[16px]leading-[24px] text-[#022D47]'>{fullName}</span>
          </div>
        </div>

        <div className={`space-y-8`}>
          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'> 1. Tell the reason why you want to shoot her/him?</span>
            <div
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300`}
            >
              <textarea
                value={formValues.question1}
                onChange={(e) => handleInputChange("question1", e.target.value)}
                className="outline-none w-full h-[90px] resize-none"
                placeholder="Enter your characters here"
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'> 2. If any Other Message <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>(optional)</span></span>
            <div
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300`}
            >
              <textarea
                value={formValues.question2}
                onChange={(e) => handleInputChange("question2", e.target.value)}
                className="outline-none w-full h-[90px] resize-none"
                placeholder="Enter your characters here"
              />
            </div>
          </div>
          <button onClick={handleSendMessage} disabled={disabled} className={`w-[calc(min(100%,800px))] h-[54px] text-[16px] leading-[24px] font-bold text-center flex items-center justify-center text-white rounded-md ${disabled ? "bg-[#999999]" : "bg-secondary"}`}>{sendingStatus?<Loader2 className='animate-spin'/>:"Send message"}</button>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<ToritaiSkeleton/>}>
      <Toritai />
    </Suspense>
  );
}