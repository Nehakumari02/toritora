"use client"
import { airplanIcon, backIcon, graphIcon, walletIcon } from '@/constants/icons';
import { toast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function TransferHistory() {
  const router = useRouter();
  const logout = useLogout();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [history, setHistory] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo,setPageNo] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [totalPages,setTotalPages] = useState(0);

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
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/payment?page=${pageNo}&limit=${pageSize}`, {
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
                  setTotalPages(data.totalPages);
                  setHasMore(pageNo<data.totalPages);
                  if(pageNo<data.totalPages)setPageNo(pageNo+1);
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
                setHasMore(false);
              } finally {
                setLoading(false)
              }
            }
            fetchPaymentHistory();
          } catch (error) {
            console.log("Error", error)
          }
        }, [])

  const loadMore = async () => {
    setLoadingMore(true);
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/payment?page=${pageNo}&limit=${pageSize}`, {
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
        setHistory([...history,...modifiedTransactions]);
        setTotalPages(data.totalPages);
        setHasMore(pageNo<data.totalPages);
        if(pageNo<data.totalPages)setPageNo(pageNo+1);
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
      setLoadingMore(false)
    }
  }

  return (
    <div className='overflow-y-scroll no-scrollbar h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Transfer History</span>
      </header>
      <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] my-4 space-y-4'>


        <div className="mx-auto min-w-52 space-y-4 py-4">
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-[16px] font-medium'>History</span>
            </div>
            <div className='space-y-4 py-4'>
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
                          <span className='text-[12px] font-normal text-[#999999]'>{format(item.date,'dd-MMM-yyyy')}</span>
                        </div>
                      </div>
                    )
                  }))
              }
              {
                loadingMore &&
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
              }
              {/* <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 rounded-lg flex flex-wrap items-center justify-between'>
                    <div className='flex flex-col items-start gap-2'>
                      <span className='text-[14px] font-semibold'>Amount Transfered</span>
                      <span className='text-[11px] font-normal text-[#999999]'>Transfer money to bank</span>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <span className='text-[14px] font-semibold text-[#2EC4B6]'>- ￥2200</span>
                      <span className='text-[12px] font-normal text-[#999999]'>Jan 18</span>
                    </div>
              </div>
              <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 rounded-lg flex flex-wrap items-center justify-between'>
                    <div className='flex flex-col items-start gap-2'>
                      <span className='text-[14px] font-semibold'>Amount Transfered</span>
                      <span className='text-[11px] font-normal text-[#999999]'>Transfer money to bank</span>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <span className='text-[14px] font-semibold text-[#E6492D]'>- ￥2200</span>
                      <span className='text-[12px] font-normal text-[#999999]'>Jan 18</span>
                    </div>
              </div> */}
            </div>
            <div>
              {!loading && hasMore && <button disabled={loadingMore} onClick={loadMore} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingMore ? <Loader2 className='animate-spin' /> : "Load more"}</button>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TransferHistory