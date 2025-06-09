"use client"
import { backIcon } from '@/constants/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import feedbackHeroImage from '@/public/images/common/feedbackHeroImage.png';
import { useToast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';
import TileSkeleton from '@/components/common/tileSkeleton';
import { UserTile } from '@/components/common/tile';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

function Favourites() {
  const router = useRouter();
  const t = useTranslations("MyPage.myFavouritesPage")
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favUser, setFavUser] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo,setPageNo] = useState(1);
  const [pageSize,setPageSize] = useState(5);
  const [totalPages,setTotalPages] = useState(0);
  const [profession, setProfession] = useState("");
  const [totalCount,setTotalCount] = useState(0);
  const {toast} = useToast();
  const logout = useLogout();

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  useEffect(() => {
    try {
      const fetchNewUsers = async () => {
        try{
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite?pageNo=${pageNo}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials:"include",
          });

          if(res.status===200){
            const data = await res.json();
            console.log(data)
            const transformedUsers = data.favourites?.map((user: any) => ({
              name: `${user?.f_user_id?.firstName ?? 'Toritora User'} ${user?.f_user_id?.lastName ?? ''}`.trim(),
              location: user.f_user_id?.location,
              profilePic: user.f_user_id?.profilePicture,
              userId: user.f_user_id?.userId,
              dateOfJoining: new Date(user.f_user_id?.createdAt)
            }));
            setFavUser(transformedUsers);
            setTotalPages(data.totalPages);
            setHasMore(pageNo<data.totalPages);
            setTotalCount(data.totalCount);
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
      fetchNewUsers();
    } catch (error) {
      console.log("Error", error)
    }
  }, [])

  const loadMore = async () => {
  setLoadingMore(true);
  try{
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite?pageNo=${pageNo}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:"include",
  });

  if(res.status===200){
    const data = await res.json();
    const transformedUsers = data.favourites?.map((user: any) => ({
      name: `${user?.f_user_id?.firstName ?? 'Toritora User'} ${user?.f_user_id?.lastName ?? ''}`.trim(),
      location: user.f_user_id?.location,
      profilePic: user.f_user_id?.profilePicture,
      userId: user.f_user_id?.userId,
      dateOfJoining: new Date(user.f_user_id?.createdAt)
    }));
    setFavUser([...favUser,...transformedUsers]);
    setTotalPages(data.totalPages);
    setHasMore(pageNo<data.totalPages);
    setTotalCount(data.totalCount);
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
    <div className='overflow-y-scroll no-scrollbar h-full bg-[#F0F0F1]'>
      <header className="sticky z-50 top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("favourites")}</span>
      </header>
      
      {/* <div className='h-full flex flex-col items-center justify-center gap-32'>
        <div className='flex items-center justify-center mt-8'>
          <Image src={feedbackHeroImage} alt='Success' className='w-[220px] aspect-square'/>
        </div>
        <div className='text-center'>
          <span className='font-semibold text-[40px] leading-[64px] text-secondary'>Coming soon</span>
        </div>
      </div> */}

        <div className='max-w-[800px] mx-4 md:mx-auto px-[4px] md:px-[10px] space-y-2 my-[24px]'>
          <div className='space-y-4'>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(172px,1fr))] mx-auto gap-[10px] md:gap-[20px] py-2 rounded-md'>
              {
                loading ?
                  <TileSkeleton length={2}/>
                  :
                  (favUser?.map((item:any,index:number)=>(
                    <UserTile key={index} user={item} />
                  )))
              }
              {
                loadingMore &&
                <TileSkeleton length={2}/>
              }
            </div>
            <div>
              <span>{t("showing")} {hasMore?`${pageSize*(pageNo-1)}`:`${totalCount}`} / {totalCount} </span>
              {!loading && hasMore && <button disabled={loadingMore} onClick={loadMore} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingMore ? <Loader2 className='animate-spin' /> : t("loadMore")}</button>}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Favourites
