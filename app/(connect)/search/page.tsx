"use client"
import { backIcon, locationIcon, searchIcon } from '@/constants/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import location from '../../../public/images/photographer_reg/location.png'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format, formatDate, startOfToday } from 'date-fns';
import Calendar from '@/components/common/calendar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { prefectures } from '@/data/prefectures';
import { UserTile } from '@/components/common/tile';
import TileSkeleton from '@/components/common/tileSkeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const genres = ["Cool", "Pretty", "Dark", "Natural", "Art", "Clean", "Cute", "All"]

function Search() {
  const router = useRouter();
  const {toast} = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [locationSearch, setLocationSearch] = useState("");
  const [genre, setGenre] = useState("All");
  let today = startOfToday()
  const [shootingDate, setShootingDate] = useState<Date>(today);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [experienceSearch, setExperienceSearch] = useState(0);
  const [searchResult,setSearchResult] = useState<any>([]);
  const [loading,setLoading] = useState(true);
  const [totalPages,setTotalPages] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalCount,setTotalCount] = useState(0);
  const [showFilters,setShowFilters] = useState(false)
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const isFilterAdded = useRef(false);
  const handleGoBack = () => {
    router.back();
  };

  const handleGoToLink = (route: string) => {
    router.push(route);
  };

  const handleLocationSearch = (value: string) => {
      setLocationSearch(value);
    };

  const clearFilters = async () => {
    isFilterAdded.current = false
    setShowFilters(false);
    setLocationSearch("");
    setGenre("All");
    setExperienceSearch(0);
    setShootingDate(today)
    fetchUserWithFilters();
  }

  const handleShowResults = async ()=>{
    setShowFilters(false);
    isFilterAdded.current = true;
    fetchUserWithFilters();
  }

  const fetchUserWithFilters = async ()=>{
    setLoading(true);
    try {
      const professionFromLS = localStorage.getItem('userProfession') || '';
      const formattedDate = formatDate(shootingDate, "yyyy-MM-dd");
      const type = professionFromLS;
      const filters = {
        location: locationSearch,
        genres: genre,
        experience: experienceSearch.toString(),
      }

      const baseParams = {
        name: searchTerm,
        type: type,
        pageNo: currentPage.toString(),
        pageSize: pageSize.toString(),
        isMonth: 'true',
      };

      const queryParams = new URLSearchParams({
        ...baseParams,
        // ...(isFilterAdded.current ? {date: formattedDate} : {date : formatDate(today,"yyyy-MM-dd")}),
        ...(isFilterAdded.current ? {date: formattedDate} : {isMonth:'true'}),
        ...(isFilterAdded.current ? filters : {}),
      }).toString();

      console.log(queryParams)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
      });

      if(res.status===200){
        const data = await res.json();
        const transformedUsers = data.users.map((user:any) => ({
          name: `${user.firstName} ${user.lastName}`.trim(),
          location: user.address,
          profilePic: user.profilePicture,
          userId: user.userId,
          dateOfJoining: new Date(user.createdAt)
        }));
        console.log(data)
        setSearchResult(transformedUsers)
        setTotalPages(totalPages)
        setCurrentPage(currentPage)
        setTotalCount(totalCount)
        setHasMore(currentPage<data.totalPages);
        if(currentPage<data.totalPages)setCurrentPage(currentPage+1);
      }
      else if(res.status===401){
        toast({
          title:"Error",
          description:"Unauthorized request",
          variant:"destructive"
        })
      }
      else{
        toast({
          title:"Error",
          description:"Server internal error",
          variant:"destructive"
        })
      }
    } catch (error) {
      toast({
        title:"Error",
        description:`Server internal error: ,${error}`,
        variant:"destructive"
      })
    } finally {
      setLoading(false)
    }
    
  }

  const loadMore = async () => {
    setLoadingMore(true);
    try{
      const professionFromLS = localStorage.getItem('userProfession') || '';
      const formattedDate = formatDate(shootingDate, "yyyy-MM-dd");
      const type = professionFromLS;
      const filters = {
        location: locationSearch,
        genres: genre,
        experience: experienceSearch.toString(),
      }

      const baseParams = {
        name: searchTerm,
        type: type,
        pageNo: currentPage.toString(),
        pageSize: pageSize.toString(),
        isMonth: 'true',
      };

      const queryParams = new URLSearchParams({
        ...baseParams,
        // ...(isFilterAdded.current ? {date: formattedDate} : {date : formatDate(today,"yyyy-MM-dd")}),
        ...(isFilterAdded.current ? {date: formattedDate} : {isMonth:'true'}),
        ...(isFilterAdded.current ? filters : {}),
      }).toString();

      console.log(queryParams)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
      });

      if(res.status===200){
        const data = await res.json();
        const transformedUsers = data.users?.map((user:any) => ({
          name: `${user.firstName} ${user.lastName}`.trim(),
          location: user.address,
          profilePic: user.profilePicture,
          userId: user.userId,
          dateOfJoining: new Date(user.createdAt)
        })) ?? [];
        console.log(data)
        setSearchResult([...searchResult, ...transformedUsers])
        setTotalPages(totalPages)
        setCurrentPage(currentPage)
        setTotalCount(totalCount)
        setHasMore(currentPage<data.totalPages);
        if(currentPage<data.totalPages)setCurrentPage(currentPage+1);
      }
      else if(res.status===401){
        toast({
          title:"Error",
          description:"Unauthorized request",
          variant:"destructive"
        })
      }
      else{
        toast({
          title:"Error",
          description:"Server internal error",
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(()=>{
    fetchUserWithFilters();
  },[debouncedTerm])

  return (
    <div className='flex flex-col h-full w-[100%] '>
      <header className="sticky z-10 top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Search</span>
      </header>

      <div className='overflow-y-scroll w-full flex-1 no-scrollbar my-4'>
        {/* Main Search Bar */}
        <div className='max-w-[800px] mx-2 md:mx-auto flex items-center'>
          <div className='relative h-[42px] md:h-[48px] w-full px-2 md:px-[24px md:my-[24px]'>
            <input
              type="text"
              className='bg-[#EEF2F5] h-[42px] md:h-[48px] w-full pl-[20px] pr-[40px] rounded-md outline-none focus:outline-none'
              placeholder='Find your favourite Model'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className='absolute top-[50%] translate-y-[-50%] right-[24px]'>
              {searchIcon}
            </div>
          </div>
          <Drawer open={showFilters} onOpenChange={setShowFilters}>
            <DrawerTrigger className='h-[42px] md:h-[48px] w-[42px] md:w-[48px] flex items-center justify-center rounded-md bg-secondary'>{filterIcon}</DrawerTrigger>
            <DrawerContent>
            <DrawerHeader className='flex items-center justify-between'>
              <DialogTitle className='hidden'></DialogTitle>
              <DrawerClose className='text-[12px] leading-[18px] font-medium text-[#E10101] ml-auto'>Close</DrawerClose>
            </DrawerHeader>
            <div className='space-y-8 mx-2 md:max-w-[800px] md:w-full md:mx-auto'>
              <div className='relative h-[42px] md:h-[48px] w-full px-2 md:px-[24px md:my-[24px]'>
                <input
                  type="text"
                  className='bg-[#EEF2F5] h-[42px] md:h-[48px] w-full pl-[20px] pr-[40px] rounded-md outline-none focus:outline-none'
                  placeholder='Find your favourite Model'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className='absolute top-[50%] translate-y-[-50%] right-[24px]'>
                  {searchIcon}
                </div>
              </div>
              <div className='space-y-6'>
                <span className='font-semibold text-[16px] leading-[24px]'>Search Filters</span>
                <hr />

                <div className='space-y-2'>
                  <span className='font-medium text-[14px] leading-[21px]'>Location</span>
                  <div className="flex items-center border rounded p-2">
                    <Image src={location} alt='location' width={20} height={20} className="h-[20px] w-[20px] text-gray-500 mr-2" />
                    <Select value={locationSearch} onValueChange={handleLocationSearch}>
                      <SelectTrigger className="w-full h-[18px] border-none outline-none focus:ring-0 shadow-none p-0">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Locations</SelectLabel>
                          {prefectures.map((prefecture) => (
                            <SelectItem key={prefecture} value={prefecture}>
                              {prefecture}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <span className='font-medium text-[14px] leading-[21px]'>Shooting Date</span>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <Popover modal={true} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-[42px] justify-start text-left font-normal",
                            !shootingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon fill='#2EC4B6' />
                          {shootingDate ? format(shootingDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          selectedDay={shootingDate}
                          setSelectedDay={(date: Date) => {
                            setShootingDate(date);
                            console.log(date)
                            setIsCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <span className='font-medium text-[14px] leading-[21px]'>Select Genre</span>
                  <div className='flex flex-wrap py-2 gap-2'>
                    {genres.map((item,index)=>{
                      return(
                        <button onClick={()=>setGenre(item)} key={index} className={`${ item === genre ? "bg-primary text-white" : "bg-gray-200 text-black" } text-[12px] leading-[21px] transition-all duration-300 flex-1 max-w-[80px] px-4 py-2 rounded-md`}>
                          {item}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className='space-y-2'>
                  <span className='font-medium text-[14px] leading-[21px]'>Modelling Experience (Years)</span>
                  <div className='max-w-[388px] mx-auto'>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={experienceSearch}
                      onChange={(e) => setExperienceSearch(Number(e.target.value))}
                      className="slider w-full h-2 rounded-md"
                    />
                    <div className='flex justify-between text-[12px] leading-[12px] text-[#999999]'>
                      <span>0</span>
                      <span>10+</span>
                    </div>

                    <div className='text-center  text-[14px]'>
                      {experienceSearch} Year{experienceSearch > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                </div>

                <div className='flex items-center justify-between flex-wrap'>
                  <button onClick={handleShowResults} className='w-[75%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Show results</button>
                  <button onClick={clearFilters} className='w-[20%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-white flex items-center justify-center text-[#ADB2B9] rounded-md'>Clear</button>
                </div>
              </div>
            </div>
            <DrawerFooter className=''>
            </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Search Results */}
        <div className='max-w-[800px] mx-auto px-[4px] md:px-[10px] space-y-2 my-[24px]'>
          <div className='flex items-center justify-between'>
            <span className='text-[16px] font-medium leading-[24px]'>Search results</span>
          </div>

          <div className='grid grid-cols-[repeat(auto-fit,minmax(172px,1fr))] mx-auto gap-[10px] md:gap-[20px] py-2 rounded-md'>
            {loading ? <TileSkeleton/> : searchResult.map((item:any,index:number)=>(
              <UserTile key={index} user={item} />
            ))}
          </div>
          {!loading && hasMore && <button disabled={loadingMore} onClick={loadMore} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingMore ? <Loader2 className='animate-spin' /> : "Load more"}</button>}
          {!loading && !searchResult.length && <span className='text-sm font-semibold text-[#999999]'>No search results found.</span>}
        </div>
      </div>
    </div>
  );
}

export default Search;

const filterIcon = <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.8333 21C12.5028 21 12.2259 20.888 12.0027 20.664C11.7787 20.4408 11.6667 20.1639 11.6667 19.8333C11.6667 19.5028 11.7787 19.2259 12.0027 19.0027C12.2259 18.7787 12.5028 18.6667 12.8333 18.6667H15.1667C15.4972 18.6667 15.7745 18.7787 15.9985 19.0027C16.2217 19.2259 16.3333 19.5028 16.3333 19.8333C16.3333 20.1639 16.2217 20.4408 15.9985 20.664C15.7745 20.888 15.4972 21 15.1667 21H12.8333ZM4.66667 9.33333C4.33611 9.33333 4.05922 9.22172 3.836 8.9985C3.612 8.7745 3.5 8.49722 3.5 8.16667C3.5 7.83611 3.612 7.55883 3.836 7.33483C4.05922 7.11161 4.33611 7 4.66667 7H23.3333C23.6639 7 23.9408 7.11161 24.164 7.33483C24.388 7.55883 24.5 7.83611 24.5 8.16667C24.5 8.49722 24.388 8.7745 24.164 8.9985C23.9408 9.22172 23.6639 9.33333 23.3333 9.33333H4.66667ZM8.16667 15.1667C7.83611 15.1667 7.55883 15.0547 7.33483 14.8307C7.11161 14.6074 7 14.3306 7 14C7 13.6694 7.11161 13.3922 7.33483 13.1682C7.55883 12.9449 7.83611 12.8333 8.16667 12.8333H19.8333C20.1639 12.8333 20.4408 12.9449 20.664 13.1682C20.888 13.3922 21 13.6694 21 14C21 14.3306 20.888 14.6074 20.664 14.8307C20.4408 15.0547 20.1639 15.1667 19.8333 15.1667H8.16667Z" fill="white"/>
</svg>

const CalendarIcon = ({ fill = "text-[#999999]" }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-300 fill-current text-[${fill}]`}>
    <path d="M6.445 11.688V6.354H5.812C5.35864 6.59567 4.92049 6.86484 4.5 7.16V7.855C4.875 7.598 5.469 7.235 5.758 7.078H5.77V11.688H6.445ZM7.633 10.383C7.68 11.023 8.227 11.789 9.336 11.789C10.594 11.789 11.336 10.723 11.336 8.918C11.336 6.984 10.555 6.25 9.383 6.25C8.457 6.25 7.586 6.922 7.586 8.059C7.586 9.219 8.41 9.829 9.262 9.829C10.008 9.829 10.492 9.453 10.645 9.039H10.672C10.668 10.355 10.211 11.203 9.367 11.203C8.703 11.203 8.359 10.753 8.317 10.383H7.633ZM10.586 8.066C10.586 8.762 10.027 9.246 9.402 9.246C8.801 9.246 8.258 8.863 8.258 8.046C8.258 7.223 8.84 6.836 9.426 6.836C10.059 6.836 10.586 7.234 10.586 8.066Z" fill="currentColor"/>
    <path d="M3.5 0C3.63261 0 3.75979 0.0526784 3.85355 0.146447C3.94732 0.240215 4 0.367392 4 0.5V1H12V0.5C12 0.367392 12.0527 0.240215 12.1464 0.146447C12.2402 0.0526784 12.3674 0 12.5 0C12.6326 0 12.7598 0.0526784 12.8536 0.146447C12.9473 0.240215 13 0.367392 13 0.5V1H14C14.5304 1 15.0391 1.21071 15.4142 1.58579C15.7893 1.96086 16 2.46957 16 3V14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V3C0 2.46957 0.210714 1.96086 0.585786 1.58579C0.960859 1.21071 1.46957 1 2 1H3V0.5C3 0.367392 3.05268 0.240215 3.14645 0.146447C3.24021 0.0526784 3.36739 0 3.5 0V0ZM1 4V14C1 14.2652 1.10536 14.5196 1.29289 14.7071C1.48043 14.8946 1.73478 15 2 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V4H1Z" fill="currentColor"/>
    </svg>
  );
};

const locationIconGreen = <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.09524 1.52381C7.77143 1.52381 9.14286 2.89524 9.14286 4.57143C9.14286 6.17143 7.54286 8.7619 6.09524 10.5905C4.64762 8.68571 3.04762 6.17143 3.04762 4.57143C3.04762 2.89524 4.41905 1.52381 6.09524 1.52381ZM6.09524 0C3.58095 0 1.52381 2.05714 1.52381 4.57143C1.52381 8 6.09524 12.9524 6.09524 12.9524C6.09524 12.9524 10.6667 7.92381 10.6667 4.57143C10.6667 2.05714 8.60952 0 6.09524 0ZM6.09524 3.04762C5.25714 3.04762 4.57143 3.73333 4.57143 4.57143C4.57143 5.40952 5.25714 6.09524 6.09524 6.09524C6.93333 6.09524 7.61905 5.40952 7.61905 4.57143C7.61905 3.73333 6.93333 3.04762 6.09524 3.04762ZM12.1905 12.9524C12.1905 14.6286 9.44762 16 6.09524 16C2.74286 16 0 14.6286 0 12.9524C0 11.9619 0.914286 11.1238 2.3619 10.5143L2.81905 11.2C2.05714 11.581 1.52381 12.0381 1.52381 12.5714C1.52381 13.6381 3.58095 14.4762 6.09524 14.4762C8.60952 14.4762 10.6667 13.6381 10.6667 12.5714C10.6667 12.0381 10.1333 11.581 9.29524 11.2L9.75238 10.5143C11.2762 11.1238 12.1905 11.9619 12.1905 12.9524Z" fill="#2EC4B6"/>
</svg>
