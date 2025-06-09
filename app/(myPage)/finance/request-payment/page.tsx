"use client"
import { airplanIcon, backIcon, graphIcon, walletIcon } from '@/constants/icons';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer"
import { DialogTitle } from '@radix-ui/react-dialog';
import greenTick from '@/public/images/common/greenTick.png';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

function RequestPayment() {
  const router = useRouter();
  const t = useTranslations("MyPage.financePage.sendRequestPage")
  const [fundsAvailable, setFundsAvailable] = useState(1348023404);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  const handleRemittance = async () => {
    setConfirmationPopup(false);
    if (transferAmount === 0) {
      toast({
        title: "Error",
        description: "Transfer amount can't be 0 JPY.",
        variant: "destructive"
      })
      return;
    }
    else if (transferAmount > fundsAvailable) {
      toast({
        title: "Error",
        description: "Transfer amount exceeds available amount.",
        variant: "destructive"
      })
      return;
    }
    else if (transferAmount > 1000000) {
      toast({
        title: "Error",
        description: "Transfer amount can't be greater than 1,000,000 JPY.",
        variant: "destructive"
      })
      return;
    }

    setLoading(true)
    try {

    } catch (error) {

    } finally {
      setLoading(false);
      setReqSent(true);
    }
  }

  if(reqSent)
    return(
      <div className='absolute bg-white h-full w-full flex flex-col gap-24 items-center justify-center'>
        <div className='w-full flex flex-col gap-8 items-center justify-center'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <Image src={greenTick} alt='Success' className='w-[100px] aspect-square'/>
            <span className='font-semibold text-[14px] leading-[20px] text-[#999999]'>{t("requestSentSuccess")}</span>
          </div>
          <div className='flex flex-col items-center justify-center px-4'>
            <span className='text-center font-semibold text-[18px] leading-[27px] text-[#111111]'>{t("requestSentMessage")}</span>
          </div>

          <div className='border-t-[1px] max-w-[40px] w-[20%]'></div>
        </div>

        <div className='space-y-4 px-4 text-center'>
        <span className='font-medium text-[12px] text-[#999999]'>{t("paymentInfo")}</span>
        <button onClick={handleGoBack} className='w-full h-[54px] text-[14px] leading-[21px] font-medium text-center flex items-center justify-center text-secondary rounded-md'>Go back</button>
        </div>
      </div>
    )

  return (
    <div className='flex flex-col h-full overflow-y-scroll no-scrollbar'>
      <header className="sticky top-0 flex-shrink-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("sendRequest")}</span>
      </header>
      <div className='mx-4 flex-1 md:mx-auto md:max-w-[800px] md:w-full my-8 space-y-8'>

        <div className='space-y-4'>
          <div className='space-y-1'>
            <span className='text-[13px] font-normal text-[#111111]'>{t("warn")}</span>
            <div className=''>
              <ul className='list-disc pl-4'>
                <li><span className='text-[14px] block font-normal text-[#777777]'>{t("warn1")}</span></li>
                <li><span className='text-[14px] block font-normal text-[#777777]'>{t("warn2")}</span></li>
              </ul>
            </div>
          </div>
          <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 rounded-lg flex flex-wrap items-center justify-between'>
            <div className='flex flex-col items-start gap-2'>
              <span className='text-[12px] font-semibold text-[#999999]'>{t("availableBalance")}</span>
            </div>
            <div className='flex flex-col items-end gap-2'>
              <span className='text-[20px] leading-[30px] font-semibold text-[#1C1C1C]'>￥{fundsAvailable.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='text-[16px] font-medium'>{t("transferAmount")}</span>
          <input type="text" pattern="[0-9]{5}" value={transferAmount} placeholder='Enter your amount'
            className='border px-5 py-3 rounded-lg h-12 text-[16px] font-normal text-[#333333]'
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setTransferAmount(Number(value));
              }
            }}
          />
          <span className='text-[12px] font-normal text-[#111111]'>{t("transferWarn")}</span>
        </div>

      </div>
      <div className='mx-4 my-16 md:mx-auto md:max-w-[800px] md:w-full'>
        <button onClick={() => { setConfirmationPopup(true) }} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loading ? <Loader2 className='animate-spin' /> : t("remittanceRequest")}</button>
      </div>
      <Drawer open={confirmationPopup} onOpenChange={setConfirmationPopup}>
        <DrawerContent>
          <DrawerHeader className='flex items-center justify-between'>
            <DialogTitle className='hidden'></DialogTitle>
          </DrawerHeader>
          <div className='space-y-8 mx-2 md:max-w-[800px] md:w-full md:mx-auto'>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <span className='font-medium block text-center text-[16px] leading-[24px]'>{t("confirmSendRequest")}</span>
                <span className='font-normal block text-center text-[12px] leading-[24px] text-[#313634]'>{t("cancelSendRequest")}</span>
              </div>

              <div className='flex items-center justify-between flex-wrap'>
                <button onClick={() => { setConfirmationPopup(false) }} className='w-[40%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-white flex items-center justify-center border text-[#ADB2B9] rounded-md'>{t("no")}</button>
                <button onClick={handleRemittance} className='w-[40%] mx-auto h-[54px] text-[16px] leading-[24px] font-medium text-center bg-secondary flex items-center justify-center text-white rounded-md' >{t("yes")}</button>
              </div>
            </div>
          </div>
          <DrawerFooter className=''>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default RequestPayment