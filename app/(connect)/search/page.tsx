"use client"
import { backIcon, locationIcon, searchIcon } from '@/constants/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';

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

function Favourites() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [genreSearch, setGenreSearch] = useState("");
  const [experienceSearch, setExperienceSearch] = useState(0);
  const [filteredModels, setFilteredModels] = useState(availableModelList);
  const [showResults, setShowResults] = useState(false);  // Control showing results

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

  const handleSearch = useCallback(() => {
    const filtered = availableModelList.filter((model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      model.location.toLowerCase().includes(locationSearch.toLowerCase()) &&
      (genreSearch ? model.genre.toLowerCase() === genreSearch.toLowerCase() : true) &&
      model.experience >= experienceSearch
    );
    setFilteredModels(filtered);
  }, [searchTerm, locationSearch, genreSearch, experienceSearch]);

  const handleShowResults = () => {
    setShowResults(true);
    handleSearch();  // Trigger search on button click
  };

  return (
    <div className=''>
      <header className="sticky z-10 top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Search</span>
      </header>

      <div className='overflow-y-scroll h-full no-scrollbar my-8'>
        {/* Main Search Bar */}
        <div className='max-w-[800px] mx-auto relative h-[48px] w-full px-[24px] my-[24px]'>
          <input
            type="text"
            className='bg-[#EEF2F5] h-[48px] w-full pl-[20px] pr-[40px] rounded-md outline-none focus:outline-none'
            placeholder='Find your favourite Model'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className='absolute top-[50%] translate-y-[-50%] right-[34px]'>
            {searchIcon}
          </div>
        </div>

        {/* Location Search Bar */}
        <div className='max-w-[800px] mx-auto relative h-[48px] w-full px-[24px] my-[24px]'>
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
        </div>


        {/* Genre Search Bar */}
        <div className='max-w-[800px] mx-auto relative h-[48px] w-full px-[24px] my-[24px]'>
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
        </div>

        {/* Experience Slider */}
        <div className='w-[388px] mx-auto my-[24px]'>
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

          {/* Display selected years of experience */}
          <div className='text-center  text-[14px]'>
            {experienceSearch} Year{experienceSearch !== 1 ? 's' : ''}
          </div>
        </div>




        {/* Show Results Button */}
        <div className='w-[304px] h-[66px] mx-auto my-[24px]'>
          <button
            onClick={handleShowResults}
            className='w-full bg-[#2EC4B6] text-white py-2 rounded-md text-white'
          >
            Show Results
          </button>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className='max-w-[800px] mx-auto px-[10px] space-y-2 my-[24px]'>
            <div className='flex items-center justify-between'>
              <span className='text-[16px] font-medium leading-[24px]'>Search results</span>
              <Link href={"/"} className='text-[13px] leading-[20px] text-right text-[#999999]'>View all</Link>
            </div>

            {filteredModels.length === 0 ? (
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
        )}
      </div>
    </div>
  );
}

export default Favourites;







