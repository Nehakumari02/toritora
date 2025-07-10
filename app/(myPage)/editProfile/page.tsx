"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import { Loader2, Plus, X } from 'lucide-react';
import { useLogout } from '@/lib/logout';
import { useTranslations } from 'next-intl'
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

type FormValues = {
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  gender: string;
  postalCode: string;
  location: string;
  address: string;

  importantThing: string;
  stress: string;
  assistanceWithModels: string;
  hobbies: string;
  userName: string;
  userId: string;
  profileImage: string;

  genres: string;
  achievements: string[];
  cameraType: string;
  shootingPrice: string;
  transportationFee: string;
  snsUsername: string;
  website: string;
  selfIntroduction: string;
  photographyExperience: string;
  height: string;
  modellingExperiance: string;
  instagram: string;
  twitter: string;
};

function EditProfile() {
  const router = useRouter();
  const [editProfileSection, setEditProfileSection] = useState(1);
  const [profession, setProfession] = useState("modelling");
  const logout = useLogout();
  const t = useTranslations('MyPage.editProfile');

  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "",
    postalCode: "",
    location: "",
    address: "",
    importantThing: "",
    stress: "",
    assistanceWithModels: "",
    hobbies: "",
    userName: "",
    userId: "",
    profileImage: "",
    genres: "",
    achievements: [],
    cameraType: "",
    shootingPrice: "",
    transportationFee: "",
    snsUsername: "",
    website: "",
    selfIntroduction: "",
    photographyExperience: "",
    height: "",
    modellingExperiance: "",
    instagram: "",
    twitter: "",
  });

  const [initialValues, setInitialValues] = useState<FormValues>({} as FormValues);
  const [isChanged, setIsChanged] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  const [isFocused, setIsFocused] = useState("");

  const handleInputChange = (field: string, value: string) => {
    const updatedFormValues = { ...formValues, [field]: value };
    setFormValues(updatedFormValues);
    setIsChanged(JSON.stringify(updatedFormValues) !== JSON.stringify(initialValues));
  };

  const handleArrayInputChange = (field: keyof FormValues, index: number, newValue: string) => {
    const prevArray = formValues[field] as string[];
  
    if (!Array.isArray(prevArray)) return;
  
    const updatedArray = [...prevArray];
    updatedArray[index] = newValue;
  
    const updatedFormValues = { ...formValues, [field]: updatedArray };
    setFormValues(updatedFormValues);
    setIsChanged(JSON.stringify(updatedFormValues) !== JSON.stringify(initialValues));
  };
  
  const addEmptyStringToEnd = (field: keyof FormValues) => {
    const prevArray = formValues[field];
  
    if (!Array.isArray(prevArray)) return;
  
    const updatedArray = [...prevArray, ""];
  
    const updatedFormValues = { ...formValues, [field]: updatedArray };
    setFormValues(updatedFormValues);
    setIsChanged(JSON.stringify(updatedFormValues) !== JSON.stringify(initialValues));
  };

  
  const removeStringAtIndex = (field: keyof FormValues, index: number) => {
    const prevArray = formValues[field] as string[];
    if (!Array.isArray(prevArray)) return;
  
    const updatedArray = prevArray.filter((_, i) => i !== index);
  
    const updatedFormValues = { ...formValues, [field]: updatedArray };
    setFormValues(updatedFormValues);
    setIsChanged(JSON.stringify(updatedFormValues) !== JSON.stringify(initialValues));
  };
  

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }

  const handleSave = async () => {
    if (!isChanged) {
      toast({
        title: t("error"),
        description: t("noChangesDetected"),
        variant: "destructive"
      })
      return;
    }

    try {
      setSavingStatus(true);

      const isEqual = (a: any, b: any) => {
        if (Array.isArray(a) && Array.isArray(b)) {
          return a.length === b.length && a.every((val, idx) => val === b[idx]);
        }
        return a === b;
      };

      // const changes = Object.keys(formValues).reduce(
      //   (acc, key) => {
          // if (
          //   formValues[key as keyof FormValues] !==
          //   initialValues[key as keyof FormValues]
          // ) {
          //   acc[key as keyof FormValues] = formValues[key as keyof FormValues];
          // }
          // return acc;
      //   },
      //   {} as Partial<FormValues>
      // );

      const changes: Partial<FormValues> = {};

      for (const key of Object.keys(formValues) as (keyof FormValues)[]) {
        const currentValue = formValues[key];
        const initialValue = initialValues[key];
      
        if (!isEqual(currentValue, initialValue)) {
          changes[key] = currentValue as string & string[];;
        }
      }


      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(changes),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast({
          title: t("success"),
          description: t("success"),
          variant: "success"
        })
        setInitialValues(formValues);
        setIsChanged(false);
      }
      else if (res.status === 401) {
        toast({
          title: t("error"),
          description: t("unauthorizedRequest"),
          variant: "destructive"
        })
        logout();
      }
      else {
        toast({
          title: t("internalServerError"),
          description: `Error: ${data.message}`,
          variant: "destructive"
        })
      }

    } catch (error) {
      toast({
        title: t("error"),
        description: `${t("internalServerError")} : ${error}`,
        variant: "destructive"
      })
    } finally {
      setSavingStatus(false);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/user`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
        });

        const data = await res.json();
        console.log(data)

        if (res.status === 200) {
          setProfession(data.user?.profession ?? '');
          const userData = {
            firstName: data.user?.firstName ?? '',
            lastName: data.user?.lastName ?? '',
            dob: data.user?.dateOfBirth ?? '',
            age: data.user?.age ?? '',
            gender: data.user?.gender ?? '',
            postalCode: data.user?.postalCode ?? '',
            location: data.user?.location ?? '',
            address: data.user?.address ?? '',

            importantThing: data.user?.importantThing ?? '',
            stress: data.user?.stress ?? '',
            assistanceWithModels: data.user?.assistanceWithModels ?? '',
            hobbies: data.user?.hobbies ?? '',

            userName: data.user?.username ?? '',
            userId: data.user?.userId ?? '',
            profileImage: data.user?.profilePicture ?? '',

            genres: data.user?.genres ?? '',
            achievements: data.user?.achievements ?? [],
            cameraType: data.user?.cameraType ?? '',
            shootingPrice: data.user?.shootingPrice ?? '',
            transportationFee: data.user?.transportationFee ?? '',
            snsUsername: data.user?.snsUsername ?? '',
            website: data.user?.website ?? '',
            selfIntroduction: data.user?.selfIntroduction ?? '',
            photographyExperience: data.user?.photographyExperience ?? '',
            height: data.user?.height ?? '',
            modellingExperiance: data.user?.modellingExperiance ?? '',
            instagram: data.user?.instagram ?? '',
            twitter: data.user?.twitter ?? '',
          };
          console.log(userData)

          setFormValues(userData);
          setInitialValues(userData);
        }
        else if (res.status === 401) {
          toast({
            title: t("error"),
            description: t("unauthorizedRequest"),
            variant: "destructive"
          })
          logout();
        }
        else {
          toast({
            title: t("internalServerError"),
            description: `Error: ${data.message}`,
            variant: "destructive"
          })
        }

      } catch (error) {
        toast({
          title: t("serverInternalError"),
          description: `Error : ${error}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className='flex flex-col h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("editProfile")}</span>
      </header>

      <div className='mt-8 mb-4 gap-8 flex flex-col items-center justify-center'>
        <div className='relative h-[88px] w-[88px] rounded-full border-[3px] border-secondary'>
          {formValues.profileImage === "" ?
            <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" className='h-full w-full rounded-full p-[2px]' />
            :
            <Image src={formValues.profileImage} alt="User" height={88} width={88} className='h-full w-full object-cover object-center rounded-full p-[2px]' />
          }
          <span className='absolute -bottom-2 -right-2'>{editIcon}</span>
        </div>
        <div className='flex flex-row flex-wrap gap-2 items-center justify-center md:max-w-[800px] md:w-full'>
          <button onClick={() => setEditProfileSection(1)} className={`font-medium text-[12px] leading-[18px] px-[15px] py-[8px] rounded-lg transition-all duration-300 ${editProfileSection === 1 ? "text-white bg-[#FF9F1C]" : "text-[#111111] bg-white"}`}>{t("professionalInfo")}</button>
          <button onClick={() => setEditProfileSection(2)} className={`font-medium text-[12px] leading-[18px] px-[15px] py-[8px] rounded-lg transition-all duration-300 ${editProfileSection === 2 ? "text-white bg-[#FF9F1C]" : "text-[#111111] bg-white"}`}>{t("personalDetail")}</button>
          <button onClick={() => setEditProfileSection(3)} className={`font-medium text-[12px] leading-[18px] px-[15px] py-[8px] rounded-lg transition-all duration-300 ${editProfileSection === 3 ? "text-white bg-[#FF9F1C]" : "text-[#111111] bg-white"}`}>{t("questionaries")}</button>
        </div>
      </div>

      <div className='bg-[#FFBF691A] border-[1px] border-[#99999914] min-h-[50px] py-2 font-medium text-[12px] leading-[18px] text-[#777777] flex items-center justify-start md:justify-center px-4'>
        {editProfileSection === 1 && t("shownInProfile")}
        {editProfileSection === 2 && t("wontBeShown")}
        {editProfileSection === 3 && t("sentToPhotographer")}
      </div>

      <div className='flex-1 overflow-y-scroll no-scrollbar my-8'>
        {editProfileSection === 1 &&
          <div className='px-4 space-y-8 max-w-[800px] mx-auto'>
            <div className='space-y-2 flex flex-wrap items-center justify-between'>
              <div className='flex flex-col items-start gap-4'>
                <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("profilePicture")} <span className='text-[#FF0000]'>*</span></span>
                <span className='font-normal text-[10px] leading-[15px] text-[#999999]'>{t("shownInProfile")}</span>
              </div>
              <div
                className={`flex items-center justify-center gap-2 px-3 py-2 border h-[100px] aspect-square transition-all duration-300 bg-[#F3F3F3] rounded-full ${isFocused === "profilePicture" ? 'border-[#FF9F1C]' : 'border-[#F3F3F3]'
                  }`}
              >
                {uploadIcon}
                <input
                  type="file"
                  className="outline-none w-full hidden"
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("userName")} <span className='text-[#333333]'></span></span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 bg-[#F3F3F3] ${isFocused === "userName" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <UserIcon fill={isFocused === "userName" ? "#FF9F1C" : "#999999"} />
                <input
                  type="text"
                  disabled={true}
                  value={formValues.userName}
                  onChange={(e) => { handleInputChange("userName", e.target.value) }}
                  onFocus={() => setIsFocused("userName")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterUsername")}
                />
              </div>
              <span className='font-normal text-[10px] leading-[15px] text-[#333333]'>{t("usernameError")}</span>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("userId")} <span className='text-[#333333]'>*</span></span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 bg-[#F3F3F3] ${isFocused === "userId" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <UserIcon fill={isFocused === "userId" ? "#FF9F1C" : "#999999"} />
                <input
                  type="text"
                  disabled={true}
                  value={formValues.userId}
                  onChange={(e) => { handleInputChange("userId", e.target.value) }}
                  onFocus={() => setIsFocused("userId")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterUserId")}
                />
              </div>
              <span className='font-normal text-[10px] leading-[15px] text-[#333333]'>{t("userIdError")}</span>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm'>{t("genres")} <span className="text-red-500 hidden">*</span></label>
              <div className="h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 border-[#999999]">
                {/* <LocationIcon fill={"#2EC4B6"} /> */}
                <Select value={formValues.genres} onValueChange={(value) => handleInputChange("genres", value)}>
                  <SelectTrigger className="w-full h-[18px] border-none outline-none focus:ring-0 shadow-none p-0">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("selectGenre")}</SelectLabel>
                      {["Portrait","Landscape","Wedding","Fashion","Nature","Event","Product"].map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {t(genre)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <div className="relative border border-gray-300 rounded p-4">
                <label className="block text-sm mb-4">{t("achievements")}</label>

                <button
                  type="button"
                  onClick={()=>addEmptyStringToEnd("achievements")}
                  className="absolute top-2 right-2 p-1  text-[#2EC4B6] rounded-full"
                  aria-label="Add Achievement"
                >
                  <div className='flex text-[12px] gap-1'>
                    <Plus size={14} />
                    <div>{t("addMore")}</div>
                  </div>
                </button>

                {formValues.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Achievement ${index + 1}`}
                      value={achievement}
                      onChange={(e) => handleArrayInputChange("achievements",index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-[12px] focus:border-orange-500 focus:outline-none transition"
                    />
                    {formValues.achievements.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeStringAtIndex("achievements",index)}
                        className="p-2 bg-[#FF9F1C] text-white rounded hover:bg-red-600 text-[12px]"
                        aria-label="Remove Achievement"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("cameraType")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "cameraType" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "cameraType" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.cameraType}
                  onChange={(e) => { handleInputChange("cameraType", e.target.value) }}
                  onFocus={() => setIsFocused("cameraType")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterCameraType")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("shootingPrice")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "shootingPrice" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "shootingPrice" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.shootingPrice}
                  onChange={(e) => { handleInputChange("shootingPrice", e.target.value) }}
                  onFocus={() => setIsFocused("shootingPrice")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterShootingPrice")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("transportationFee")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "transportationFee" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "transportationFee" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.transportationFee}
                  onChange={(e) => { handleInputChange("transportationFee", e.target.value) }}
                  onFocus={() => setIsFocused("transportationFee")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterTransportationFee")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("snsUsername")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "snsUsername" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "snsUsername" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.snsUsername}
                  onChange={(e) => { handleInputChange("snsUsername", e.target.value) }}
                  onFocus={() => setIsFocused("snsUsername")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterSnsUsername")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("website")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "website" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "website" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.website}
                  onChange={(e) => { handleInputChange("website", e.target.value) }}
                  onFocus={() => setIsFocused("website")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterWebsite")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("selfIntroduction")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "selfIntroduction" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "selfIntroduction" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.selfIntroduction}
                  onChange={(e) => { handleInputChange("selfIntroduction", e.target.value) }}
                  onFocus={() => setIsFocused("selfIntroduction")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterSelfIntroduction")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("photographyExperience")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "photographyExperience" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "photographyExperience" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.photographyExperience}
                  onChange={(e) => { handleInputChange("photographyExperience", e.target.value) }}
                  onFocus={() => setIsFocused("photographyExperience")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterPhotographyExperience")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("height")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "height" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "height" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.height}
                  onChange={(e) => { handleInputChange("height", e.target.value) }}
                  onFocus={() => setIsFocused("height")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterHeight")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("modellingExperiance")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "modellingExperiance" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                {/* <UserIcon fill={isFocused === "modellingExperiance" ? "#FF9F1C" : "#2EC4B6"} /> */}
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.modellingExperiance}
                  onChange={(e) => { handleInputChange("modellingExperiance", e.target.value) }}
                  onFocus={() => setIsFocused("modellingExperiance")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterModellingExperiance")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("instagram")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "instagram" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <InstagramIcon fill={isFocused === "instagram" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.instagram}
                  onChange={(e) => { handleInputChange("instagram", e.target.value) }}
                  onFocus={() => setIsFocused("instagram")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterInstagram")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("twitter")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "twitter" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <TwitterIcon fill={isFocused === "twitter" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.twitter}
                  onChange={(e) => { handleInputChange("twitter", e.target.value) }}
                  onFocus={() => setIsFocused("twitter")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterTwitter")}
                />
              </div>
            </div>
          </div>
        }
        {editProfileSection === 2 &&
          <div className='px-4 space-y-8 max-w-[800px] mx-auto'>
            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("lastName")} <span className='text-[#FF0000]'>*</span></span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "lastName" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <UserIcon fill={isFocused === "lastName" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.lastName}
                  onChange={(e) => { handleInputChange("lastName", e.target.value) }}
                  onFocus={() => setIsFocused("lastName")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterLastName")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("firstName")} <span className='text-[#FF0000]'>*</span></span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "firstName" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <UserIcon fill={isFocused === "firstName" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.firstName}
                  onChange={(e) => { handleInputChange("firstName", e.target.value) }}
                  onFocus={() => setIsFocused("firstName")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterFirstName")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("dob")} <span className='text-[#FF0000]'>*</span></span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "dob" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <CalendarIcon fill={isFocused === "dob" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.dob}
                  onChange={(e) => { handleInputChange("dob", e.target.value) }}
                  onFocus={() => setIsFocused("dob")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("selectDate")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("age")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>(optional)</span></span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "age" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <CalendarIcon fill={isFocused === "age" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.age}
                  onChange={(e) => { handleInputChange("age", e.target.value) }}
                  onFocus={() => setIsFocused("age")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("autoCalculate")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm'>{t("gender")} <span className="text-red-500 hidden">*</span></label>
              <div className="flex gap-4">
                {['Male', 'Female'].map((gender) => (
                  <label key={gender} className="text-sm flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formValues.gender === gender}
                      onChange={(e) => { handleInputChange("gender", e.target.value) }}
                      className="hidden peer"
                    />
                    <div className="w-4 h-4 mr-1 rounded-full border-2 border-black-600 relative">
                      <div className={`w-2 h-2 bg-[#2EC4B6] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${formValues.gender === gender ? 'block' : 'hidden'}`}></div>
                    </div>
                    {gender==="Male" ? t("male") : t("female")}
                  </label>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("postalCode")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "postalCode" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <LocationIcon fill={isFocused === "postalCode" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.postalCode}
                  onChange={(e) => { handleInputChange("postalCode", e.target.value) }}
                  onFocus={() => setIsFocused("postalCode")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterPostalCode")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm'>{t("location")} <span className="text-red-500 hidden">*</span></label>
              <div className="h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 border-[#999999]">
                <LocationIcon fill={"#2EC4B6"} />
                <Select value={formValues.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger className="w-full h-[18px] border-none outline-none focus:ring-0 shadow-none p-0">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("selectLocation")}</SelectLabel>
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
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("address")}</span>
              <div
                className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "address" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <LocationIcon fill={isFocused === "address" ? "#FF9F1C" : "#2EC4B6"} />
                <input
                  type="text"
                  disabled={savingStatus || loading}
                  value={formValues.address}
                  onChange={(e) => { handleInputChange("address", e.target.value) }}
                  onFocus={() => setIsFocused("address")}
                  onBlur={() => setIsFocused("")}
                  className="outline-none w-full"
                  placeholder={t("enterAddress")}
                />
              </div>
            </div>

          </div>
        }
        {editProfileSection === 3 &&
          <div className='px-4 space-y-8 max-w-[800px] mx-auto'>
            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>1. {profession === "modelling" ? t("q1") : t("importantThing")}</span>
              <div
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "importantThing" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <textarea
                  disabled={savingStatus || loading}
                  value={formValues.importantThing}
                  onChange={(e) => handleInputChange("importantThing", e.target.value)}
                  className="outline-none w-full h-[90px] resize-none"
                  placeholder={t("enterImportantThing")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'> 2. {profession === "modelling" ? t("q2") : t("stress")}</span>
              <div
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "stress" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <textarea
                  disabled={savingStatus || loading}
                  value={formValues.stress}
                  onChange={(e) => handleInputChange("stress", e.target.value)}
                  className="outline-none w-full h-[90px] resize-none"
                  placeholder={t("enterImportantThing")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'> 3. {profession === "modelling" ? t("q3") : t("assistanceWithModel")}</span>
              <div
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "assistanceWithModels" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <textarea
                  disabled={savingStatus || loading}
                  value={formValues.assistanceWithModels}
                  onChange={(e) => handleInputChange("assistanceWithModels", e.target.value)}
                  className="outline-none w-full h-[90px] resize-none"
                  placeholder={t("enterImportantThing")}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <span className='font-medium text-[14px] leading-[21px] text-[#333333]'> {t("hobbies")}</span>
              <div
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "hobbies" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                  }`}
              >
                <textarea
                  disabled={savingStatus || loading}
                  value={formValues.hobbies}
                  onChange={(e) => handleInputChange("hobbies", e.target.value)}
                  className="outline-none w-full h-[90px] resize-none"
                  placeholder={t("enterImportantThing")}
                />
              </div>
            </div>
          </div>
        }
      </div>

      <div className='px-4 py-4 flex items-center justify-center'>
        <button onClick={handleSave} className='w-[calc(min(100%,800px))] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{savingStatus ? <Loader2 className='animate-spin' /> : t("save")}</button>
      </div>

    </div>
  )
}

export default EditProfile

const editIcon = <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="15.293" cy="15" r="14" fill="#2EC4B6" stroke="#F9FCFD" strokeWidth="2" />
  <path d="M19.2117 13.3836L16.8863 11.0822L17.6523 10.3151C17.8621 10.105 18.1198 10 18.4255 10C18.7308 10 18.9883 10.105 19.1981 10.3151L19.9641 11.0822C20.1738 11.2922 20.2833 11.5458 20.2924 11.8427C20.3015 12.1394 20.2012 12.3927 19.9915 12.6027L19.2117 13.3836ZM18.4184 14.1918L12.6184 20H10.293V17.6712L16.0929 11.863L18.4184 14.1918Z" fill="white" />
</svg>

const uploadIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0_1276_66256)">
    <path d="M11.8894 14.8185C11.8727 14.7972 11.8514 14.7799 11.827 14.768C11.8027 14.7562 11.7759 14.75 11.7488 14.75C11.7217 14.75 11.695 14.7562 11.6706 14.768C11.6462 14.7799 11.6249 14.7972 11.6082 14.8185L9.1082 17.9815C9.08759 18.0078 9.0748 18.0394 9.07129 18.0726C9.06779 18.1059 9.07371 18.1394 9.08838 18.1695C9.10305 18.1995 9.12588 18.2248 9.15425 18.2425C9.18262 18.2601 9.21539 18.2695 9.24882 18.2694H10.8984V23.6801C10.8984 23.7783 10.9787 23.8587 11.0769 23.8587H12.4162C12.5144 23.8587 12.5948 23.7783 12.5948 23.6801V18.2716H14.2488C14.3984 18.2716 14.481 18.0998 14.3894 17.9837L11.8894 14.8185Z" fill="#999999" />
    <path d="M18.433 12.7545C17.4107 10.058 14.8058 8.14062 11.7545 8.14062C8.70313 8.14062 6.09821 10.0558 5.07589 12.7522C3.16295 13.2545 1.75 14.9978 1.75 17.0692C1.75 19.5357 3.74777 21.5335 6.21205 21.5335H7.10714C7.20536 21.5335 7.28572 21.4531 7.28572 21.3549V20.0156C7.28572 19.9174 7.20536 19.8371 7.10714 19.8371H6.21205C5.45982 19.8371 4.75223 19.5379 4.22545 18.9955C3.70089 18.4554 3.42188 17.7277 3.44643 16.9732C3.46652 16.3839 3.66741 15.8304 4.03125 15.3638C4.40402 14.8884 4.92634 14.5424 5.5067 14.3884L6.35268 14.1674L6.66295 13.3504C6.85491 12.8415 7.12277 12.3661 7.45982 11.9353C7.79257 11.5083 8.18673 11.1329 8.62947 10.8214C9.54688 10.1763 10.6272 9.83482 11.7545 9.83482C12.8817 9.83482 13.9621 10.1763 14.8795 10.8214C15.3237 11.1339 15.7165 11.5089 16.0491 11.9353C16.3862 12.3661 16.654 12.8438 16.846 13.3504L17.154 14.1652L17.9978 14.3884C19.2076 14.7143 20.0536 15.8147 20.0536 17.0692C20.0536 17.808 19.7656 18.5045 19.2433 19.0268C18.9872 19.2844 18.6824 19.4887 18.3468 19.6278C18.0112 19.7669 17.6513 19.838 17.2879 19.8371H16.3929C16.2946 19.8371 16.2143 19.9174 16.2143 20.0156V21.3549C16.2143 21.4531 16.2946 21.5335 16.3929 21.5335H17.2879C19.7522 21.5335 21.75 19.5357 21.75 17.0692C21.75 15 20.3415 13.2589 18.433 12.7545Z" fill="#999999" />
  </g>
  <defs>
    <clipPath id="clip0_1276_66256">
      <rect width="22.8571" height="22.8571" fill="white" transform="translate(0.320312 0.421875)" />
    </clipPath>
  </defs>
</svg>

const UserIcon = ({ fill = "text-[#999999]" }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-colors duration-300 fill-current text-[${fill}]`}
    >
      <path
        d="M11.47 9.41902C12.2581 8.8023 12.8334 7.9566 13.1158 6.99957C13.3981 6.04254 13.3736 5.02177 13.0455 4.07927C12.7174 3.13678 12.1021 2.31943 11.2852 1.74093C10.4682 1.16244 9.49036 0.851563 8.48754 0.851562C7.48472 0.851562 6.50683 1.16244 5.68992 1.74093C4.87302 2.31943 4.25771 3.13678 3.92962 4.07927C3.60152 5.02177 3.57695 6.04254 3.85931 6.99957C4.14168 7.9566 4.71695 8.8023 5.50508 9.41902C4.1546 9.95714 2.97626 10.8497 2.09567 12.0015C1.21509 13.1533 0.665277 14.5211 0.504849 15.9592C0.493236 16.0642 0.502531 16.1705 0.532202 16.2719C0.561873 16.3733 0.611339 16.468 0.677776 16.5504C0.811952 16.7168 1.00711 16.8234 1.22032 16.8467C1.43352 16.8701 1.64731 16.8082 1.81466 16.6747C1.982 16.5413 2.08919 16.3472 2.11264 16.1351C2.28916 14.5722 3.03848 13.1287 4.21742 12.0805C5.39636 11.0323 6.92227 10.4528 8.50362 10.4528C10.085 10.4528 11.6109 11.0323 12.7898 12.0805C13.9688 13.1287 14.7181 14.5722 14.8946 16.1351C14.9164 16.3316 15.0107 16.5131 15.1592 16.6445C15.3076 16.7759 15.4997 16.8479 15.6985 16.8467H15.7869C15.9976 16.8226 16.1902 16.7166 16.3228 16.5519C16.4553 16.3872 16.5169 16.177 16.4943 15.9672C16.3332 14.525 15.7804 13.1537 14.8953 12.0001C14.0102 10.8465 12.8261 9.95429 11.47 9.41902ZM8.48754 8.85135C7.85155 8.85135 7.22985 8.66378 6.70105 8.31236C6.17225 7.96094 5.7601 7.46146 5.51672 6.87707C5.27334 6.29269 5.20966 5.64964 5.33374 5.02926C5.45781 4.40888 5.76407 3.83902 6.21377 3.39175C6.66348 2.94448 7.23645 2.63989 7.86021 2.51649C8.48397 2.39308 9.13052 2.45642 9.71809 2.69848C10.3057 2.94054 10.8079 3.35046 11.1612 3.87639C11.5145 4.40232 11.7031 5.02066 11.7031 5.65319C11.7031 6.50139 11.3643 7.31486 10.7613 7.91463C10.1583 8.5144 9.34036 8.85135 8.48754 8.85135Z"
        fill="currentColor"
      />
    </svg>
  );
};

const CalendarIcon = ({ fill = "text-[#999999]" }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-300 fill-current text-[${fill}]`}>
      <path d="M6.445 11.688V6.354H5.812C5.35864 6.59567 4.92049 6.86484 4.5 7.16V7.855C4.875 7.598 5.469 7.235 5.758 7.078H5.77V11.688H6.445ZM7.633 10.383C7.68 11.023 8.227 11.789 9.336 11.789C10.594 11.789 11.336 10.723 11.336 8.918C11.336 6.984 10.555 6.25 9.383 6.25C8.457 6.25 7.586 6.922 7.586 8.059C7.586 9.219 8.41 9.829 9.262 9.829C10.008 9.829 10.492 9.453 10.645 9.039H10.672C10.668 10.355 10.211 11.203 9.367 11.203C8.703 11.203 8.359 10.753 8.317 10.383H7.633ZM10.586 8.066C10.586 8.762 10.027 9.246 9.402 9.246C8.801 9.246 8.258 8.863 8.258 8.046C8.258 7.223 8.84 6.836 9.426 6.836C10.059 6.836 10.586 7.234 10.586 8.066Z" fill="currentColor" />
      <path d="M3.5 0C3.63261 0 3.75979 0.0526784 3.85355 0.146447C3.94732 0.240215 4 0.367392 4 0.5V1H12V0.5C12 0.367392 12.0527 0.240215 12.1464 0.146447C12.2402 0.0526784 12.3674 0 12.5 0C12.6326 0 12.7598 0.0526784 12.8536 0.146447C12.9473 0.240215 13 0.367392 13 0.5V1H14C14.5304 1 15.0391 1.21071 15.4142 1.58579C15.7893 1.96086 16 2.46957 16 3V14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V3C0 2.46957 0.210714 1.96086 0.585786 1.58579C0.960859 1.21071 1.46957 1 2 1H3V0.5C3 0.367392 3.05268 0.240215 3.14645 0.146447C3.24021 0.0526784 3.36739 0 3.5 0V0ZM1 4V14C1 14.2652 1.10536 14.5196 1.29289 14.7071C1.48043 14.8946 1.73478 15 2 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V4H1Z" fill="currentColor" />
    </svg>
  );
};

const InstagramIcon = ({ fill = "text-[#999999]" }) => {
  return(
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-300 fill-current text-[${fill}]`}>
    <path d="M5.14 0H11.86C14.42 0 16.5 2.08 16.5 4.64V11.36C16.5 12.5906 16.0111 13.7708 15.141 14.641C14.2708 15.5111 13.0906 16 11.86 16H5.14C2.58 16 0.5 13.92 0.5 11.36V4.64C0.5 3.4094 0.988856 2.22919 1.85902 1.35902C2.72919 0.488856 3.9094 0 5.14 0ZM4.98 1.6C4.21618 1.6 3.48364 1.90343 2.94353 2.44353C2.40343 2.98364 2.1 3.71618 2.1 4.48V11.52C2.1 13.112 3.388 14.4 4.98 14.4H12.02C12.7838 14.4 13.5164 14.0966 14.0565 13.5565C14.5966 13.0164 14.9 12.2838 14.9 11.52V4.48C14.9 2.888 13.612 1.6 12.02 1.6H4.98ZM12.7 2.8C12.9652 2.8 13.2196 2.90536 13.4071 3.09289C13.5946 3.28043 13.7 3.53478 13.7 3.8C13.7 4.06522 13.5946 4.31957 13.4071 4.50711C13.2196 4.69464 12.9652 4.8 12.7 4.8C12.4348 4.8 12.1804 4.69464 11.9929 4.50711C11.8054 4.31957 11.7 4.06522 11.7 3.8C11.7 3.53478 11.8054 3.28043 11.9929 3.09289C12.1804 2.90536 12.4348 2.8 12.7 2.8ZM8.5 4C9.56087 4 10.5783 4.42143 11.3284 5.17157C12.0786 5.92172 12.5 6.93913 12.5 8C12.5 9.06087 12.0786 10.0783 11.3284 10.8284C10.5783 11.5786 9.56087 12 8.5 12C7.43913 12 6.42172 11.5786 5.67157 10.8284C4.92143 10.0783 4.5 9.06087 4.5 8C4.5 6.93913 4.92143 5.92172 5.67157 5.17157C6.42172 4.42143 7.43913 4 8.5 4ZM8.5 5.6C7.86348 5.6 7.25303 5.85286 6.80294 6.30294C6.35286 6.75303 6.1 7.36348 6.1 8C6.1 8.63652 6.35286 9.24697 6.80294 9.69706C7.25303 10.1471 7.86348 10.4 8.5 10.4C9.13652 10.4 9.74697 10.1471 10.1971 9.69706C10.6471 9.24697 10.9 8.63652 10.9 8C10.9 7.36348 10.6471 6.75303 10.1971 6.30294C9.74697 5.85286 9.13652 5.6 8.5 5.6Z" fill="currentColor"/>
    </svg>
  )
}

const TwitterIcon = ({ fill = "text-[#999999]" }) =>{
  return(
    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-300 fill-current text-[${fill}]`}>
    <path d="M18.1192 2.45095C18.0481 2.27959 17.9277 2.13319 17.7733 2.03028C17.6189 1.92736 17.4375 1.87257 17.252 1.87283H15.0489C14.5755 1.13308 13.8751 0.566646 13.0528 0.258417C12.2304 -0.0498126 11.3303 -0.0832416 10.4873 0.163139C9.64432 0.40952 8.90389 0.922442 8.37695 1.62504C7.85002 2.32764 7.56496 3.18208 7.56449 4.06033V4.12283C4.65042 3.22439 2.31449 0.919701 2.29105 0.896264C2.16977 0.775056 2.01758 0.689428 1.85103 0.648695C1.68448 0.607962 1.50995 0.613685 1.34643 0.665239C1.1829 0.716794 1.03665 0.812207 0.923573 0.941097C0.810499 1.06999 0.734938 1.22742 0.70511 1.39626C0.00198531 5.27126 1.17386 7.88064 2.27542 9.38064C2.763 10.0443 3.34159 10.6361 3.99417 11.1385C2.86917 12.2635 1.31449 12.865 1.29886 12.8728C1.16628 12.9205 1.04653 12.9982 0.948953 13.0999C0.851376 13.2015 0.778617 13.3244 0.73636 13.4588C0.693541 13.5939 0.681142 13.7368 0.700052 13.8773C0.718961 14.0177 0.768711 14.1523 0.845735 14.2713C0.994173 14.4978 1.89261 15.6228 4.75199 15.6228C10.3848 15.6228 15.1035 11.3181 15.6348 5.74783L17.916 3.47439C18.0457 3.34201 18.134 3.1747 18.1701 2.99293C18.2062 2.81116 18.1885 2.62282 18.1192 2.45095ZM14.0723 4.6697C13.9067 4.82726 13.8087 5.04291 13.7989 5.27126C13.4942 10.0213 9.51761 13.7478 4.75199 13.7478C4.4254 13.7499 4.09908 13.729 3.77542 13.6853C4.58792 13.1619 5.5098 12.4275 6.15824 11.4588C6.23204 11.3472 6.28134 11.2213 6.30289 11.0894C6.32444 10.9574 6.31774 10.8223 6.28324 10.6931C6.2498 10.5652 6.18924 10.446 6.10566 10.3436C6.02209 10.2411 5.91745 10.1578 5.79886 10.0994C5.64261 10.0135 2.23636 8.20876 2.36917 3.42751C3.71292 4.45095 5.8848 5.82595 8.34574 6.2322C8.47996 6.25489 8.61751 6.24808 8.74883 6.21223C8.88015 6.17639 9.0021 6.11238 9.10618 6.02465C9.21027 5.93692 9.294 5.82758 9.35156 5.70422C9.40912 5.58086 9.43912 5.44645 9.43949 5.31033V4.06033C9.44567 3.47666 9.68241 2.91913 10.0981 2.50933C10.5137 2.09954 11.0745 1.87073 11.6582 1.87283C12.079 1.87829 12.4893 2.00502 12.8399 2.23782C13.1905 2.47062 13.4665 2.7996 13.6348 3.18533C13.7069 3.35314 13.8269 3.49599 13.9798 3.59602C14.1326 3.69606 14.3115 3.74886 14.4942 3.74783H14.9864L14.0723 4.6697Z" fill="currentColor"/>
    </svg>
  )
}

const LocationIcon = ({ fill = "text-[#999999]" }) =>{
  return(
    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-300 fill-current text-[${fill}]`}>
    <path d="M6.84524 1.52381C8.52143 1.52381 9.89286 2.89524 9.89286 4.57143C9.89286 6.17143 8.29286 8.7619 6.84524 10.5905C5.39762 8.68571 3.79762 6.17143 3.79762 4.57143C3.79762 2.89524 5.16905 1.52381 6.84524 1.52381ZM6.84524 0C4.33095 0 2.27381 2.05714 2.27381 4.57143C2.27381 8 6.84524 12.9524 6.84524 12.9524C6.84524 12.9524 11.4167 7.92381 11.4167 4.57143C11.4167 2.05714 9.35952 0 6.84524 0ZM6.84524 3.04762C6.00714 3.04762 5.32143 3.73333 5.32143 4.57143C5.32143 5.40952 6.00714 6.09524 6.84524 6.09524C7.68333 6.09524 8.36905 5.40952 8.36905 4.57143C8.36905 3.73333 7.68333 3.04762 6.84524 3.04762ZM12.9405 12.9524C12.9405 14.6286 10.1976 16 6.84524 16C3.49286 16 0.75 14.6286 0.75 12.9524C0.75 11.9619 1.66429 11.1238 3.1119 10.5143L3.56905 11.2C2.80714 11.581 2.27381 12.0381 2.27381 12.5714C2.27381 13.6381 4.33095 14.4762 6.84524 14.4762C9.35952 14.4762 11.4167 13.6381 11.4167 12.5714C11.4167 12.0381 10.8833 11.581 10.0452 11.2L10.5024 10.5143C12.0262 11.1238 12.9405 11.9619 12.9405 12.9524Z" fill="currentColor"/>
    </svg>

  )
}