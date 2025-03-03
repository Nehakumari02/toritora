"use client"
import { backIcon } from '@/constants/icons';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function Toritai() {
  const { toast } = useToast();
  const router = useRouter();


  const handleGoBack = () => {
    router.back();
  }

  return (
    <div className='no-scrollbar flex flex-col h-full'>
      <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Toritai</span>
      </header>

      <div className='overflow-y-scroll space-y-4 max-w-[800px] md:mx-auto my-6 mx-4 flex-1 no-scrollbar mb-4'>
        <span className='font-normal text-[14px] leading-[21px] text-[#777777]'>Please read it carefully to clearly understand</span>
        <div className={`space-y-2`}>
            <span className='font-medium text-[14px] leading-[21px] text-[#111111]'>What&apos;s Toritai?</span>
            <p className='font-normal text-[12px] leading-[21px] text-[#777777]'>What do you want to take/be photographed? I want to shoot / want to be taken, I want to shoot! It is a unique function of toritora that was born after hearing that it was difficult to make a reservation even if there was such a feeling. You can appeal to the other party how you want to shoot and want to be photographed. If you want to be photographed or photographed, you can only send it to the same person once. In addition, since it is a function that conveys feelings in sentences rather than just &quot;Like&quot;, the person sending it should have a strong desire to shoot. If you want to take a picture or want to be taken, please consider taking a picture positively.</p>
        </div>
        <div className={`space-y-2`}>
            <span className='font-medium text-[14px] leading-[21px] text-[#111111]'>You can only send once to same person ?</span>
            <p className='font-normal text-[12px] leading-[21px] text-[#777777]'>How to send/receive? If you want to be photographed or photographed, you can send it from the I want to be photographed / I want to be photographed button on the empty profile. In addition, you can check the history of sending and receiving from My Page for the history of wanting to shoot and be shot.</p>
        </div>
      </div>
    </div>
  )
}