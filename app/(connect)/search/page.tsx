"use client"
import { backIcon, locationIcon, searchIcon } from '@/constants/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const availableModelList = [
  {
    name: "Satomi Ishihara",
    location: "Tokyo",
    genre: "cool",
    experience: 3,
    profilePic: "/images/home/model4.png",
    username: "",
  },
  {
    name: "Momoka",
    location: "Tokyo",
    genre: "pretty",
    experience: 5,
    profilePic: "/images/home/model3.png",
    username: "",
  },
  {
    name: "Arisa",
    location: "Tokyo",
    genre: "dark",
    experience: 2,
    profilePic: "/images/home/model1.png",
    username: "",
  },
  {
    name: "Satomi Ishihara",
    location: "Tokyo",
    genre: "nature",
    experience: 4,
    profilePic: "/images/home/model4.png",
    username: "",
  },
  {
    name: "Momoka",
    location: "Tokyo",
    genre: "cool",
    experience: 6,
    profilePic: "/images/home/model2.png",
    username: "",
  },
  {
    name: "Arisa",
    location: "Tokyo",
    genre: "pretty",
    experience: 1,
    profilePic: "/images/home/model3.png",
    username: "",
  },
]

const genres = ["Cool", "Pretty", "Dark", "Natural", "Art", "Clean", "Cute", "All"]

function Search() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [shootingDate, setShootingDate] = useState<Date>();
  const [experienceSearch, setExperienceSearch] = useState(0);
  const [filteredModels, setFilteredModels] = useState(availableModelList);
  const [showResults, setShowResults] = useState(false);
  const [searchResult,setSearchResult] = useState([]);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToLink = (route: string) => {
    router.push(route);
  };

  // Debounced search function
  // const debounce = (func: (...args: any[]) => void, delay: number) => {
  //   let timer: NodeJS.Timeout;
  //   return (...args: any[]) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => func(...args), delay);
  //   };
  // };

  // const handleSearch = useCallback(() => {
  //   const filtered = availableModelList.filter((model) =>
  //     model.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     model.location.toLowerCase().includes(locationSearch.toLowerCase()) &&
  //     (genreSearch ? model.genre.toLowerCase() === genreSearch.toLowerCase() : true) &&
  //     model.experience >= experienceSearch
  //   );
  //   setFilteredModels(filtered);
  // }, [searchTerm, locationSearch, genreSearch, experienceSearch]);

  const handleShowResults = () => {
    setShowResults(true);
    // handleSearch();
  };

  const clearFilters = () => {
    setLocationSearch("");
    setGenre("All");
    setExperienceSearch(0);
  }

  return (
    <div className=''>
      <header className="sticky z-10 top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Search</span>
      </header>

      <div className='overflow-y-scroll h-full no-scrollbar my-8'>
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
          <Drawer>
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
                  <span className='font-medium text-[14px] leading-[21px]'>Shooting Ares</span>
                  <div className={`h-[42px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 border-[#999999] `}>
                    {locationIconGreen}
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e)=>{setLocationSearch(e.target.value)}}
                      className="outline-none w-full"
                      placeholder="Select location"
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <span className='font-medium text-[14px] leading-[21px]'>Shooting Date</span>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <Popover modal={true}>
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
                          mode="single"
                          selected={shootingDate}
                          onSelect={setShootingDate}
                          initialFocus
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
                  <button className='w-[75%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>Show results</button>
                  <button onClick={clearFilters} className='w-[20%] mx-auto h-[54px] text-[16px] leading-[24px] font-bold text-center bg-white flex items-center justify-center text-[#ADB2B9] rounded-md'>Clear</button>
                </div>
              </div>
            </div>
            <DrawerFooter className=''>
            </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Location Search Bar */}
        {/* <div className='max-w-[800px] mx-auto relative h-[48px] w-full px-[24px] my-[24px]'>
          <input
            type="text"
            className='bg-white border border-gray-300 h-[48px] w-full pl-[20px] pr-[40px] rounded-md outline-none focus:outline-none focus:border-[#999999]'
            placeholder='Search by Location'
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />
          <div className='absolute top-[50%] translate-y-[-50%] right-[34px]'>
            {locationIcon}
          </div>
        </div> */}


        {/* Genre Search Bar */}
        {/* <div className='max-w-[800px] mx-auto relative h-[48px] w-full px-[24px] my-[24px]'>
          <select
            className='bg-white border border-gray-300 h-[48px] w-full pl-[20px] pr-[40px] rounded-md outline-none focus:outline-none focus:border-[#999999]'
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
          >
            <option value="">Search by Genre</option>
            <option value="cool">Cool</option>
            <option value="pretty">Pretty</option>
            <option value="dark">Dark</option>
            <option value="nature">Natural</option>
            <option value="cool">Art</option>
            <option value="pretty">Clean</option>
            <option value="dark">Cute</option>
            <option value="nature">Others</option>
          </select>
        </div> */}

        {/* Experience Slider */}
        {/* <div className='w-[388px] mx-auto my-[24px]'>
          <label className='block text-[14px] leading-[21px] font-medium'>Experience (Years)</label>
          <input
            type="range"
            min="0"
            max="10"
            value={experienceSearch}
            onChange={(e) => setExperienceSearch(Number(e.target.value))}
            className="slider w-full h-2 rounded-md"
          />
          <div className='flex justify-between text-[12px] leading-[18px] text-[#999999]'>
            <span>0</span>
            <span>10+</span>
          </div>
          <div className='text-center  text-[14px]'>
            {experienceSearch} Year{experienceSearch !== 1 ? 's' : ''}
          </div>
        </div> */}




        {/* Show Results Button */}
        {/* <div className='w-[304px] h-[66px] mx-auto my-[24px]'>
          <button
            onClick={handleShowResults}
            className='w-full bg-[#2EC4B6] text-white py-2 rounded-md text-white'
          >
            Show Results
          </button>
        </div> */}

        {/* Search Results */}
        <div className='max-w-[800px] mx-auto px-[10px] space-y-2 my-[24px]'>
          <div className='flex items-center justify-between'>
            <span className='text-[16px] font-medium leading-[24px]'>Search results</span>
          </div>

          {searchResult.length === 0 ? (
            <div className='text-center text-[14px] text-[#999999] py-4'>No search results found.</div>
          ) : (
            <div className='bg-[#F0F0F1] flex flex-row items-center justify-around md:justify-start gap-[10px] md:gap-[20px] flex-wrap py-2 px-2 rounded-md'>
              {filteredModels.map((item, index) => (
                <div key={index} className='bg-white border h-[226px] w-[172px] flex-shrink-0 rounded-md flex flex-col gap-2 items-center justify-between px-[12px] py-[14px]'>

                  <div className='relative'>
                    <Image src={item.profilePic} alt='userImage' width={148} height={151} className='h-[151px] w-[148px] rounded-md object-cover'></Image>
                    <span className='absolute top-0 left-0 bg-secondary w-[64px] h-[18px] text-center text-white text-[10px] leading-[15px] font-medium rounded-tl-md rounded-br-md'>New</span>
                  </div>

                  <div className='flex flex-col items-start justify-center w-full'>
                    <span className='text-[14px] leading-[21px] font-medium'>{item.name}</span>
                    <div className='flex items-center justify-between w-full'>
                      <span className='flex flex-row items-center justify-center gap-2 text-[10px] leading-[15px] font-normal text-[#999999]'>{locationIcon}{item.location}</span>
                      <Link href={`/userDetails?username=${item.username}`} className='text-primary text-[12px] font-medium leading-[18px]'>View</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
