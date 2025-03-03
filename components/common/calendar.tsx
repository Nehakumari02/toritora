"use client"
import React, { useEffect, useState } from 'react'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfDay,
  startOfToday,
} from 'date-fns'
import { cn } from '@/lib/utils'

function Calendar( {selectedDay, setSelectedDay}:{ selectedDay:Date, setSelectedDay:(date:Date)=>void } ) {
  let today = startOfToday()
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  let [previousMonthDisabled,setPreviousMonthDisabled] = useState(true)

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  const leftIcon = <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.7163 17.75L11.0185 13.3132L15.7163 8.87637" 
  stroke={previousMonthDisabled?"#999999":"#2EC4B6"}
  strokeWidth="2.08791" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

  const rightIcon = <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.2495 17.75L14.9473 13.3132L10.2495 8.87637" stroke="#2EC4B6" strokeWidth="2.08791" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

  useEffect(() => {
    const todayMonth = format(today, 'MMM-yyyy');
    const isSameMonth = currentMonth === todayMonth;
    setPreviousMonthDisabled(isSameMonth);
  }, [today,currentMonth]);

  return (
    <div className="m-2 p-2">
        <div className="flex items-center">
            <h2 className="flex-auto font-semibold text-gray-900">
            {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </h2>
            <button
            type="button"
            onClick={previousMonth}
            disabled={previousMonthDisabled}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
            <span className="sr-only">Previous month</span>
            {leftIcon}
            </button>
            <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
            <span className="sr-only">Next month</span>
            {rightIcon}
            </button>
        </div>
        <div className="grid grid-cols-7 mt-2 font-semibold text-center text-[15px] leading-[25px] text-[#111111]">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sat</div>
        </div>
        <div className="grid grid-cols-7 mt-2 text-sm">
            {days.map((day, dayIdx) => (
            <div
                key={day.toString()}
                className={cn(
                dayIdx === 0 && colStartClasses[getDay(day)],
                )}
            >
                <button
                type="button"
                onClick={() => setSelectedDay(day)}
                disabled={isBefore(day, startOfDay(new Date()))}
                className={cn(
                    isEqual(day, selectedDay) && 'text-white',
                    isEqual(day, selectedDay) && isToday(day) && 'text-secondary',
                    !isEqual(day, selectedDay) &&
                    isToday(day) &&
                    'text-secondary',
                    !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    'text-gray-900',
                    getDay(day) === 0 && 'text-[#999999]',
                    isBefore(day, startOfDay(new Date())) && 'text-[#999999]',
                    isEqual(day, selectedDay) && 'text-white',
                    isEqual(day, selectedDay) && isToday(day) && 'text-secondary',
                    !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    'text-gray-400',
                    isEqual(day, selectedDay) && isToday(day) && 'bg-[#CBF3F0]',
                    isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    'bg-secondary',
                    !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                    (isEqual(day, selectedDay) || isToday(day)) &&
                    'font-semibold',
                    'mx-auto flex h-8 md:h-10 w-8 md:w-14 items-center justify-center rounded-full font-medium text-center text-[15px] transition-all duration-300'
                )}
                >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                </time>
                </button>
            </div>
            ))}
        </div>
    </div>
  )
}

export default Calendar

let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
  ]