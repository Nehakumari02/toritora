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
import { ja, enUS } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useLocale, useTranslations } from 'next-intl'
import Calendar from '@/components/common/calendar';

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

export default function CalendarPage() {
  const t = useTranslations('Calendar');
  const locale = useLocale();
  const { toast } = useToast()
  const logout = useLogout()
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState<Date>(today)
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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
        body: JSON.stringify({ slot_id: editSlot?._id, date:newSlot.date, startTime: newSlot?.startTime, endTime: newSlot?.endTime }),
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

  const formatDate = (date: Date) => {
    return (locale === 'jn'
      ? format(selectedDay, 'yyyy年M月d日', { locale: ja })
      : format(selectedDay, 'MMM dd, yyyy', { locale: enUS }))
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
                  {format(firstDayCurrentMonth, locale === 'jn' ? 'yyyy年M月' : 'MMMM yyyy', { locale: locale === 'jn' ? ja : enUS })}
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
                  {
                    locale === 'jn' ?
                      <time>
                        {formatDate(selectedDay)}
                        {' (月) '}{t("scheduleFor")}
                      </time>
                      :
                      <time>
                        {t("scheduleFor")}{' '}
                        {formatDate(selectedDay)}
                      </time>
                  }
                  {/* {t("scheduleFor")}{' '}
                  <time>
                    {format(selectedDay, 'MMM dd, yyy')}
                  </time> */}
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

        <Dialog open={slotDrawer} onOpenChange={setSlotDrawer}>
          <form>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditPopUp(false); setPopUpMode(1); setEditSlot(null); setSlotDrawer(true); }} className='w-[90%] md:w-[800px] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center hover:bg-secondary text-white rounded-md'>{t("add_available_time")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-2 md:p-4">
              <DialogHeader>
                <DialogTitle className='hidden'>Edit profile</DialogTitle>
                <div className='w-full max-w-[800px] mx-auto'>
                  <div className='w-full mt-4 text-[16px] leading-[24px] font-semibold text-center'>
                    {
                      !isEditPopUp && (locale === 'jn' ?
                        <time>
                          {formatDate(selectedDay)}
                          {' '}{t("add_time_on")}
                        </time>
                        :
                        <time>
                          {t("add_time_on")}{' '}
                          {formatDate(selectedDay)}
                        </time>)
                    }
                    {
                      isEditPopUp && 
                      <span>{t("edit_slot")}</span>
                    }
                  </div>
                </div>
              </DialogHeader>
              {!isEditPopUp && <span className='text-sm text-center text-gray-500 max-w-[800px] pb-3 px-4 mx-auto w-full'>{t("appear_on_profile")}</span>}
              {isEditPopUp && <span className='text-sm text-center text-gray-500 max-w-[800px] pb-3 px-4 mx-auto w-full'>{t("appear_on_profile_edit")}</span>}
              <hr className='pb-3' />
              {popUpMode === 0 &&
                <div className='space-y-3 max-w-[800px] mx-auto w-full'>
                  <div className='pt-8 max-w-[800px] mx-auto w-full'>
                    <button onClick={() => setPopUpMode(1)} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{t("choose_new_slot")}</button>
                  </div>
                </div>
              }
              {popUpMode === 1 &&
                <div className='space-y-3 max-w-[800px] mx-auto w-full'>
                  {/* <button disabled={true} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("date")} {format(selectedDay, 'MMM dd, yyy')}</button> */}
                  <div className='space-y-2'>
                    <div className='w-[90%] mx-auto flex flex-col justify-center gap-2'>
                      <span className='font-medium text-[14px] leading-[21px]'>{t("select_date")}</span>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                        <Popover modal={true} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                'w-[100%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md',
                                !selectedDay && "text-muted-foreground"
                              )}
                            > 
                              {t("select_date")}{"   "}
                              {selectedDay ? format(selectedDay, locale === 'jn' ?  '  yyyy年M月d日 (EEE)' : 'MMM dd, yyyy' , { locale: locale === 'jn' ? ja : enUS }) : <span>{t("pickDate")}</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              selectedDay={selectedDay}
                              setSelectedDay={(date: Date) => {
                                setSelectedDay(date);
                                setIsCalendarOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className='w-[90%] mx-auto flex flex-col justify-center gap-2'>
                    <span className='font-medium text-[14px] leading-[21px]'>{t("select_date")}</span>
                    <Button variant={"outline"} onClick={() => { setShowStartTimePicker(!showStartTimePicker); setShowEndTimePicker(false) }} className='w-[100%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("start_time")} {formatTimeToHours(startTime)}</Button>
                    {showStartTimePicker && <WheelPicker setDate={setStartTime} time={startTime} />}
                  </div>
                  <div className='w-[90%] mx-auto flex flex-col justify-center gap-2'>
                    <span className='font-medium text-[14px] leading-[21px]'>{t("select_date")}</span>
                    <Button variant={"outline"} onClick={() => { setShowEndTimePicker(!showEndTimePicker); setShowStartTimePicker(false) }} className='w-[100%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("end_time")} {formatTimeToHours(endTime)}</Button>
                    {showEndTimePicker && <WheelPicker setDate={setEndTime} isEndTime={true} time={endTime} />}
                  </div>
                  <div className='pt-8 max-w-[800px] mx-auto w-full'>
                    {isEditPopUp ?
                      <button onClick={() => handleUpdateSlot()} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{slotSaveLoading ? <Loader2 className='animate-spin' /> : t("update_slot")}</button>
                      :
                      <button onClick={() => handleAddSlot()} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{slotSaveLoading ? <Loader2 className='animate-spin' /> : t("add_to_calendar")}</button>
                    }
                  </div>
                </div>
              }
              <DialogFooter>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
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

const CalendarIcon = ({ fill = "text-[#999999]" }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-300 fill-current text-[${fill}]`}>
      <path d="M6.445 11.688V6.354H5.812C5.35864 6.59567 4.92049 6.86484 4.5 7.16V7.855C4.875 7.598 5.469 7.235 5.758 7.078H5.77V11.688H6.445ZM7.633 10.383C7.68 11.023 8.227 11.789 9.336 11.789C10.594 11.789 11.336 10.723 11.336 8.918C11.336 6.984 10.555 6.25 9.383 6.25C8.457 6.25 7.586 6.922 7.586 8.059C7.586 9.219 8.41 9.829 9.262 9.829C10.008 9.829 10.492 9.453 10.645 9.039H10.672C10.668 10.355 10.211 11.203 9.367 11.203C8.703 11.203 8.359 10.753 8.317 10.383H7.633ZM10.586 8.066C10.586 8.762 10.027 9.246 9.402 9.246C8.801 9.246 8.258 8.863 8.258 8.046C8.258 7.223 8.84 6.836 9.426 6.836C10.059 6.836 10.586 7.234 10.586 8.066Z" fill="currentColor" />
      <path d="M3.5 0C3.63261 0 3.75979 0.0526784 3.85355 0.146447C3.94732 0.240215 4 0.367392 4 0.5V1H12V0.5C12 0.367392 12.0527 0.240215 12.1464 0.146447C12.2402 0.0526784 12.3674 0 12.5 0C12.6326 0 12.7598 0.0526784 12.8536 0.146447C12.9473 0.240215 13 0.367392 13 0.5V1H14C14.5304 1 15.0391 1.21071 15.4142 1.58579C15.7893 1.96086 16 2.46957 16 3V14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V3C0 2.46957 0.210714 1.96086 0.585786 1.58579C0.960859 1.21071 1.46957 1 2 1H3V0.5C3 0.367392 3.05268 0.240215 3.14645 0.146447C3.24021 0.0526784 3.36739 0 3.5 0V0ZM1 4V14C1 14.2652 1.10536 14.5196 1.29289 14.7071C1.48043 14.8946 1.73478 15 2 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V4H1Z" fill="currentColor" />
    </svg>
  );
};


  // < Drawer open = { slotDrawer } onOpenChange = { setSlotDrawer } >
  //         <DrawerTrigger onClick={() => { setIsEditPopUp(false); setPopUpMode(0); setEditSlot(null); setSlotDrawer(true); }} className='w-[90%] md:w-[800px] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("add_available_time")}</DrawerTrigger>
  //         <DrawerContent aria-describedby={undefined}>
  //           <DrawerHeader className='flex items-center justify-between '>
  //             <DialogTitle className='hidden'></DialogTitle>
  //             <div className='w-full max-w-[800px] mx-auto'>
  //               <div className='w-full mt-4 text-[16px] leading-[24px] font-semibold text-center'>
  //                 {
  //                   locale === 'jn' ?
  //                     <time>
  //                       {formatDate(selectedDay)}
  //                       {' '}{t("add_time_on")}
  //                     </time>
  //                     :
  //                     <time>
  //                       {t("add_time_on")}{' '}
  //                       {formatDate(selectedDay)}
  //                     </time>
  //                 }
  //               </div>
  //             </div>
  //             <DrawerClose className='text-[12px] leading-[18px] font-medium text-[#E10101]'>{t("close")}</DrawerClose>
  //           </DrawerHeader>
  //           <span className='text-sm text-gray-500 max-w-[800px] pb-3 px-4 mx-auto w-full'>{t("appear_on_profile")}</span>
  //           <hr className='pb-3' />
  //           {popUpMode === 0 &&
  //             <div className='space-y-3 max-w-[800px] mx-auto w-full'>
  //               {/* <span className='text-xs text-gray-500 px-4'>Add from history</span>
  //               <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>10:00-15:00</button>
  //             <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>12:00-17:30</button>
  //             <button className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>15:00-16:00</button> */}
  //               <div className='pt-8 max-w-[800px] mx-auto w-full'>
  //                 <button onClick={() => setPopUpMode(1)} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{t("choose_new_slot")}</button>
  //               </div>
  //             </div>
  //           }
  //           {popUpMode === 1 &&
  //             <div className='space-y-3 max-w-[800px] mx-auto w-full'>
  //               <button disabled={true} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("date")} {format(selectedDay, 'MMM dd, yyy')}</button>
  //               <button onClick={() => { setShowStartTimePicker(!showStartTimePicker); setShowEndTimePicker(false) }} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("start_time")} {formatTimeToHours(startTime)}</button>
  //               {showStartTimePicker && <WheelPicker setDate={setStartTime} time={startTime} />}
  //               <button onClick={() => { setShowEndTimePicker(!showEndTimePicker); setShowStartTimePicker(false) }} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("end_time")} {formatTimeToHours(endTime)}</button>
  //               {showEndTimePicker && <WheelPicker setDate={setEndTime} isEndTime={true} time={endTime} />}
  //               <div className='pt-8 max-w-[800px] mx-auto w-full'>
  //                 {isEditPopUp ?
  //                   <button onClick={() => handleUpdateSlot()} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{slotSaveLoading ? <Loader2 className='animate-spin' /> : t("update_slot")}</button>
  //                   :
  //                   <button onClick={() => handleAddSlot()} className='w-[90%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-[#FF9F1C] flex items-center justify-center text-white rounded-md'>{slotSaveLoading ? <Loader2 className='animate-spin' /> : t("add_to_calendar")}</button>
  //                 }
  //               </div>
  //             </div>
  //           }
  //           <DrawerFooter className=''>

  //           </DrawerFooter>
  //         </DrawerContent>
  //       </Drawer >