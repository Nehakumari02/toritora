import { backIcon, infoIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"

export default function ToritaiSkeleton(){
    return(
      <div className='no-scrollbar flex flex-col h-full'>
        <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
          <button className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
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
              <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" className='h-full w-full rounded-full'/>
            </div>
            <div className='flex flex-col'>
              <span className='text-center font-normal text-[16px]leading-[24px] text-[#022D47]'>Send a message to </span> <span className='text-center font-semibold text-[16px]leading-[24px] text-[#022D47]'>Toritora User</span>
            </div>
          </div>
  
          <div className={`space-y-8`}>
            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'> 1. Tell the reason why you want to shoot her/him?</span>
              <div
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300`}
              >
                <textarea
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
                  className="outline-none w-full h-[90px] resize-none"
                  placeholder="Enter your characters here"
                />
              </div>
            </div>
            <button className={`w-[calc(min(100%,800px))] h-[54px] text-[16px] leading-[24px] font-bold text-center flex items-center justify-center text-white rounded-md bg-[#999999]`}>Send message</button>
          </div>
        </div>
      </div>
    )
  }