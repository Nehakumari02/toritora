"use client"
import { airplanIcon, backIcon, graphIcon, walletIcon } from '@/constants/icons';
import { useToast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {format} from 'date-fns'

function Finance() {
    const router = useRouter();
    const [offset, setOffset] = useState(100);
    const [percentage, setPercentage] = useState(0);
    const [finalPercentage, setFinalPercentage] = useState(0);
    const [fundsAvailable, setFundsAvailable] = useState(0);
    const [totalfundsAvailable, setTotalFundsAvailable] = useState(1615720);
    const [history,setHistory] = useState<any>([]);
    const [loading,setLoading] = useState(true);
    const logout = useLogout();
    const {toast} = useToast();

    const handleGoBack = () => {
        router.back();
    }

    const handleGoToLink = (route: string) => {
        router.push(route)
    }

    useEffect(() => {
        try {
          const fetchPaymentHistory = async () => {
            try{
              const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/payment`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials:"include",
              });
    
              if(res.status===200){
                const data = await res.json();
                const userIdStr = data.userId;
                const transactions = data.transactions;
                const modifiedTransactions = transactions.map((txn:any) => ({
                amount:txn.amount,
                date:txn.createdAt,
                type: txn.sender_id.toString() === userIdStr ? 'debit' : 'credit',
                }));
                setHistory(modifiedTransactions);
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
          fetchPaymentHistory();
        } catch (error) {
          console.log("Error", error)
        }
      }, [])

    useEffect(() => {
        try {
            setTotalFundsAvailable(1615720);
            setFinalPercentage(60);
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    },[])
    useEffect(() => {
        if (offset > 100 - finalPercentage) {
            setTimeout(() => {
                setOffset((prev) => prev - 1); // Reduce offset gradually
                setPercentage((prev) => prev + 1); // Increase percentage display
                setFundsAvailable(Math.round(((percentage + 1) / 100) * totalfundsAvailable));
            }, 30);
        }
    }, [offset, totalfundsAvailable, finalPercentage]);

    return (
        <div className='flex flex-col h-full overflow-y-scroll no-scrollbar'>
            <header className="sticky z-10 top-0 w-full flex-shrink-0 h-[72px] flex items-center justify-center bg-white shadow-lg">
                <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
                <span className="text-[16px] leading-[24px] text-center font-semibold">Finance</span>
            </header>
            <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] md:w-full my-8 space-y-8'>

                <div className="relative size-72 mx-auto">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" strokeWidth="0.6"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeDashoffset={offset} strokeWidth="0.6" strokeDasharray="100" strokeLinecap="round"></circle>
                        <circle cx="34" cy="18" r="1" fill="currentColor" className="text-primary"></circle>
                    </svg>

                    <div className="absolute w-[80%] flex flex-col top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <span className='text-center text-[12px] leading-[30px] text-[#999999] font-semibold'>Available funds</span>
                        <span className="text-center text-[26px] font-bold text-[#1C1C1C] leading-[30px]">￥ {" "} {fundsAvailable.toLocaleString()}</span>
                    </div>
                </div>

                <div className='flex items-center flex-wrap gap-2 justify-between'>
                    <div className='flex items-center justify-center flex-col gap-3 w-[90px]'> <button onClick={() => handleGoToLink("/finance/wallet")} className='h-[76px] w-[76px] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 active:scale-90'>{walletIcon}</button> <span className='block text-center text-[13px] font-medium'>My Wallet</span></div>
                    <div className='flex items-center justify-center flex-col gap-3 w-[90px]'> <button onClick={() => handleGoToLink("/finance/statistics")} className='h-[76px] w-[76px] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 active:scale-90'>{graphIcon}</button> <span className='block text-center text-[13px] font-medium'>Statistics</span></div>
                    <div className='flex items-center justify-center flex-col gap-3 w-[90px]'> <button onClick={() => handleGoToLink("/finance/request-payment")} className='h-[76px] w-[76px] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 active:scale-90'>{airplanIcon}</button> <span className='block text-center text-[13px] font-medium'>Send Request</span></div>
                </div>

                <div className='space-y-4 py-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-[16px] font-medium'>Recent</span>
                    <Link className='text-[13px] font-medium text-[#999999] underline' href={'/finance/wallet/transfer-history'}>View all</Link>
                </div>
                {
                    loading ?
                    <>
                        <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 gap-4 rounded-lg flex flex-wrap items-center justify-between'>
                        <div className='flex flex-col items-start gap-2'>
                            <span className='text-[14px] h-5 w-44 bg-gray-200 animate-pulse rounded-lg font-semibold'></span>
                            <span className='text-[11px] h-5 w-40 bg-gray-200 animate-pulse rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                            <span className='text-[14px] h-4 bg-gray-200 animate-pulse w-16 rounded-lg font-semibold text-[#E6492D]'></span>
                            <span className='text-[12px] h-4 bg-gray-200 animate-pulse w-12 rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        </div>
                        <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 gap-4 rounded-lg flex flex-wrap items-center justify-between'>
                        <div className='flex flex-col items-start gap-2'>
                            <span className='text-[14px] h-5 w-44 bg-gray-200 animate-pulse rounded-lg font-semibold'></span>
                            <span className='text-[11px] h-5 w-40 bg-gray-200 animate-pulse rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                            <span className='text-[14px] h-4 bg-gray-200 animate-pulse w-16 rounded-lg font-semibold text-[#E6492D]'></span>
                            <span className='text-[12px] h-4 bg-gray-200 animate-pulse w-12 rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        </div>
                        <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 gap-4 rounded-lg flex flex-wrap items-center justify-between'>
                        <div className='flex flex-col items-start gap-2'>
                            <span className='text-[14px] h-5 w-44 bg-gray-200 animate-pulse rounded-lg font-semibold'></span>
                            <span className='text-[11px] h-5 w-40 bg-gray-200 animate-pulse rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                            <span className='text-[14px] h-4 bg-gray-200 animate-pulse w-16 rounded-lg font-semibold text-[#E6492D]'></span>
                            <span className='text-[12px] h-4 bg-gray-200 animate-pulse w-12 rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        </div>
                        <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 gap-4 rounded-lg flex flex-wrap items-center justify-between'>
                        <div className='flex flex-col items-start gap-2'>
                            <span className='text-[14px] h-5 w-44 bg-gray-200 animate-pulse rounded-lg font-semibold'></span>
                            <span className='text-[11px] h-5 w-40 bg-gray-200 animate-pulse rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                            <span className='text-[14px] h-4 bg-gray-200 animate-pulse w-16 rounded-lg font-semibold text-[#E6492D]'></span>
                            <span className='text-[12px] h-4 bg-gray-200 animate-pulse w-12 rounded-lg font-normal text-[#999999]'></span>
                        </div>
                        </div>
                    </>
                    :
                    (history.map((item: any, index: any) => {
                        return (
                        <div key={index} className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 gap-4 rounded-lg flex flex-wrap items-center justify-between'>
                            <div className='flex flex-col items-start gap-2'>
                            <span className='text-[14px] font-semibold'>Amount Transfered</span>
                            <span className='text-[11px] font-normal text-[#999999]'>Transfer money to bank</span>
                            </div>
                            <div className='flex flex-col items-end gap-2'>
                            <span className={`text-[14px] font-semibold ${item.type === "credit" ? "text-[#2EC4B6]" : "text-[#E6492D]"}`}>￥ {item.amount}</span>
                            <span className='text-[12px] font-normal text-[#999999]'>{format(item.date, 'yyyy-MMM-dd')}</span>
                            </div>
                        </div>
                        )
                    }))
                }
                </div>

            </div>
        </div>
    )
}

export default Finance