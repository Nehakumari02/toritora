"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useTranslations } from 'next-intl';

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

function Statistics() {
  const router = useRouter();
  const t = useTranslations("MyPage.financePage.statisticsPage")
  const [fundsAvailable, setFundsAvailable] = useState(0);
  const [totalFundsAvailable, setTotalFundsAvailable] = useState(1615720);

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const newAmount = Math.round((step / 20) * totalFundsAvailable);
      setFundsAvailable(newAmount);

      if (step >= 20) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=''>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("statistics")}</span>
      </header>
      <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] my-8 space-y-8'>
        <span className='text-[16px] font-medium'>{t("graphicalRepresentaion")}</span>
        <div className='space-y-4'>
          <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 rounded-lg flex flex-wrap items-center justify-between'>
            <div className='flex flex-col items-start gap-2'>
              <span className='text-[12px] font-semibold text-[#999999]'>{t("totalEarnings")}</span>
              <span className='text-[10px] font-normal text-[#999999]'>Jan 2023</span>
            </div>
            <div className='flex flex-col items-end gap-2'>
              <span className='text-[20px] leading-[30px] font-semibold text-[#1C1C1C]'>￥{fundsAvailable.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className='shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-lg p-4'>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar className='hover:fill-[#2EC4B6B2]' dataKey="desktop" fill="#F0F0F0" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

export default Statistics