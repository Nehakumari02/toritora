"use client"
import { UserTile } from '@/components/common/tile';
import TileSkeleton from '@/components/common/tileSkeleton';
import { airplanIcon, backIcon, graphIcon, walletIcon } from '@/constants/icons';
import { toast } from '@/hooks/use-toast';
import { useLogout } from '@/lib/logout';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function UsersListView() {
  const router = useRouter();
  const logout = useLogout();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modelsNew, setModelsNew] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo,setPageNo] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [totalPages,setTotalPages] = useState(0);
  const [profession, setProfession] = useState("");
  const [totalCount,setTotalCount] = useState(0);

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  useEffect(() => {
          try {
            const fetchNewUsers = async () => {
              try{
                const professionFromLS = localStorage.getItem('userProfession') || '';
                setProfession(professionFromLS);
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/data/models?pageNo=${pageNo}&pageSize=${pageSize}&type=${professionFromLS}&isNew=true`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials:"include",
                });
      
                if(res.status===200){
                  const data = await res.json();
                  const transformedModels = data.models?.map((user: any) => ({
                    name: `${user?.firstName ?? 'Toritora User'} ${user?.lastName ?? ''}`.trim(),
                    location: user.location,
                    profilePic: user.profilePicture,
                    userId: user.userId,
                    dateOfJoining: new Date(user.createdAt)
                  }));
                  setModelsNew(transformedModels);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/data/models?pageNo=${pageNo}&pageSize=${pageSize}&type=${profession}&isNew=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
      });

      if(res.status===200){
        const data = await res.json();
        const transformedModels = data.models?.map((user: any) => ({
          name: `${user?.firstName ?? 'Toritora User'} ${user?.lastName ?? ''}`.trim(),
          location: user.location,
          profilePic: user.profilePicture,
          userId: user.userId,
          dateOfJoining: new Date(user.createdAt)
        }));
        setModelsNew([...modelsNew,...transformedModels]);
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
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">New Users</span>
      </header>
      <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] my-4 space-y-4'>


      <div className='max-w-[800px] mx-auto px-[4px] md:px-[10px] space-y-2 my-[24px]'>
          <div className='space-y-4'>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(172px,1fr))] mx-auto gap-[10px] md:gap-[20px] py-2 rounded-md'>
              {
                loading ?
                  <TileSkeleton length={2}/>
                  :
                  (modelsNew?.map((item:any,index:number)=>(
                    <UserTile key={index} user={item} />
                  )))
              }
              {
                loadingMore &&
                <TileSkeleton length={2}/>
              }
            </div>
            <div>
              <span>Showing {hasMore?`${pageSize*(pageNo-1)}`:`${totalCount}`} of {totalCount} </span>
              {!loading && hasMore && <button disabled={loadingMore} onClick={loadMore} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{loadingMore ? <Loader2 className='animate-spin' /> : "Load more"}</button>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UsersListView