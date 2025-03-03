"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Upload, XCircle, PlusCircle, Plus, X } from 'lucide-react';
import { uploadFileToS3 } from '@/lib/fileUpload';


import photographerBanner from '@/public/images/registration/infoBannerPhotography.jpeg'
import modelBanner from '@/public/images/registration/infoBannerModel.jpeg'
import Image from 'next/image';
import calendar from '../../../public/images/photographer_reg/calendar.png'
import location from '../../../public/images/photographer_reg/location.png'
import drive from '../../../public/images/photographer_reg/drive.png'
import mail from '../../../public/images/photographer_reg/email.png'
import phone from '../../../public/images/photographer_reg/mobile.png'
import user from '../../../public/images/photographer_reg/user.png'
import gender1 from '../../../public/images/photographer_reg/gender.png'
import password from '../../../public/images/photographer_reg/lock.png'
import instagram from '../../../public/images/photographer_reg/instagram.png'
import twitter from '../../../public/images/photographer_reg/twitter.png'
import { useToast } from '@/hooks/use-toast';

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   // DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   // DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import { DialogTitle } from '@radix-ui/react-dialog';

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

function RegistrationInfo() {
  const router = useRouter();
  const [profession, setProfession] = useState<string>("photographer");
  const [infoStep, setInfoStep] = useState<number>(1);
  const { toast } = useToast();

  const [subPhotos, setSubPhotos] = useState<File[]>([]);
  const [selectedFileProfilePic, setSelectedFileProfilePic] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (subPhotos.length + files.length > 5) {
      alert('You can only upload up to 5 photos.');
      return;
    }
    setSubPhotos([...subPhotos, ...files]);
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = subPhotos.filter((_, i) => i !== index);
    setSubPhotos(updatedPhotos);
  };

  const infoStepToWidth: { [key: number]: string } = useMemo(() => ({
    1: "13",
    2: "38",
    3: "63",
    4: "100"
  }), []);

  const handleGoBack = () => {
    router.back();
  }

  const handleBack = () => {
    if (infoStep > 1) {
      setInfoStep(infoStep - 1);
    }
  }

  const handleNext = () => {
    if (infoStep < 4) {
      setInfoStep(infoStep + 1);
    }
  }

  const handleSubmit = async () => {
    if (!validateForms()) return;

    const uploadPromises = [];

    // Handle subPhotos uploads
    const subPhotoUrls = subPhotos.map(photo => uploadFileToS3(photo, "modelPics/images"));
    uploadPromises.push(...subPhotoUrls);

    // Handle idProof upload
    let idProofUrl = '';
    if (idProof) {
      const idProofPromise = uploadFileToS3(idProof, "idProof/images").then(url => {
        idProofUrl = url;
        return url;
      });
      uploadPromises.push(idProofPromise);
    } else {
      console.error("No file selected for ID Proof");
    }

    // Handle selectedProfilePic upload
    let profilePicUrl = '';
    if (selectedFileProfilePic) {
      const profilePicPromise = uploadFileToS3(selectedFileProfilePic, "profilepic/images").then(url => {
        profilePicUrl = url;
        console.log("profilepic url", profilePicUrl)
        return url;
      });
      uploadPromises.push(profilePicPromise);
    } else {
      console.error("No file selected for Profile Picture");
    }

    try {
      // Run all uploads in parallel
      const uploadResults = await Promise.all(uploadPromises);
      console.log("Uploaded file URLs:", uploadResults);

      // Now send the form data to the backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registration/userDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          ...formData1,
          ...feedback,
          isProfileCompleted: true,
          profilePicture: profilePicUrl,
          idProof: idProofUrl,
          images: uploadResults.slice(0, subPhotos.length),
          achievements: achievements,
        }),
      });

      // Handle the response from the server
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "User details updated successfully",
          variant: "success",
        });
        router.push('/');
      } else if (res.status === 500) {
        toast({
          title: "Internal error",
          description: "Server internal error, please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during file upload or submission:", error);
      toast({
        title: "Error",
        description: "An error occurred during the upload or submission process",
        variant: "destructive",
      });
    }

    console.log("Submitting");
  };


  const [feedback, setFeedback] = useState({
    importantThing: '',
    stress: '',
    assistanceWithModels: '',
    hobbies: '',
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    mobile: "",
    postalCode: "",
    location: "",
    address: "",
  });

  const [formData1, setFormData1] = useState({
    profilePicture: '',
    // userId: '',
    // username: '',
    genres: '',
    achievements: [] as string[],
    cameraType: '',
    shootingPrice: '',
    transportationFee: '',
    snsUsername: '',
    website: '',
    selfIntroduction: '',
    photographyExperience: "", // New field for experience
    height: "",
    modellingExperiance: "",
    instagram: "",
    twitter: "",
    images: [] as string[], // Changed from File[] to string[] for URLs
    idProof: '',
  });

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      location: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    console.log(formData)

    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: (e.target as HTMLInputElement).files?.[0] || null,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleChangeFeedback = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      setFeedback((prevData) => ({
        ...prevData,
        [name]: (e.target as HTMLInputElement).files?.[0] || null,
      }));
    } else {
      setFeedback((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      setFormData1((prevData) => ({
        ...prevData,
        [name]: (e.target as HTMLInputElement).files?.[0] || null, // Handle file input properly
      }));
    } else if (type === 'select-one') {
      setFormData1((prevData) => ({
        ...prevData,
        [name]: value, // Handle select dropdown value
      }));
    } else {
      setFormData1((prevData) => ({
        ...prevData,
        [name]: value, // Handle input and textarea fields
      }));
    }
  };

  const validateForms = () => {
    const profession1 = localStorage.getItem('userProfession') || 'photographer';

    const excludedFields: Record<string, string[]> = {
      photographer: ["instagram", "twitter", "height", "modellingExperiance", "achievements"],
      modelling: [
        "photographyExperience",
        "cameraType",
        "shootingPrice",
        "transportationFee",
        "snsUsername",
        "website",
        "selfIntroduction",
        "achievements",
      ]
    };

    // Validate formData fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value && key !== "age" && key !== "username" && key !== "userId") {
        toast({
          title: "Error",
          description: `Please fill the ${key} field`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Validate formData1 fields in one loop
    const excluded = excludedFields[profession1] || [];
    for (const [key, value] of Object.entries(formData1)) {
      if (
        !value &&
        key !== "images" && key !== "profilePicture" && key !== "idProof" && key !== "username" && key !== "userId" && 
        !excluded.includes(key)
      ) {
        toast({
          title: "Error",
          description: `Please fill the ${key} field`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Validate subPhotos, selectedFileProfilePic, and idProof

    if (!selectedFileProfilePic) {
      toast({
        title: "Error",
        description: "Please upload a profile picture",
        variant: "destructive"
      });
      return false;
    }

    if (subPhotos.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one photo",
        variant: "destructive"
      });
      return false;
    }



    if (!idProof) {
      toast({
        title: "Error",
        description: "Please upload an ID proof",
        variant: "destructive"
      });
      return false;
    }

    if (!consent1 || !consent2) {
      toast({
        title: "Error",
        description: "You must agree to all consents before proceeding",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const [mobile, setMobile] = useState('');
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  const [achievements, setAchievements] = useState<string[]>(['', '']);

  const handleChangeAch = (index: number, value: string): void => {
    setAchievements(prev => prev.map((ach, i) => (i === index ? value : ach)));
  };

  const addAchievement = (): void => {
    setAchievements(prev => [...prev, '']);
  };

  const removeAchievement = (index: number): void => {
    setAchievements(prev => (prev.length > 2 ? prev.filter((_, i) => i !== index) : prev));
  };


  const handleFileChangeProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileProfilePic(file);
    }
  };
  const handleFileChangeIdProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdProof(file);
    }
  };

  const handleConsent1Change = () => {
    setConsent1(!consent1);
  };

  const handleConsent2Change = () => {
    setConsent2(!consent2);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      //setFile(droppedFile);
      console.log("File dropped:", droppedFile.name);
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const storedProfession = localStorage.getItem('userProfession');
    if (storedProfession) {
      setProfession(storedProfession);
    } else {
      setProfession("photographer"); // default value if not found in localStorage
    }
  }, []);

  return (
    <div className='h-[100dvh]'>
      <header className='relative w-full h-[72px] flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>Info</span>
      </header>
      <div className='flex flex-col flex-1 items-center space-y-4 overflow-y-scroll no-scrollbar'>
        <div className='h-[102px] overflow-hidden relative'>
          <Image src={profession === "photographer" ? photographerBanner : modelBanner} alt='Banner' />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[22px] leading-[32px] font-semibold text-white">
            {infoStep === 1 && <span>Primary Info / Personal Info</span>}
            {infoStep === 2 && <span>Professional Info</span>}
            {infoStep === 3 && <span>Verification</span>}
            {infoStep === 4 && <span>Questionaries</span>}
          </div>
        </div>

        <div className='w-[80%]'>
          {/* <div className={`h-[2px] w-[100%] bg-gradient-to-r from-primary from-${infoStepToWidth[infoStep]}% to-[#D4D3D8] to-${infoStepToWidth[infoStep]}% mt-5 flex items-center justify-around`}> */}
          <div
            className="h-[2px] w-full bg-gradient-to-r mt-5 flex items-center justify-around"
            style={{
              background: `linear-gradient(to right, #FF9F1C ${infoStepToWidth[infoStep]}%, #D4D3D8 ${infoStepToWidth[infoStep]}%)`
            }}
          >
            <div className={`${infoStep >= 1 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              1
              <span className={`${infoStep >= 1 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Personal Info</span>
            </div>
            <div className={`${infoStep >= 2 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              2
              <span className={`${infoStep >= 2 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Professional Info</span>
            </div>
            <div className={`${infoStep >= 3 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              3
              <span className={`${infoStep >= 3 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Verification</span>
            </div>
            <div className={`${infoStep >= 4 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              4
              <span className={`${infoStep >= 4 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>Questionaries</span>
            </div>
          </div>
        </div>

        <div className='flex-1 space-y-4'>

        </div>
        {infoStep === 1 &&
          <div className='flex-1 space-y-4 w-full p-6'>
            {/* First Name */}
            <label className='block text-sm'>First Name <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={user} alt='user' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='text'
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
                className='w-full outline-none text-[12px] '
              />
            </div>

            {/* Last Name */}
            <label className='block text-sm'>Last Name <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={user} alt='user' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='text'
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                className='w-full outline-none text-[12px] autofill:bg-white'
              />
            </div>

            {/* Date of Birth */}
            <label className='block text-sm'>Date of Birth <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2 bg-white relative">
              <Image src={calendar} alt="calendar" width={20} height={20} className="mr-2" />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full outline-none text-[12px] bg-white"
              />
              {/* {!formData.dateOfBirth && (
                <span className="absolute left-10 text-gray-400 text-[12px] pointer-events-none">
                  dd/mm/yyyy
                </span>
              )} */}
            </div>


            {/* Age */}
            <label className='block text-sm'>Age (optional)</label>
            <div className="flex items-center border rounded p-2">
              <Image src={calendar} alt='calendar' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='number'
                name='age'
                placeholder='Age'
                value={formData.age}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div>

            {/* Gender */}
            <label className='block text-sm'>Gender <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {['Male', 'Female'].map((gender) => (
                <label key={gender} className="text-sm flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                    className="hidden peer"
                  />
                  <div className="w-4 h-4 mr-1 rounded-full border-2 border-black-600 relative">
                    {/* Inner dot for selected state */}
                    <div className={`w-2 h-2 bg-[#2EC4B6] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${formData.gender === gender ? 'block' : 'hidden'}`}></div>
                  </div>
                  {gender}
                </label>
              ))}
            </div>




            {/* Mobile Number */}
            <label className='block text-sm'>Mobile Number <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={phone} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='tel'
                name='mobile'
                placeholder='Mobile Number'
                value={formData.mobile}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div>

            {/* Password */}
            {/* <label className='block text-sm'>Password</label>
            <div className="flex items-center border rounded p-2">
              <Image src={password} alt='gender' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='password'
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div> */}

            {/* Confirm Password */}
            {/* <label className='block text-sm'>Confirm Password</label>
            <div className="flex items-center border rounded p-2">
              <Image src={password} alt='gender' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div> */}

            {/* Postal Code */}
            <label className='block text-sm'>Postal Code <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={mail} alt='email' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='text'
                name='postalCode'
                placeholder='Postal Code'
                value={formData.postalCode}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div>

            {/* Location */}
            <label className='block text-sm'>Location <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={location} alt='location' width={20} height={20} className="h-[20px] w-[20px] text-gray-500 mr-2" />
              <Select value={formData.location} onValueChange={handleSelectChange}>
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

            {/* Address */}
            <label className='block text-sm'>Address <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={location} alt='location' width={20} height={20} className="h-[20px] w-[20px] text-gray-500 mr-2" />
              <input
                type='text'
                name='address'
                placeholder='Address'
                value={formData.address}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div>
          </div>


        }

        {infoStep === 2 && profession === 'photographer' &&
          <div className="flex-1 space-y-4 w-full p-6">
            {/* User ID Field with Icon */}
            <div className="w-full max-w-md mx-auto">
              {/* Label with Drive Icon in Gray Circle */}
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className='flex flex-col gap-2'>
                  <div className='text-[16px] font-500 '>
                    Profile Picture <span className="text-red-500">*</span>
                  </div>
                  <div className='text-[12px] font-400 ' >
                    This will be displayed on your profile
                  </div>
                </div>

                <div className="mx-auto mr-3 w-[80px] h-[80px] bg-gray-300 rounded-full flex items-center justify-center">
                  <Image
                    src={drive}
                    alt="Drive Icon"
                    className="w-5 h-5 object-contain"
                  />

                </div>
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChangeProfilePic}
                />
                {selectedFileProfilePic && (
                  <p className="text-green-600 text-[10px] text-center mt-2">
                    {selectedFileProfilePic.name.length > 7
                      ? `${selectedFileProfilePic.name.slice(0, 3)}...${selectedFileProfilePic.name.slice(-4)}`
                      : selectedFileProfilePic.name}
                  </p>
                )}
                {/* {formData1.profilePicture && (

                  <p className="text-green-600 text-[10px] text-center mt-2">file uploaded</p>
                )} */}
              </label>
            </div>

            {/* <label className="block text-sm">UserId <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={user} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="userId"
                placeholder="UserId"
                value={formData1.userId}
                onChange={handleChange1}
                className="w-full outline-none text-[12px] bg-white autofill:bg-white"
              />
            </div> */}

            {/* Username Field with Icon */}
            {/* <label className="block text-sm">Username <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2 bg-white">
              <Image src={user} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData1.username}
                onChange={handleChange1}
                className="w-full outline-none text-[12px] bg-white autofill:bg-white"
              />
            </div> */}


            <label className="block text-sm">Genres You Are Good At <span className="text-red-500">*</span></label>
            <select
              name="genres"
              value={formData1.genres}
              onChange={handleChange1}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
            >
              <option value="">Select Genres</option>
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
              <option value="Wedding">Wedding</option>
              <option value="Fashion">Fashion</option>
              <option value="Nature">Nature</option>
              <option value="Event">Event</option>
              <option value="Product">Product</option>
            </select>

            <div className="relative border border-gray-300 rounded p-4">
              <label className="block text-sm mb-4">Achievements</label>

              {/* Plus Icon in Top-Right Corner */}
              <button
                type="button"
                onClick={addAchievement}
                className="absolute top-2 right-2 p-1  text-[#2EC4B6] rounded-full"
                aria-label="Add Achievement"
              >
                <div className='flex text-[12px] gap-1'>
                  <Plus size={14} />
                  <div>Add More</div>
                </div>
              </button>

              {/* Achievement Inputs */}
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Achievement ${index + 1}`}
                    value={achievement}
                    onChange={(e) => handleChangeAch(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
                  />
                  {achievements.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="p-2 bg-[#FF9F1C] text-white rounded hover:bg-red-600 text-[12px]"
                      aria-label="Remove Achievement"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <label className="block text-sm">Camera Type <span className="text-red-500">*</span></label>
            <input type="text" name="cameraType" placeholder="E.g. Canon EOS R5" value={formData1.cameraType} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            {/* New Field for Photography Experience */}
            <label className="block text-sm">Photography Experience (Years) <span className="text-red-500">*</span></label>
            <input type="number" name="photographyExperience" placeholder="Enter years of experience" value={formData1.photographyExperience} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">Shooting Price Per Hour <span className="text-red-500">*</span></label>
            <input type="number" name="shootingPrice" placeholder="Price per hour" value={formData1.shootingPrice} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">Transportation Fee <span className="text-red-500">*</span></label>
            <input type="number" name="transportationFee" placeholder="Transportation fee" value={formData1.transportationFee} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">SNS Username <span className="text-red-500">*</span></label>
            <input type="text" name="snsUsername" placeholder="Instagram, Twitter, etc." value={formData1.snsUsername} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">Website <span className="text-red-500">*</span></label>
            <input type="url" name="website" placeholder="Your website URL" value={formData1.website} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">Self Introduction <span className="text-red-500">*</span></label>
            <textarea name="selfIntroduction" placeholder="Introduce yourself" value={formData1.selfIntroduction} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" ></textarea>

            <div className="p-4 border rounded-xl bg-white shadow-lg relative">
              <h2 className="text-[14px] font-semibold mb-4">Add Sub Photos  up to 5 <span className="text-red-500">*</span> </h2>
              <h2 className="text-[10px] font-400 mb-4">Please add images and select their genres</h2>
              {/* Add More Button at Top Right */}
              {subPhotos.length < 5 && (
                <label htmlFor="subphoto-upload" className="absolute top-2 right-3 cursor-pointer flex ">
                  <Plus size={16} className="text-[#2EC4B6] hover:text-blue-700" />
                  <div className='text-[12px] text-[#2EC4B6]'>Add More</div>

                </label>
              )}

              {/* Photo Previews with Add Button */}
              <div className="flex gap-4 mb-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="w-24 h-24 border rounded-xl flex items-center justify-center bg-gray-100 relative w-[105px] h-[105px]">
                    {subPhotos[index] ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(subPhotos[index])}
                          alt={`SubPhoto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          onClick={() => removePhoto(index)}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="subphoto-upload" className="w-full h-full flex items-center justify-center cursor-pointer flex flex-col gap-2">
                        <Plus size={16} className="text-[#FF9F1C] hover:text-gray-700" />
                        <div className='text-[8px]'>Add Image</div>
                      </label>
                    )}
                  </div>
                ))}
              </div>

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange2}
                className="hidden"
                id="subphoto-upload"
              />

              {/* Info Message */}
              {subPhotos.length >= 5 && (
                <p className="text-sm text-red-500 mt-2">Maximum 5 photos reached.</p>
              )}
            </div>

          </div>
        }

        {infoStep === 2 && profession === 'modelling' &&
          <div className="flex-1 space-y-4 w-full p-6">
            {/* User ID Field with Icon */}
            <div className="w-full max-w-md mx-auto">
              {/* Label with Drive Icon in Gray Circle */}
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className='flex flex-col gap-2'>
                  <div className='text-[16px] font-500 '>
                    Profile Picture <span className="text-red-500">*</span>
                  </div>
                  <div className='text-[12px] font-400 ' >
                    This will be displayed on your profile
                  </div>
                </div>

                <div className="mx-auto mr-3 w-[80px] h-[80px] bg-gray-300 rounded-full flex items-center justify-center">
                  <Image
                    src={drive}
                    alt="Drive Icon"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChangeProfilePic}
                />
                {selectedFileProfilePic && (
                  <p className="text-green-600 text-[10px] text-center mt-2">
                    {selectedFileProfilePic.name.length > 7
                      ? `${selectedFileProfilePic.name.slice(0, 3)}...${selectedFileProfilePic.name.slice(-4)}`
                      : selectedFileProfilePic.name}
                  </p>
                )}
              </label>
            </div>

            {/* <label className="block text-sm">UserId <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={user} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="userId"
                placeholder="UserId"
                value={formData1.userId}
                onChange={handleChange1}
                className="w-full outline-none text-[12px]"
              />
            </div> */}

            {/* Username Field with Icon */}
            {/* <label className="block text-sm">Username <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={user} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData1.username}
                onChange={handleChange1}
                className="w-full outline-none text-[12px]"
              />
            </div> */}



            <label className="block text-sm">Genres You Are Good At <span className="text-red-500">*</span></label>
            <select
              name="genres"
              value={formData1.genres}
              onChange={handleChange1}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
            >
              <option value="">Preety</option>
              <option value="Portrait">Cute</option>
              <option value="Landscape">Cool</option>
              <option value="Wedding">Clean</option>
              <option value="Fashion">Natural</option>
              <option value="Nature">Art</option>
              <option value="Event">Dark</option>
              <option value="Product">Others</option>
            </select>
            <div className="relative border border-gray-300 rounded p-4">
              <label className="block text-sm mb-4">Achievements</label>

              {/* Plus Icon in Top-Right Corner */}
              <button
                type="button"
                onClick={addAchievement}
                className="absolute top-2 right-2 p-1  text-[#2EC4B6] rounded-full"
                aria-label="Add Achievement"
              >
                <div className='flex text-[12px] gap-1'>
                  <Plus size={14} />
                  <div>Add More</div>
                </div>
              </button>

              {/* Achievement Inputs */}
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Achievement ${index + 1}`}
                    value={achievement}
                    onChange={(e) => handleChangeAch(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
                  />
                  {achievements.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="p-2 bg-[#FF9F1C] text-white rounded hover:bg-red-600 text-[12px]"
                      aria-label="Remove Achievement"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <label className="block text-sm">Height (in cms) <span className="text-red-500">*</span></label>
            <input type="number" name="height" placeholder="Enter value" value={formData1.height} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-[#FF9F1C] focus:outline-none transition" />

            {/* New Field for Photography Experience */}
            <label className="block text-sm">Modeling Experience (Years) <span className="text-red-500">*</span></label>
            <input type="number" name="modellingExperiance" placeholder="Enter value" value={formData1.modellingExperiance} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-[#FF9F1C] focus:outline-none transition" />

            <div className="p-4 border rounded-xl bg-white shadow-lg relative">
              <h2 className="text-[14px] font-semibold mb-4">Add Sub Photos  up to 5 <span className="text-red-500">*</span> </h2>
              <h2 className="text-[10px] font-400 mb-4">Please add images and select their genres</h2>
              {/* Add More Button at Top Right */}
              {subPhotos.length < 5 && (
                <label htmlFor="subphoto-upload" className="absolute top-2 right-3 cursor-pointer flex ">
                  <Plus size={16} className="text-[#2EC4B6] hover:text-blue-700" />
                  <div className='text-[12px] text-[#2EC4B6]'>Add More</div>

                </label>
              )}

              {/* Photo Previews with Add Button */}
              <div className="flex gap-4 mb-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="w-24 h-24 border rounded-xl flex items-center justify-center bg-gray-100 relative w-[105px] h-[105px]">
                    {subPhotos[index] ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(subPhotos[index])}
                          alt={`SubPhoto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          onClick={() => removePhoto(index)}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="subphoto-upload" className="w-full h-full flex items-center justify-center cursor-pointer flex flex-col gap-2">
                        <Plus size={16} className="text-[#FF9F1C] hover:text-gray-700" />
                        <div className='text-[8px]'>Add Image</div>
                      </label>
                    )}
                  </div>
                ))}
              </div>

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange2}
                className="hidden"
                id="subphoto-upload"
              />

              {/* Info Message */}
              {subPhotos.length >= 5 && (
                <p className="text-sm text-red-500 mt-2">Maximum 5 photos reached.</p>
              )}
            </div>


            <label className="block text-[14px]">Instagram Username <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={instagram} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="instagram"
                placeholder="https://www.instagram.com/yourusername"
                value={formData1.instagram}
                onChange={handleChange1}
                className="w-full outline-none text-[12px]"
              />
            </div>

            <label className="block text-[14px]">Twitter Username <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={twitter} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="twitter"
                placeholder="https://twitter.com/yourusername"
                value={formData1.twitter}
                onChange={handleChange1}
                className="w-full outline-none text-[12px]"
              />
            </div>

          </div>
        }




        {infoStep === 3 &&
          <div className="flex-1  space-y-4 w-full p-6 ">
            {/* Email Verification */}
            <label className="block text-sm">Email</label>
            <div className='flex item-center justify-center customPlaceholderText '>
              <div className="pl-4 w-[70%] flex items-center border-t-[1px] border-l-[1px] border-b-[1px] rounded-tl-md rounded-bl-md bg-[#D9D9D9]  pl-1 h-[48px]">

                <Image src={mail} alt='email' width={20} height={20} className=" mr-2" />
                <input
                  type="email"
                  placeholder="Your Email Id"
                  //value={email}
                  //onChange={handleEmailChange}
                  className="w-full outline-none text-[12px]  pointer-events-none cursor-not-allowed bg-transparent text-[#333333]"
                />


              </div>
              <button
                className=" h-[48px] text-[#2EC458]  px-[2px] rounded  text-sm w-[30%] flex items-center justify-center gap-1 bg-white border-t-[1px] border-r-[1px] border-b-[1px] rounded-tr-md rounded-br-md "
              >
                <FaCheckCircle />
                Verified
              </button>
            </div>

            {/* Mobile Number Verification */}
            {/* <label className="block text-sm">Mobile Number <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-1 pl-3">
              <Image src={phone} alt='email' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="tel"
                placeholder="Your Mobile Number"
                value={mobile}
                onChange={handleMobileChange}
                className="w-full outline-none text-[12px]"
              />
              <button
                onClick={sendMobileOtp}
                className=" font-600 text-[#FF9F1C] bg-white px-1 py-1 rounded ml-1 w-1/2 h-[40px] text-[12px]"
              >
                Send OTP
              </button>
            </div>

            <label className="block text-sm ">Enter OTP for Mobile</label>
            <div className="flex items-center border rounded p-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpMobile}
                onChange={handleOtpMobileChange}
                className="w-full outline-none text-[12px]"
              />
            </div>
            <button
              onClick={verifyMobileOtp}
              className="mt-2 bg-[#2EC4B6] text-white px-4 py-2 rounded text-[12px]"
            >
              Verify OTP
            </button>
            {mobileVerified && <p className="text-green-500">Mobile Verified Successfully</p>} */}

            <div className="max-w-md mx-auto mb-8 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center mt-12">
                ID Proof <span className="text-red-500">*</span>
              </label>
              <div className='w-full flex flex-center item-center w-full'>
                <div
                  className="w-full h-[162px] text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition"
                  onDragOver={handleDragOver} // Corrected event handler
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Placeholder image */}
                  <Image
                    src={drive}
                    alt="Upload Icon"
                    className="w-[60px] h-[40px] object-cover mb-3"
                  />
                  {!idProof && (<p className="text-gray-500 text-[10px]">It may contains Driver&apos;s license, National id or any ID Proof</p>
                  )}
                  {/* {idProof && (

                    <p className="text-green-600 text-sm text-center mt-2">file uploaded sucessfully</p>
                  )} */}

                  {idProof && (
                    <p className="text-green-600 text-[10px] text-center mt-2">
                      {idProof.name}
                    </p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChangeIdProof}
                    className="hidden"
                  />
                </div>
                {/* Upload status message */}
              </div>

            </div>
            <div className='text-[12px] mt-4 pt-2 mb-3 font-400'>Note : Best Resolution 100px*100px, Image should not exceed more than 2MB
            </div>
            {/* Consent Checkboxes */}
            <div className="flex gap-4 mt-4 pt-6">
              <label className="text-[12px] font-400 flex items-center">
                <input
                  type="checkbox"
                  checked={consent1}
                  onChange={handleConsent1Change}
                  className="flex-shrink-0 h-[16px] w-[16px] mr-2 text-[12px]  accent-[#FF9F1C]"
                />

                I have confirmed that my personal information is correct.
              </label>
            </div>
            <div className="flex gap-4 mt-2 text-[12px]">
              <label className="text-[12px] font-400 accent-orange-500 flex items-center">
                <input
                  type="checkbox"
                  checked={consent2}
                  onChange={handleConsent2Change}
                  className="flex-shrink-0 h-[16px] w-[16px] text-[12px] mr-2 accent-[#FF9F1C]"
                />
                I would like to receive e-mails about the latest information such as events and model entries.
              </label>
            </div>
          </div>
        }

        {infoStep === 4 && profession === 'photographer' &&
          <div className="flex-1 space-y-4 w-full p-6">

            {/* Question 1 */}
            <label className="block text-sm">1. What is the most important thing for you at Photorage Photography?</label>
            <textarea
              name="importantThing"
              value={feedback.importantThing}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 2 */}
            <label className="block text-sm">2. Do you have any stress at Photorage Photography? What is it?</label>
            <textarea
              name="stress"
              value={feedback.stress}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 3 */}
            <label className="block text-sm">3. Do you have any assistance with models? What is it?</label>
            <textarea
              name="assistanceWithModels"
              value={feedback.assistanceWithModels}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 4 */}
            <label className="block text-sm">4. Please tell me your hobbies.</label>
            <textarea
              name="hobbies"
              value={feedback.hobbies}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

          </div>
        }
        {infoStep === 4 && profession === 'modelling' &&
          <div className="flex-1 space-y-4 w-full p-6">

            {/* Question 1 */}
            <label className="block text-sm">1. Why did you become models?</label>
            <textarea
              name="importantThing"
              value={feedback.importantThing}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 2 */}
            <label className="block text-sm">2. What is the most important thing for you in a photo session?</label>
            <textarea
              name="stress"
              value={feedback.stress}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 3 */}
            <label className="block text-sm">3. What do you think photographers have to do in a photo session? Do you need any assistance</label>
            <textarea
              name="assistanceWithModels"
              value={feedback.assistanceWithModels}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 4 */}
            <label className="block text-sm">4. Please tell me your hobbies.</label>
            <textarea
              name="hobbies"
              value={feedback.hobbies}
              onChange={handleChangeFeedback}
              placeholder="Write your answer here..."
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

          </div>
        }
        <div className='py-4 w-[80%] flex items-center justify-center gap-4'>
          <button onClick={handleBack} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center border-[1px] text-secondary flex items-center justify-center rounded-md'>Back</button>
          {infoStep < 4 && <button onClick={handleNext} className='w-full h-[54px] text-[14px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>NEXT</button>}
          {infoStep == 4 && <button onClick={handleSubmit} className='w-full h-[54px] text-[14px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>SUBMIT</button>}
        </div>

      </div>


    </div>
  )
}

export default RegistrationInfo
