"use client"
import { backIcon } from '@/constants/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import feedbackHeroImage from '@/public/images/common/feedbackHeroImage.png';
import { uploadFileToS3, deleteFileS3 } from '@/lib/fileUpload';
import { toast } from '@/hooks/use-toast';

function Favourites() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [per,setPer] = useState(0);
  const [fileUrl,setFileUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async()=>{
    if (selectedFile) {
      const res = await uploadFileToS3(selectedFile, "profile/images");
      console.log("res from handle uplaod",res)
      setFileUrl(res)
    } else {
      console.error("No file selected");
    }
    
  }

  const handleDelete = async()=>{
    const res = await deleteFileS3(fileUrl)
    if(res==="success"){
      toast({
        title:"Success",
        variant:"success"
      })
      setFileUrl("")
    }
    else{
      toast({
        title:"Error",
        variant:"destructive"
      })
    }
  }
  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  return (
    <div className=''>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">Favourites</span>
      </header>
      
      {/* <div className='h-full flex flex-col items-center justify-center gap-32'>
        <div className='flex items-center justify-center mt-8'>
          <Image src={feedbackHeroImage} alt='Success' className='w-[220px] aspect-square'/>
        </div>
        <div className='text-center'>
          <span className='font-semibold text-[40px] leading-[64px] text-secondary'>Coming soon</span>
        </div>
      </div> */}

      {/* File Input */}
      <div className="flex flex-col items-center gap-4 my-8">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2"
          />
          {selectedFile && (
            <p className="text-sm text-gray-500">
              Selected File: {selectedFile.name}
            </p>
          )}
        </div>

        {per}

        <button className='m-4 px-8 py-4 bg-primary border rounded-md' onClick={handleUpload}>Upload</button>

        <div>
          {fileUrl && <span>file url : {fileUrl}</span>}
        </div>

        <div>
          {fileUrl&& <button className='m-4 px-8 py-4 bg-primary border rounded-md' onClick={handleDelete}>Delete Uploaded File</button>}
        </div>
    </div>
  )
}

export default Favourites
