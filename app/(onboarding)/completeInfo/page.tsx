"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Upload, XCircle, PlusCircle, Plus, X, Loader2 } from 'lucide-react';
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
import { useTranslations } from 'next-intl'

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
  const [submitting, setSubmitting] = useState(false);

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
    // if (!validateForms()) return;
    if (!formData.firstName) {
      toast({
        title: "Error",
        description: t("error_first_name"),
        variant: "destructive"
      })
      return;
    }
    if (!formData.lastName) {
      toast({
        title: "Error",
        description: t("error_last_name"),
        variant: "destructive"
      })
      return;
    }
    if (!formData1.snsUsername && profession === "photographer") {
      toast({
        title: "Error",
        description: t("error_sns_username"),
        variant: "destructive"
      })
      return;
    }
    setSubmitting(true);

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
      console.log("No file selected for ID Proof");
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
      console.log("No file selected for Profile Picture");
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
          title: "",
          description: t("success_update"),
          variant: "success",
        });
        router.push('/');
      } else if (res.status === 500) {
        toast({
          title: "Internal error",
          description: t("error_internal"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during file upload or submission:", error);
      toast({
        title: "Error",
        description: t("error_submission"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false)
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

  const t = useTranslations('CompleteInfo');

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
        <span className='text-[16px] leading-[24px] text-center font-semibold'>{t("info")}</span>
      </header>
      <div className='flex flex-col flex-1 items-center space-y-4 overflow-y-scroll no-scrollbar'>
        <div className='h-[102px] overflow-hidden relative'>
          <Image src={profession === "photographer" ? photographerBanner : modelBanner} alt='Banner' />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[22px] leading-[32px] font-semibold text-white">
            {infoStep === 1 && <span>{t("primaryInfo")}</span>}
            {infoStep === 2 && <span>{t("professionalInfo")}</span>}
            {infoStep === 3 && <span>{t("verification")}</span>}
            {infoStep === 4 && <span>{t("questionnaires")}</span>}
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
              <span className={`${infoStep >= 1 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>{t("step1")}</span>
            </div>
            <div className={`${infoStep >= 2 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              2
              <span className={`${infoStep >= 2 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>{t("professionalInfo")}</span>
            </div>
            <div className={`${infoStep >= 3 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              3
              <span className={`${infoStep >= 3 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>{t("verification")}</span>
            </div>
            <div className={`${infoStep >= 4 ? "bg-primary text-white border-primary" : "bg-white"} relative border-[1px] flex items-center justify-center h-[24px] w-[24px] rounded-full text-center text-[11px] leading-[15px] font-medium`}>
              4
              <span className={`${infoStep >= 4 ? "text-[9px] leading-[13px] font-semibold text-primary" : "text-[8px] leading-[11px] font-normal text-[#333333]"} text-nowrap absolute left-[50%] translate-x-[-50%] bottom-[-20px]`}>{t("questionnaires")}</span>
            </div>
          </div>
        </div>

        <div className='flex-1 space-y-4'>

        </div>
        {infoStep === 1 &&
          <div className='flex-1 space-y-4 w-full p-6'>
            {/* Last Name */}
            <label className='block text-sm'>{t("lastName")} <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={user} alt='user' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='text'
                name='lastName'
                placeholder={t("lastName")}
                value={formData.lastName}
                onChange={handleChange}
                className='w-full outline-none text-[12px] autofill:bg-white'
              />
            </div>
            {/* First Name */}
            <label className='block text-sm'>{t("firstName")} <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={user} alt='user' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='text'
                name='firstName'
                placeholder={t("firstName")}
                value={formData.firstName}
                onChange={handleChange}
                className='w-full outline-none text-[12px] '
              />
            </div>



            {/* Date of Birth */}
            <label className='block text-sm'>{t("dateOfBirth")} <span className="text-red-500 hidden">*</span></label>
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
            <label className='block text-sm'>{t("age")}</label>
            <div className="flex items-center border rounded p-2">
              <Image src={calendar} alt='calendar' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='number'
                name='age'
                placeholder={t("age")}
                value={formData.age}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div>

            {/* Gender */}
            <label className="block text-sm">
              {t("gender")} <span className="text-red-500 hidden">*</span>
            </label>

            <div className="flex gap-4">
              {[
                { label: t("male"), value: "male" },
                { label: t("female"), value: "female" },
              ].map(({ label, value }) => (
                <label key={value} className="text-sm flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={formData.gender === value}
                    onChange={handleChange}
                    className="hidden peer"
                  />
                  <div className="w-4 h-4 mr-1 rounded-full border-2 border-black-600 relative">
                    {/* Inner dot for selected state */}
                    <div
                      className={`w-2 h-2 bg-[#2EC4B6] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${formData.gender === value ? "block" : "hidden"
                        }`}
                    ></div>
                  </div>
                  {label}
                </label>
              ))}
            </div>





            {/* Mobile Number */}
            <label className='block text-sm'>{t("mobile")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={phone} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='tel'
                name='mobile'
                placeholder={t("mobile")}
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
            <label className='block text-sm'>{t("postalCode")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={mail} alt='email' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type='text'
                name='postalCode'
                placeholder={t("postalCode")}
                value={formData.postalCode}
                onChange={handleChange}
                className='w-full outline-none text-[12px]'
              />
            </div>

            {/* Location */}
            <label className='block text-sm'>{t("location")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={location} alt='location' width={20} height={20} className="h-[20px] w-[20px] text-gray-500 mr-2" />
              <Select value={formData.location} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full h-[18px] border-none outline-none focus:ring-0 shadow-none p-0">
                  <SelectValue placeholder={t("selectLocation")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("selectLocation")}</SelectLabel>
                    {prefectures.map((prefecture) => (
                      <SelectItem key={prefecture} value={prefecture}>
                        {t(prefecture)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <label className='block text-sm'>{t("address")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={location} alt='location' width={20} height={20} className="h-[20px] w-[20px] text-gray-500 mr-2" />
              <input
                type='text'
                name='address'
                placeholder={t("address1")}
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
                    {t("profilePicture")} <span className="text-red-500 hidden">*</span>
                  </div>
                  <div className='text-[12px] font-400 ' >
                    {t("profilePictureDesc")}
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


            <label className="block text-sm">{t("genres")}<span className="text-red-500 hidden">*</span></label>
            <select
              name="genres"
              value={formData1.genres}
              onChange={handleChange1}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
            >
              <option value="">{t("selectGenres")}</option>
              <option value="Portrait">{t("portrait")}</option>
              <option value="Landscape">{t("landscape")}</option>
              <option value="Wedding">{t("wedding")}</option>
              <option value="Fashion">{t("fashion")}</option>
              <option value="Nature">{t("nature")}</option>
              <option value="Event">{t("event")}</option>
              <option value="Product">{t("product")}</option>
            </select>

            <div className="relative border border-gray-300 rounded p-4">
              <label className="block text-sm mb-4">{t("achievements")}</label>

              {/* Plus Icon in Top-Right Corner */}
              <button
                type="button"
                onClick={addAchievement}
                className="absolute top-2 right-2 p-1  text-[#2EC4B6] rounded-full"
                aria-label="Add Achievement"
              >
                <div className='flex text-[12px] gap-1'>
                  <Plus size={14} />
                  <div>{t("addMore")}</div>
                </div>
              </button>

              {/* Achievement Inputs */}
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`${t("pAchievement")} ${index + 1}`}

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
            <label className="block text-sm">{t("cameraType")} <span className="text-red-500 hidden">*</span></label>
            <input type="text" name="cameraType" placeholder={t("cameraPlaceholder")} value={formData1.cameraType} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            {/* New Field for Photography Experience */}
            <label className="block text-sm">{t("photographyExperience")} <span className="text-red-500 hidden">*</span></label>
            <input type="number" name="photographyExperience" placeholder={t("photographyPlaceholder")} value={formData1.photographyExperience} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">{t("shootingPrice")}  <span className="text-red-500 hidden">*</span></label>
            <input type="number" name="shootingPrice" placeholder={t("shootingPlaceholder")} value={formData1.shootingPrice} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">{t("transportationFee")} <span className="text-red-500 hidden">*</span></label>
            <input type="number" name="transportationFee" placeholder={t("transportationFee")} value={formData1.transportationFee} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">{t("snsUsername")} <span className="text-red-500">*</span></label>
            <input type="text" name="snsUsername" placeholder={t("snsPlaceholder")} value={formData1.snsUsername} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">{t("website")} <span className="text-red-500 hidden">*</span></label>
            <input type="url" name="website" placeholder={t("websitePlaceholder")} value={formData1.website} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" />

            <label className="block text-sm">{t("selfIntroduction")} <span className="text-red-500 hidden">*</span></label>
            <textarea name="selfIntroduction" placeholder={t("selfIntroductionPlaceholder")} value={formData1.selfIntroduction} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition" ></textarea>

            <div className="p-4 border rounded-xl bg-white shadow-lg relative">
              <h2 className="text-[14px] font-semibold mb-4">{t("addSubPhotos")} <span className="text-red-500 hidden">*</span> </h2>
              <h2 className="text-[10px] font-400 mb-4">{t("addSubPhotosInfo")}</h2>
              {/* Add More Button at Top Right */}
              {subPhotos.length < 5 && (
                <label htmlFor="subphoto-upload" className="absolute top-2 right-3 cursor-pointer flex ">
                  <Plus size={16} className="text-[#2EC4B6] hover:text-blue-700" />
                  <div className='text-[12px] text-[#2EC4B6]'>{t("addMore")}</div>

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
                        <div className='text-[8px]'>{t("addImage")}</div>
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
                <p className="text-sm text-red-500 mt-2">{t("maxPhotosReached")}</p>
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
                    {t("profilePicture")} <span className="text-red-500 hidden">*</span>
                  </div>
                  <div className='text-[12px] font-400 ' >
                    {t("profilePictureInfo")}
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



            <label className="block text-sm">{t("genres")} <span className="text-red-500 hidden">*</span></label>
            <select
              name="genres"
              value={formData1.genres}
              onChange={handleChange1}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
            >
              <option value="">{t("pretty")}</option>
              <option value="Portrait">{t("cute")}</option>
              <option value="Landscape">{t("cool")}</option>
              <option value="Wedding">{t("clean")}</option>
              <option value="Fashion">{t("natural")}</option>
              <option value="Nature">{t("art")}rt</option>
              <option value="Event">{t("dark")}</option>
              <option value="Product">{t("others")}</option>
            </select>
            <div className="relative border border-gray-300 rounded p-4">
              <label className="block text-sm mb-4">{t("achievements")}</label>

              {/* Plus Icon in Top-Right Corner */}
              <button
                type="button"
                onClick={addAchievement}
                className="absolute top-2 right-2 p-1  text-[#2EC4B6] rounded-full"
                aria-label="Add Achievement"
              >
                <div className='flex text-[12px] gap-1'>
                  <Plus size={14} />
                  <div>{t("addMore")}</div>
                </div>
              </button>

              {/* Achievement Inputs */}
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`${t("mAchievement")} ${index + 1}`}
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

            <label className="block text-sm">{t("height")} <span className="text-red-500 hidden">*</span></label>
            <input type="number" name="height" placeholder={t("heightPlaceholder")} value={formData1.height} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-[#FF9F1C] focus:outline-none transition" />

            {/* New Field for Photography Experience */}
            <label className="block text-sm">{t("modellingExperience")} <span className="text-red-500 hidden">*</span></label>
            <input type="number" name="modellingExperiance" placeholder={t("modellingExperiencePlaceholder")} value={formData1.modellingExperiance} onChange={handleChange1} className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-[#FF9F1C] focus:outline-none transition" />

            <div className="p-4 border rounded-xl bg-white shadow-lg relative">
              <h2 className="text-[14px] font-semibold mb-4">{t("addSubPhotos")} <span className="text-red-500 hidden">*</span> </h2>
              <h2 className="text-[10px] font-400 mb-4">{t("addSubPhotosInfo")}</h2>
              {/* Add More Button at Top Right */}
              {subPhotos.length < 5 && (
                <label htmlFor="subphoto-upload" className="absolute top-2 right-3 cursor-pointer flex ">
                  <Plus size={16} className="text-[#2EC4B6] hover:text-blue-700" />
                  <div className='text-[12px] text-[#2EC4B6]'>{t("addMore")}</div>

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
                        <div className='text-[8px]'>{t("addImage")}</div>
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
                <p className="text-sm text-red-500 mt-2">{t("maxPhotosReached")}</p>
              )}
            </div>


            <label className="block text-[14px]">{t("instagramUsername")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={instagram} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="instagram"
                placeholder={t("instagramPlaceholder")}
                value={formData1.instagram}
                onChange={handleChange1}
                className="w-full outline-none text-[12px]"
              />
            </div>

            <label className="block text-[14px]">{t("twitterUsername")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border rounded p-2">
              <Image src={twitter} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="twitter"
                placeholder={t("twitterPlaceholder")}
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
            <label className="block text-sm">{t("email")}</label>
            <div className='flex item-center justify-center customPlaceholderText '>
              <div className="pl-4 w-[70%] flex items-center border-t-[1px] border-l-[1px] border-b-[1px] rounded-tl-md rounded-bl-md bg-[#D9D9D9]  pl-1 h-[48px]">

                <Image src={mail} alt='email' width={20} height={20} className=" mr-2" />
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  //value={email}
                  //onChange={handleEmailChange}
                  className="w-full outline-none text-[12px]  pointer-events-none cursor-not-allowed bg-transparent text-[#333333]"
                />


              </div>
              <button
                className=" h-[48px] text-[#2EC458]  px-[2px] rounded  text-sm w-[30%] flex items-center justify-center gap-1 bg-white border-t-[1px] border-r-[1px] border-b-[1px] rounded-tr-md rounded-br-md "
              >
                <FaCheckCircle />
                {t("verified")}
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
                {t("idProof")} <span className="text-red-500 hidden">*</span>
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
                  {!idProof && (<p className="text-gray-500 text-[10px]">{t("idProofInfo")}</p>
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
            <div className='text-[12px] mt-4 pt-2 mb-3 font-400'>{t("resolutionNote")}
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

                {t("confirmPersonalInfo")}
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
                {t("receiveEmails")}
              </label>
            </div>
          </div>
        }

        {infoStep === 4 && profession === 'photographer' &&
          <div className="flex-1 space-y-4 w-full p-6">

            {/* Question 1 */}
            <label className="block text-sm">{t("pquestion1")}</label>
            <textarea
              name="importantThing"
              value={feedback.importantThing}
              onChange={handleChangeFeedback}
              placeholder={t("pplaceholder1")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 2 */}
            <label className="block text-sm">{t("pquestion2")}</label>
            <textarea
              name="stress"
              value={feedback.stress}
              onChange={handleChangeFeedback}
              placeholder={t("pplaceholder2")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 3 */}
            <label className="block text-sm">{t("pquestion3")}</label>
            <textarea
              name="assistanceWithModels"
              value={feedback.assistanceWithModels}
              onChange={handleChangeFeedback}
              placeholder={t("pplaceholder3")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 4 */}
            <label className="block text-sm">{t("pquestion4")}</label>
            <textarea
              name="hobbies"
              value={feedback.hobbies}
              onChange={handleChangeFeedback}
              placeholder={t("pplaceholder4")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

          </div>
        }
        {infoStep === 4 && profession === 'modelling' &&
          <div className="flex-1 space-y-4 w-full p-6">

            {/* Question 1 */}
            <label className="block text-sm">{t("whyModel")}</label>
            <textarea
              name="importantThing"
              value={feedback.importantThing}
              onChange={handleChangeFeedback}
              placeholder={t("placeholder")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 2 */}
            <label className="block text-sm">{t("importantThingSession")}</label>
            <textarea
              name="stress"
              value={feedback.stress}
              onChange={handleChangeFeedback}
              placeholder={t("placeholder")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 3 */}
            <label className="block text-sm">{t("photgrapherDo")}</label>
            <textarea
              name="assistanceWithModels"
              value={feedback.assistanceWithModels}
              onChange={handleChangeFeedback}
              placeholder={t("placeholder")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

            {/* Question 4 */}
            <label className="block text-sm">{t("hobbies")}</label>
            <textarea
              name="hobbies"
              value={feedback.hobbies}
              onChange={handleChangeFeedback}
              placeholder={t("placeholder")}
              className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
              rows={4}
            ></textarea>

          </div>
        }
        <div className='py-4 w-[80%] flex items-center justify-center gap-4'>
          <button onClick={handleBack} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center border-[1px] text-secondary flex items-center justify-center rounded-md'>{t("back")}</button>
          {infoStep < 4 && <button onClick={handleNext} className='w-full h-[54px] text-[14px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{t("next")}</button>}
          {infoStep == 4 && <button onClick={handleSubmit} disabled={submitting} className='w-full h-[54px] text-[14px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{submitting ? <Loader2 className='animate-spin' /> : t("submit")}</button>}
        </div>

      </div>


    </div>
  )
}

export default RegistrationInfo
