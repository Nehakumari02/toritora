"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import greenTick from '@/public/images/common/greenTick.png';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl'

function SuccessPage() {
  const t = useTranslations('Payment');
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent");
  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Verifying payment...");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!payment_intent) return;

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ paymentIntentId: payment_intent }),
        });

        const data = await response.json();
        console.log(data)
        if (response.ok && data.success) {
          setAmount(data.amount)
          setStatus('Payment verified successfully! ✅');
        } else {
          setStatus('Payment verification failed ❌');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('Error verifying payment ❌');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [payment_intent]);

  return (
    <div className='absolute bg-white h-full w-full flex flex-col gap-8 items-center justify-center'>
      <div>
        <Image src={greenTick} alt='Success' className='w-[100px] aspect-square' />
      </div>

      {loading ? <>
        <span className='text-center font-semibold text-[13px] text-[#999999]'><Loader2 className='animate-spin' /></span>
      </> :
        <>
          <span className='text-center font-semibold text-[13px] text-[#999999]'>{t("congratulations")}</span>
          {/* <span className='px-4 text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>Your payment was successful</span> */}
        </>
      }

      <span className='px-4 text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>{status}</span>

      <div className='flex flex-col items-center justify-center space-y-2'>
        {!loading && <span className='px-4 text-center font-semibold text-[14px] text-[#111111]'>{t("amount")} - {amount} JPY</span>}
        <span className='px-4 text-center font-normal text-[12px] text-[#1C1C1C]'>{t("transaction_ref")}</span>
        <span className='px-4 text-center font-semibold text-[12px] text-primary'>{payment_intent}</span>
      </div>

      <div className='border-t-[1px] w-[20%]'></div>

      <div>
        <button onClick={() => handleGoToLink("/")} className='w-full h-[54px] text-[14px] leading-[21px] font-medium text-center flex items-center justify-center text-secondary rounded-md'>{t("go_home")}</button>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className='h-full w-full flex items-center justify-center'><Loader2 className='animate-spin' /></div>}>
      <SuccessPage />
    </Suspense>
  );
}


const greenTickIcon = <svg width="114" height="120" viewBox="0 0 114 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="mask0_153_186375" maskUnits="userSpaceOnUse" x="0" y="0" width="114" height="120">
    <path d="M56.9991 10L70.1028 19.559L86.3246 19.5291L91.3062 34.9652L104.447 44.4743L99.4059 59.8904L104.447 75.3065L91.3062 84.8157L86.3246 100.252L70.1028 100.222L56.9991 109.781L43.8953 100.222L27.6735 100.252L22.6919 84.8157L9.55078 75.3065L14.5922 59.8904L9.55078 44.4743L22.6919 34.9652L27.6735 19.5291L43.8953 19.559L56.9991 10Z" fill="white" stroke="white" strokeWidth="19.0059" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M39.543 59.8867L52.0156 72.3593L76.9608 47.4141" fill="white" />
    <path d="M39.543 59.8867L52.0156 72.3593L76.9608 47.4141" stroke="black" strokeWidth="19.0059" strokeLinecap="round" strokeLinejoin="round" />
  </mask>
  <g mask="url(#mask0_153_186375)">
    <path d="M-0.429688 0.015625H119.307V119.753H-0.429688V0.015625Z" fill="#2EC458" />
    <path d="M39.4863 62.646L50.6337 73.7934L72.9283 49.9062" stroke="white" strokeWidth="6.82489" strokeLinecap="round" strokeLinejoin="round" />
  </g>
</svg>
