"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useTranslations } from 'next-intl'
import { useLogout } from '@/lib/logout';
import { useToast } from '@/hooks/use-toast';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

function Feedback() {
  const router = useRouter();
  const { toast } = useToast();
  const [images,setImages] = useState([]);
  const t = useTranslations('MyPage.feedback');
  const logout = useLogout();
  const [loading,setLoading] = useState(true);

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  useEffect(() => {
        const fetchUser = async () => {
          try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/user/gallery`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: "include",
            });
  
            const data = await res.json();
  
            if (res.status === 200) {
              setImages(data.images)
            }
            else if (res.status === 401) {
              toast({
                title: "Error",
                description: "unauthorized",
                variant: "destructive"
              })
              logout();
            }
            else {
              toast({
                title: "serverError",
                description: `Error: ${data.message}`,
                variant: "destructive"
              })
            }
          } catch (error) {
            console.log("Error", error)
          } finally {
            setLoading(false)
          }
        }
  
        fetchUser();
    }, [])

    const handleDeleteImage = async (url:string) => {
      console.log(url)
    }
  return (
    <div className='flex flex-col h-full'>
      <header className="sticky z-100 top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">My Gallery</span>
      </header>
      <div className='mx-4 md:mx-auto md:px-4 md:max-w-[800px] my-8 space-y-8 overflow-y-scroll flex-1 no-scrollbar'>
        <div className="columns-1 sm:columns-2 md:columns-3 gap-2 md:gap-4 space-y-2 md:space-y-4">
          {loading && (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-40 w-full bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </>
          )}
    
          {!loading && images?.length === 0 && (
            <div className="pb-8 w-full items-center">
              <span className="block text-sm text-center font-semibold text-gray-500">
                No photos to show
              </span>
            </div>
          )}
    
          {!loading &&
            images?.map((src, index) => (
              <div key={index} className='relative w-[240px] h-[240px] mx-auto'>
                <img
                  className="w-[240px] h-[240px] md:w-[240px] md:h-[240px] object-cover rounded-lg mx-auto"
                  src={src}
                  alt={`Image ${index + 1}`}
                />
                <AlertDialog>
                  <AlertDialogTrigger className='absolute top-2 right-2 bg-white p-2 rounded-full active:scale-95'>{deleteIcon}</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete image from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className='bg-secondary hover:bg-secondary hover:opacity-85' onClick={()=>handleDeleteImage(src)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Feedback

const deleteIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E10101" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
<path d="M3 6h18" />
<path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
<line x1="10" y1="11" x2="10" y2="17" />
<line x1="14" y1="11" x2="14" y2="17" />
</svg>