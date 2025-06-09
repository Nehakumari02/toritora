"use client"
import { airplanIcon, backIcon, graphIcon, walletIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useLogout } from '@/lib/logout';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';

function Wallet() {
  const router = useRouter();
  const t = useTranslations("MyPage.financePage.walletPage")
  const logout = useLogout();
  const {toast} = useToast();
  const [loading, setLoading] = useState(true);
  const [fundsAvailable, setFundsAvailable] = useState(0);
  const [totalFunds, setTotalFunds] = useState(0);
  const [transferedFunds, setTransferedFunds] = useState(0);
  const [history, setHistory] = useState<any>([])

  const [chartData, setChartData] = useState<any>([
    { balanceType: "Available Balance", visitors: fundsAvailable, fill: "#2EC4B6" },
    { balanceType: "Transfered", visitors: transferedFunds, fill: "#FF9F1C" },
  ]);

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  useEffect(() => {
    try {
      const fetchEarningHistory = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/earnings`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include",
          });

          if (res.status === 200) {
            const data = await res.json();
            setTotalFunds(data.total_earned);
            setTransferedFunds(data.total_withdrawn);
            setFundsAvailable(data.total_earned-data.total_withdrawn);
          }
          else if (res.status === 401) {
            toast({
              title: "Error",
              description: "Unauthorized request",
              variant: "destructive"
            })
            logout();
          }
          else {
            const data = await res.json();
            toast({
              title: "Internal server error",
              description: `Error: ${data.message}`,
              variant: "destructive"
            })
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: `Error during fetch: ${error.message}`,
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
      fetchEarningHistory();
      const fetchPaymentHistory = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/payment`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include",
          });

          if (res.status === 200) {
            const data = await res.json();
            const userIdStr = data.userId;
            const transactions = data.transactions;
            const modifiedTransactions = transactions.map((txn: any) => ({
              amount: txn.amount,
              date: txn.createdAt,
              type: txn.sender_id.toString() === userIdStr ? 'debit' : 'credit',
            }));
            setHistory(modifiedTransactions);
          }
          else if (res.status === 401) {
            toast({
              title: "Error",
              description: "Unauthorized request",
              variant: "destructive"
            })
            logout();
          }
          else {
            const data = await res.json();
            toast({
              title: "Internal server error",
              description: `Error: ${data.message}`,
              variant: "destructive"
            })
          }
        } catch (error: any) {
          toast({
            title: "Error",
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
    setChartData([
      { balanceType: "Available Balance", visitors: fundsAvailable, fill: "#2EC4B6" },
      { balanceType: "Transfered", visitors: transferedFunds, fill: "#FF9F1C" },
    ]);
  }, [fundsAvailable, transferedFunds, totalFunds]);

  return (
    <div className='h-full overflow-scroll no-scrollbar'>
      <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("myWallet")}</span>
      </header>
      <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] my-8 space-y-8'>
        <div className="mx-auto min-w-52 space-y-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-xl">
          <ChartContainer config={{}} className="mx-auto flex h-full w-full items-center justify-center aspect-square max-h-72 min-h-52">
            {loading ?
              <Loader2 className='animate-spin p-8' /> :
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            {/* <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              Visitors
                            </tspan> */}
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            }
          </ChartContainer>
          <div className="flex flex-col px-4 items-center">
            {/* <span className="text-center text-[26px] font-bold text-[#1C1C1C] leading-[30px]">￥ {fundsAvailable.toLocaleString()}</span> */}
            {loading ? (
              <span className="h-[26px] w-40 bg-gray-200 animate-pulse rounded-lg"></span>
            ) : (
              <span className="text-center text-[26px] font-bold text-[#1C1C1C] leading-[30px]">
                ￥ {fundsAvailable?.toLocaleString()}
              </span>
            )}
            <span className='text-center text-[12px] leading-[30px] text-[#999999] font-semibold'>{t("availableFunds")}</span>
          </div>
          <div className='flex items-center justify-around'>
            {/* <div className="flex flex-col px-4">
              <span className='text-center text-[12px] text-[#999999] font-semibold'>Transfered</span>
              <span className="text-center text-[15px] font-bold text-primary">￥ {transferedFunds.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className='text-center text-[12px] text-[#999999] font-semibold'>Total</span>
              <span className="text-center text-[15px] font-bold text-secondary">￥ {totalFunds.toLocaleString()}</span>
            </div> */}
            <div className="flex flex-col px-4">
              <span className='text-center text-[12px] text-[#999999] font-semibold'>{t("transfered")}</span>
              {loading ? (
                <span className="h-[15px] w-24 bg-gray-200 animate-pulse rounded-lg"></span>
              ) : (
                <span className="text-center text-[15px] font-bold text-primary">￥ {transferedFunds?.toLocaleString()}</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className='text-center text-[12px] text-[#999999] font-semibold'>{t("total")}</span>
              {loading ? (
                <span className="h-[15px] w-24 bg-gray-200 animate-pulse rounded-lg"></span>
              ) : (
                <span className="text-center text-[15px] font-bold text-secondary">￥ {totalFunds?.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-[16px] font-medium'>{t("history")}</span>
            <Link className='text-[13px] font-medium text-[#999999] underline' href={'/finance/wallet/transfer-history'}>{t("viewAll")}</Link>
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
                        <span className='text-[14px] font-semibold'>{t("amountTransfered")}</span>
                        <span className='text-[11px] font-normal text-[#999999]'>{t("transferMoneyToBank")}</span>
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
    </div>
  )
}

export default Wallet