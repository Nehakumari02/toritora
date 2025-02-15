"use client"
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DialogTitle } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react'
import {cn} from '@/lib/utils'
import { locationIcon } from '@/constants/icons'

interface MeetingProps {
  id: number;
  name: string;
  imageUrl: string;
  startDatetime: string;
  endDatetime: string;
}

interface Props {
  meeting: MeetingProps;
  index:number;
}

const meetings: MeetingProps[] = [
  {
    id: 1,
    name: 'ABC Kikaku Event',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-02-15T13:00',
    endDatetime: '2025-02-15T14:30',
  },
  {
    id: 2,
    name: 'CDF Satueikai Event',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-02-15T09:00',
    endDatetime: '2025-02-15T11:30',
  },
  {
    id: 3,
    name: 'ABC Kikaku Event',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-02-17T17:00',
    endDatetime: '2025-02-17T18:30',
  },
  {
    id: 4,
    name: 'CDF Satueikai Event',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-02-17T13:00',
    endDatetime: '2025-02-17T14:30',
  },
  {
    id: 5,
    name: 'ABC Kikaku Event',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-02-15T14:00',
    endDatetime: '2025-02-15T14:30',
  },
]

export default function Calendar() {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
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

  let selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  )

  const leftIcon = <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.7163 17.75L11.0185 13.3132L15.7163 8.87637" stroke={previousMonthDisabled?"#999999":"#2EC4B6"} strokeWidth="2.08791" strokeLinecap="round" strokeLinejoin="round"/>
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
    <>
    <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white">
      <span className="text-[16px] leading-[24px] text-center font-semibold">Calendar</span>
    </header>
    
    <div className="shadow-md">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
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
            <div className="grid grid-cols-7 mt-10 font-semibold text-center text-[15px] leading-[25px] text-[#111111]">
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
                    // 'py-1'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    disabled={getDay(day) === 0 || isBefore(day, startOfDay(new Date()))}
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
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-400',
                      isEqual(day, selectedDay) && isToday(day) && 'bg-[#CBF3F0]',
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        'bg-secondary',
                      // !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        'font-semibold',
                      'mx-auto flex h-10 w-14 items-center justify-center rounded-full font-semibold text-center text-[15px] transition-all duration-300'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className="w-1 h-1 mx-auto mt-1">
                    {meetings.some((meeting) =>
                      isSameDay(parseISO(meeting.startDatetime), day)
                    ) && (
                      <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center pb-4'>
        <div className='h-1 w-8 rounded-full bg-[#E8E8E8]'></div>
      </div>
    </div>

    <div className='min-h-[400px]'>
      <section className="mt-6 md:mt-0 pl-4">
        <h2 className="font-semibold text-gray-900">
          Schedule for{' '}
          <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
            {format(selectedDay, 'MMM dd, yyy')}
          </time>
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-gray-500">
          {selectedDayMeetings.length > 0 ? (
            selectedDayMeetings.map((meeting,index) => (
              <Meeting meeting={meeting} index={index} key={meeting.id} />
            ))
          ) : (
            <p>No schedule for today.</p>
          )}
        </ol>
      </section>
    </div>

    <div className='sticky bottom-0 pb-4 bg-white pt-4 z-10'>
      <Drawer>
        <DrawerTrigger className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Add your available time</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='flex items-center justify-between'>
            <DialogTitle className='hidden'></DialogTitle>
            <div className='w-full border-b-[1px] pb-3'>
              <div className='w-full mt-4 text-[16px] leading-[24px] font-semibold text-center'>
                  Add your time on 
                  <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                    {format(selectedDay, 'MMM dd, yyy')}
                  </time>
              </div>
              <span className='text-sm text-gray-500'>It will appear on your profile</span>
            </div>
            <DrawerClose className='text-[12px] leading-[18px] font-medium text-[#E10101]'>Close</DrawerClose>
          </DrawerHeader>
          <div className='space-y-3'>
            <span className='text-xs text-gray-500 px-4'>Add from history</span>
            <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>10:00-15:00</button>
            <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>12:00-17:30</button>
            <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>15:00-16:00</button>
          </div>
          <div className='mt-8'>
            <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>Choose new slot manually</button>
          </div>
          <DrawerFooter className=''>
          
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
    </>
  )
}

function Meeting({ meeting, index }:Props) {
  let startDateTime = parseISO(meeting.startDatetime)
  let endDateTime = parseISO(meeting.endDatetime)

  let textColor, bgColor, border, timeColor;
  if(index%2===0){
    textColor="text-[#2EC4B6]";
    bgColor="bg-[#2EC4B60F]";
    border="border-[#2EC4B6]";
    timeColor="text-[#2EC4B6]";
  }
  if(index%2===1){
    textColor="text-[#FF0000]";
    bgColor="bg-[#FF00000F]";
    border="border-[#FF0000]";
    timeColor="text-gray-500";
  }

  return (
    <li>
      <div className="flex gap-x-3">
        <div className="w-16 text-end">
          <span className={`text-xs ${timeColor} dark:text-neutral-400`}>{format(startDateTime, 'h:mm a')}</span>
        </div>
        
        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
          <div className="relative z-10 size-7 flex justify-center items-center">
            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
          </div>
        </div>

        <div className={`grow pt-0.5 pb-4 mb-8 px-2 rounded-l-md border-l-8 ${border} ${textColor} ${bgColor}`}>
          <h3 className="flex gap-x-1.5 font-semibold dark:text-white">
            
          </h3>
          <p className="mt-1 text-sm dark:text-neutral-400">
            {meeting.name}
          </p>
          <span className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
            {locationIcon}
            Location / Event Name
          </span>
        </div>
      </div>
    </li>
  )
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]