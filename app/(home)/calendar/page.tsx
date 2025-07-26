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
import { cn } from '@/lib/utils'
import { locationIcon } from '@/constants/icons'
import UserSlot from '@/components/common/userSlot';
import { Loader2 } from 'lucide-react';
//import WheelPicker from '@/components/common/wheelPicker';
import WheelPicker from '@/components/WheelPicker';
import { useToast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';
import { useTranslations } from 'next-intl'

interface SlotProps {
  _id: string;
  user_id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Calendar() {
  const t = useTranslations('Calendar');
  const { toast } = useToast()
  const logout = useLogout()
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  let [previousMonthDisabled, setPreviousMonthDisabled] = useState(true)
  const [slots, setSlots] = useState<SlotProps[]>([])
  const [editSlot, setEditSlot] = useState<SlotProps | null>(null)
  const [slotDrawer, setSlotDrawer] = useState(false)
  const [popUpMode, setPopUpMode] = useState(0)
  const [isEditPopUp, setIsEditPopUp] = useState(false)
  const [slotSaveLoading, setSlotSaveLoading] = useState(false)
  const [slotDeleteLoading, setSlotDeleteLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date>(new Date());
  // const [endTime, setEndTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  });
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)

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
      // stroke={previousMonthDisabled?"#999999":"#2EC4B6"} 
      stroke='#2EC4B6'
      strokeWidth="2.08791" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

  const rightIcon = <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.2495 17.75L14.9473 13.3132L10.2495 8.87637" stroke="#2EC4B6" strokeWidth="2.08791" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

  const handleEditSlot = async (slot: SlotProps) => {
    console.log("slot", slot)
    setIsEditPopUp(true)
    setPopUpMode(1)
    setStartTime(new Date(slot?.startTime))
    setEndTime(new Date(slot?.endTime))
    setEditSlot(slot)
    setSlotDrawer(true)
  }

  const handleDeleteSlot = async (slot: SlotProps) => {
    console.log("slot", slot)
    try {
      setSlotDeleteLoading(true)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/slot`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',

        },
        credentials: "include",
        body: JSON.stringify({ slot_id: slot?._id }),
      });

      const data = await res.json()
      if (res.status === 200) {
        setSlots(prevSlots => prevSlots.filter(s => s._id !== slot?._id));
        toast({
          title: "Success",
          description: `${data?.message}`,
          variant: "success"
        })
      }
      else if (res.status === 401) {
        toast({
          title: "Error",
          description: t("unauthorized"),
          variant: "destructive"
        })
        logout();
      }
      else {
        toast({
          title: t("serverError"),
          description: `Error: ${data.message}`,
          variant: "destructive"
        })
      }
    } catch (error) {

    } finally {
      setSlotDeleteLoading(false)
    }
  }

  const fetchUserSlots = async () => {
    const date = parse(currentMonth, "MMM-yyyy", new Date());
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    try {

      const res_slots = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/slot?month=${month}&year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
      });

      if (res_slots.status === 200) {
        const data_slots = await res_slots.json();
        setSlots(data_slots.slots)
      }
      else if (res_slots.status === 401) {
        toast({
          title: "Error",
          description: t("unauthorizedText"),
          variant: "destructive"
        })
        logout();
      }
      else {
        toast({
          title: t("serverError"),
          description: t("serverError"),
          variant: "destructive"
        })
      }

    } catch (error: any) {
      toast({
        title: t("serverError"),
        description: error?.message,
        variant: "destructive"
      })
    }
  }

  const handleAddSlot = async () => {
    try {
      setSlotSaveLoading(true)
      const rawDate = new Date(selectedDay);
      const rawStartTime = new Date(startTime);
      const rawEndTime = new Date(endTime);

      const newSlot = {
        date: new Date(Date.UTC(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate())).toISOString(),
        startTime: rawStartTime.toISOString(),
        endTime: rawEndTime.toISOString(),
        status: "available"
      };

      const isConflict = slots.some(slot => {
        const existingStart = new Date(slot.startTime);
        const existingEnd = new Date(slot.endTime);
        const newStart = new Date(newSlot.startTime);
        const newEnd = new Date(newSlot.endTime);

        return (
          slot.date === newSlot.date &&
          (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          )
        );
      });

      if (isConflict) {
        toast({
          title: t("slotConflict"),
          description: t("slotConflictText"),
          variant: "destructive"
        });
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ slots: [newSlot] }),
      });

      const data = await res.json()
      if (res.status === 201) {
        setSlotDrawer(false)
        setSlots((prevSlots) => [...prevSlots, ...data.slots]);
        toast({
          title: "Success",
          description: `${data?.message}`,
          variant: "success"
        })
      }
      else if (res.status === 401) {
        setSlotDrawer(false)
        toast({
          title: "Error",
          description: t("unauthorized"),
          variant: "destructive"
        })
        logout();
      }
      else {
        setSlotDrawer(false)
        toast({
          title: t("serverError"),
          description: `Error: ${data.message}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      setSlotDrawer(false)
      toast({
        title: t("serverError"),
        description: `Error: ${error}`,
        variant: "destructive"
      })
    } finally {
      setPopUpMode(0)
      setSlotDrawer(false)
      setSlotSaveLoading(false)
    }
  }

  const handleUpdateSlot = async () => {
    try {
      setSlotSaveLoading(true)
      const rawDate = new Date(selectedDay);
      const rawStartTime = new Date(startTime);
      const rawEndTime = new Date(endTime);

      const newSlot = {
        date: new Date(Date.UTC(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate())).toISOString(),
        startTime: rawStartTime.toISOString(),
        endTime: rawEndTime.toISOString(),
      };

      const isConflict = slots.some(slot => {
        if (slot._id === editSlot?._id) return false;
        const existingStart = new Date(slot.startTime);
        const existingEnd = new Date(slot.endTime);
        const newStart = new Date(newSlot.startTime);
        const newEnd = new Date(newSlot.endTime);

        return (
          slot.date === newSlot.date &&
          (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          )
        );
      });

      if (isConflict) {
        toast({
          title: t("slotConflict"),
          description: t("slotConflictText"),
          variant: "destructive"
        });
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/slot`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ slot_id: editSlot?._id, startTime: newSlot?.startTime, endTime: newSlot?.endTime }),
      });

      const data = await res.json()
      console.log(res, data)
      if (res.status === 200) {
        setSlotDrawer(false)
        setSlots(prevSlots =>
          prevSlots.map(slot =>
            slot._id === editSlot?._id ? { ...slot, ...data.updatedSlot } : slot
          )
        );
        toast({
          title: "Success",
          description: `${data?.message}`,
          variant: "success"
        })
      }
      else if (res.status === 401) {
        setSlotDrawer(false)
        toast({
          title: "Error",
          description: t("unauthorized"),
          variant: "destructive"
        })
        logout();
      }
      else {
        setSlotDrawer(false)
        toast({
          title: t("serverError"),
          description: `Error: ${data.message}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      setSlotDrawer(false)
      toast({
        title: t("serverError"),
        description: `Error: ${error}`,
        variant: "destructive"
      })
    } finally {
      setPopUpMode(0)
      setSlotDrawer(false)
      setSlotSaveLoading(false)
    }
  }

  useEffect(() => {
    const minEndTime = new Date(startTime);
    minEndTime.setHours(minEndTime.getHours() + 1);

    if (endTime <= startTime || endTime < minEndTime) {
      setEndTime(minEndTime);
    }
  }, [startTime, endTime]);

  const formatTimeToHours = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  useEffect(() => {
    const todayMonth = format(today, 'MMM-yyyy');
    const isSameMonth = currentMonth === todayMonth;
    setPreviousMonthDisabled(isSameMonth);
  }, [today, currentMonth]);

  useEffect(() => {
    fetchUserSlots();
  }, [currentMonth])

  return (
    <>
      <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white">
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("calendar")}</span>
      </header>

      <div className="">
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
                  // disabled={previousMonthDisabled}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{t("previousMonth")}</span>
                  {leftIcon}
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{t("nextMonth")}</span>
                  {rightIcon}
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 font-semibold text-center text-[15px] leading-[25px] text-[#111111]">
                <div>{t("Su")}</div>
                <div>{t("Mo")}</div>
                <div>{t("Tu")}</div>
                <div>{t("We")}</div>
                <div>{t("Th")}</div>
                <div>{t("Fr")}</div>
                <div>{t("Sa")}</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={cn(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      'py-1'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      // disabled={getDay(day) === 0 || isBefore(day, startOfDay(new Date()))}
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
                        // !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                        (isEqual(day, selectedDay) || isToday(day)) &&
                        'font-semibold',
                        'mx-auto flex h-8 md:h-10 w-8 md:w-14 items-center justify-center rounded-full font-semibold text-center text-[15px] transition-all duration-300'
                      )}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>
                        {format(day, 'd')}
                      </time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                      {slots?.some((slot) =>
                        isSameDay(parseISO(slot?.date), day)
                      ) && (
                          <div className="w-1 h-1 rounded-full bg-secondary"></div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex items-center justify-center pb-4 md:hidden'>
                <div className='h-1 w-8 rounded-full bg-[#E8E8E8]'></div>
              </div>
            </div>

            <div className=''>
              <section className="mt-6 md:mt-0 md:pl-4">
                <h2 className="font-semibold text-gray-900 pl-4">
                  {t("scheduleFor")}{' '}
                  <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                    {format(selectedDay, 'MMM dd, yyy')}
                  </time>
                </h2>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-gray-500 md:overflow-y-scroll md:h-[40vh] md:no-scrollbar">
                  {slots?.length > 0 ? (
                    slots
                      .filter((slot) => {
                        const slotDate = new Date(slot.date).toDateString();
                        const selectedDate = selectedDay.toDateString();
                        return slotDate === selectedDate;
                      })
                      .map((slot, index) => (
                        <UserSlot handleEditSlot={handleEditSlot} handleDeleteSlot={handleDeleteSlot} slot={slot} index={index} key={index} />
                      ))
                  ) : (
                    <p>{t("noSlots")}</p>
                  )}
                </ol>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className='sticky bottom-0 pb-4 bg-white pt-4 z-10'>
        <Drawer open={slotDrawer} onOpenChange={setSlotDrawer}>
          <DrawerTrigger onClick={() => { setIsEditPopUp(false); setPopUpMode(0); setEditSlot(null); setSlotDrawer(true); }} className='w-[90%] md:w-[800px] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("add_available_time")}</DrawerTrigger>
          <DrawerContent aria-describedby={undefined}>
            <DrawerHeader className='flex items-center justify-between '>
              <DialogTitle className='hidden'></DialogTitle>
              <div className='w-full max-w-[800px] mx-auto'>
                <div className='w-full mt-4 text-[16px] leading-[24px] font-semibold text-center'>
                  {t("add_time_on")}
                  <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                    {" "}{format(selectedDay, 'MMM dd, yyy')}
                  </time>
                </div>
              </div>
              <DrawerClose className='text-[12px] leading-[18px] font-medium text-[#E10101]'>{t("close")}</DrawerClose>
            </DrawerHeader>
            <span className='text-sm text-gray-500 max-w-[800px] pb-3 px-4 mx-auto w-full'>{t("appear_on_profile")}</span>
            <hr className='pb-3' />
            {popUpMode === 0 &&
              <div className='space-y-3 max-w-[800px] mx-auto w-full'>
                {/* <span className='text-xs text-gray-500 px-4'>Add from history</span> */}
                {/* <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>10:00-15:00</button>
              <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>12:00-17:30</button>
              <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>15:00-16:00</button> */}
                <div className='pt-8 max-w-[800px] mx-auto w-full'>
                  <button onClick={() => setPopUpMode(1)} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{t("choose_new_slot")}</button>
                </div>
              </div>
            }
            {popUpMode === 1 &&
              <div className='space-y-3 max-w-[800px] mx-auto w-full'>
                <button disabled={true} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("date")} {format(selectedDay, 'MMM dd, yyy')}</button>
                <button onClick={() => { setShowStartTimePicker(!showStartTimePicker); setShowEndTimePicker(false) }} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("start_time")} {formatTimeToHours(startTime)}</button>
                {showStartTimePicker && <WheelPicker setDate={setStartTime} time={startTime} />}
                <button onClick={() => { setShowEndTimePicker(!showEndTimePicker); setShowStartTimePicker(false) }} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("end_time")} {formatTimeToHours(endTime)}</button>
                {showEndTimePicker && <WheelPicker setDate={setEndTime} isEndTime={true} time={endTime} />}
                <div className='pt-8 max-w-[800px] mx-auto w-full'>
                  {isEditPopUp ?
                    <button onClick={() => handleUpdateSlot()} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{slotSaveLoading ? <Loader2 className='animate-spin' /> : t("update_slot")}</button>
                    :
                    <button onClick={() => handleAddSlot()} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{slotSaveLoading ? <Loader2 className='animate-spin' /> : t("add_to_calendar")}</button>
                  }
                </div>
              </div>
            }
            <DrawerFooter className=''>

            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
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