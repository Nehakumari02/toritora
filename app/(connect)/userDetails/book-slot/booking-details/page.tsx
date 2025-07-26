"use client"
import { backIcon } from '@/constants/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLogout } from '@/lib/logout';
import location from '@/public/images/photographer_reg/location.png'
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
import { addRequest } from '@/lib/requestHandler';

type FormValues = {
  shootingPlace: string;
  shootingLocation: string;
  meetingPoint: string;
  shootingConcept: string;
  clothingType: string;
  shoesType: string;
  itemsType: string;
  makeUpType: string
};

type FormValuesRainy = {
  shootingPlaceRainy: string;
  shootingLocationRainy: string;
  meetingPointRainy: string;
  shootingConceptRainy: string;
  clothingTypeRainy: string;
  shoesTypeRainy: string;
  itemsTypeRainy: string;
  makeUpTypeRainy: string
};

function BookingDetails() {
  const t = useTranslations('BookSlot');
  const router = useRouter();
  const logout = useLogout();
  const [sameForRainy, setSameForRainy] = useState(false);

  const searchParams = useSearchParams()
  const slot = searchParams.get('slot')

  const deserializedSlot = slot ? JSON.parse(slot) : null;

  const [formValues, setFormValues] = useState<FormValues>({
    shootingPlace: "",
    shootingLocation: "",
    meetingPoint: "",
    shootingConcept: "",
    clothingType: "",
    shoesType: "",
    itemsType: "",
    makeUpType: ""
  });

  const [formValuesRainyDay, setFormValuesRainyDay] = useState<FormValuesRainy>({
    shootingPlaceRainy: "",
    shootingLocationRainy: "",
    meetingPointRainy: "",
    shootingConceptRainy: "",
    clothingTypeRainy: "",
    shoesTypeRainy: "",
    itemsTypeRainy: "",
    makeUpTypeRainy: ""
  });

  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const [isFocused, setIsFocused] = useState("");

  const handleInputChange = (field: string, value: string, type: string = "normal") => {
    if (type === "normal") {
      const updatedFormValues = { ...formValues, [field]: value };
      setFormValues(updatedFormValues);
    }
    else if (type === "rainy") {
      const updatedFormValues = { ...formValuesRainyDay, [field]: value };
      setFormValuesRainyDay(updatedFormValues);
    }
  };

  useEffect(() => {
    if (sameForRainy) {
      setFormValuesRainyDay({
        shootingPlaceRainy: formValues.shootingPlace,
        shootingLocationRainy: formValues.shootingLocation,
        meetingPointRainy: formValues.meetingPoint,
        shootingConceptRainy: formValues.shootingConcept,
        clothingTypeRainy: formValues.clothingType,
        shoesTypeRainy: formValues.shoesType,
        itemsTypeRainy: formValues.itemsType,
        makeUpTypeRainy: formValues.makeUpType,
      });
    }
  }, [sameForRainy, formValues]);

  const handleSlotBooking = async () => {
    try {
      setSavingStatus(true);

      // Combine both normal and rainy day form values
      const combinedValues = { ...formValues, ...formValuesRainyDay };

      // Remove fields with empty values
      const cleanedValues = Object.fromEntries(
        Object.entries(combinedValues).filter(([_, value]) => value !== "")
      );

      const data = await addRequest(deserializedSlot?._id, logout, cleanedValues);
      console.log("Booking request sent:", data);
      if (data.status === 201) {
        toast({
          title: t("toastSuccessTitle"),
          description: t("bookingSuccess"),
          variant: "success"
        })
      } else {
        toast({
          title: t("toastServerErrorTitle"),
          description: `${data?.message}`,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error("Error in booking slot:", error);
      toast({
        title: "Server internal error",
        description: `Error: ${error?.message}`,
        variant: "destructive"
      })
    } finally {
      setSavingStatus(false);
      handleGoToProfile();
    }
  }

  const handleGoBack = () => {
    router.back();
  }

  const handleGoToProfile = () => {
    const { history } = window;
    if (history.length > 2) {
      history.go(-2);
    } else {
      router.push('/');
    }
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }


  const handleSelectChange = (value: string, type: string) => {
    if (type === 'normal') {
      setFormValues((prevData) => ({
        ...prevData,
        shootingLocation: value,
      }));
    }
    else if (type === 'rainy') {
      setFormValuesRainyDay((prevData) => ({
        ...prevData,
        shootingLocationRainy: value,
      }));
    }
  };


  return (
    <div className='flex flex-col h-full overflow-scroll no-scrollbar'>
      <header className="fixed top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoToProfile} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("pageTitle")}</span>
      </header>

      <div className='bg-[#FFBF691A] border-[1px] border-[#99999914] min-h-[50px] py-2 font-medium text-[12px] leading-[18px] text-[#777777] flex items-center justify-start md:justify-center px-4'>
        Input is {t("optional")}, but please provide as much information as possible.
      </div>

      <div className='no-scrollbar my-8'>

        <div className='px-4 space-y-8 max-w-[800px] mx-auto'>
          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("shootingPlace")} <span className='text-[#FF0000]'>*</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "shootingPlace" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <UserIcon fill={isFocused === "shootingPlace" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValues.shootingPlace}
                onChange={(e) => { handleInputChange("shootingPlace", e.target.value) }}
                onFocus={() => setIsFocused("shootingPlace")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm'>{t("shootingLocation")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border border-[#999999] px-2 h-[48px] rounded-lg">
              <Image src={location} alt='location' width={20} height={20} className="h-[20px] w-[20px] text-gray-500 mr-2" />
              <Select value={formValues.shootingLocation} onValueChange={(value) => handleSelectChange(value, "normal")}>
                <SelectTrigger className="w-full h-[48px] border-none outline-none focus:ring-0 shadow-none p-0">
                  <SelectValue placeholder={t("selectLocation")} />
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
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("meetingPoint")} </span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "meetingPoint" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <UserIcon fill={isFocused === "meetingPoint" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValues.meetingPoint}
                onChange={(e) => { handleInputChange("meetingPoint", e.target.value) }}
                onFocus={() => setIsFocused("meetingPoint")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("shootingConcept")} </span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "shootingConcept" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "shootingConcept" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValues.shootingConcept}
                onChange={(e) => { handleInputChange("shootingConcept", e.target.value) }}
                onFocus={() => setIsFocused("shootingConcept")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("clothingType")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "clothingType" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "clothingType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValues.clothingType}
                onChange={(e) => { handleInputChange("clothingType", e.target.value) }}
                onFocus={() => setIsFocused("clothingType")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("shoesType")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "shoesType" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "shoesType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValues.shoesType}
                onChange={(e) => { handleInputChange("shoesType", e.target.value) }}
                onFocus={() => setIsFocused("shoesType")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("itemsType")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "itemsType" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "itemsType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValues.itemsType}
                onChange={(e) => { handleInputChange("itemsType", e.target.value) }}
                onFocus={() => setIsFocused("itemsType")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("makeupType")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "makeUpType" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "makeUpType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValues.makeUpType}
                onChange={(e) => { handleInputChange("makeUpType", e.target.value) }}
                onFocus={() => setIsFocused("makeUpType")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

        </div>

      </div>

      <div className='min-h-[50px] py-2 font-medium text-[12px] leading-[18px] text-[#999999] flex items-center justify-start md:justify-center px-4'>
        <div className="flex items-center gap-2">
          <input
            checked={sameForRainy}
            onChange={() => setSameForRainy(!sameForRainy)}
            id="checked-checkbox"
            type="checkbox"
            className="w-5 h-5 text-white accent-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary"
          />
          <label htmlFor="checked-checkbox" className="text-[14px] leading-[21px] font-medium text-[#000000]">
            {t("sameAsNormal")}
          </label>
        </div>
      </div>

      <div className='bg-[#FFBF692A] border-[1px] border-[#99999914] min-h-[50px] py-2 font-medium text-[16px] leading-[18px] text-primary flex items-center justify-start md:justify-center px-4'>
        {t("rainyOccasion")}
      </div>

      <div className='no-scrollbar my-8'>

        <div className='px-4 space-y-8 max-w-[800px] mx-auto'>
          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("shootingPlaceRainy")} <span className='text-[#FF0000]'>*</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "shootingPlaceRainy" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <UserIcon fill={isFocused === "shootingPlace" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValuesRainyDay.shootingPlaceRainy}
                onChange={(e) => { handleInputChange("shootingPlaceRainy", e.target.value, "rainy") }}
                onFocus={() => setIsFocused("shootingPlaceRainy")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm'>{t("shootingLocationRainy")} <span className="text-red-500 hidden">*</span></label>
            <div className="flex items-center border border-[#999999] px-2 h-[48px] rounded-lg">
              <Image src={location} alt='location' width={20} height={20} className="h-[20px] w-[20px] text-gray-500 mr-2" />
              <Select value={formValuesRainyDay.shootingLocationRainy} onValueChange={(value) => handleSelectChange(value, "rainy")}>
                <SelectTrigger className="w-full h-[48px] border-none outline-none focus:ring-0 shadow-none p-0">
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
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("meetingPointRainy")} </span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "meetingPointRainy" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <UserIcon fill={isFocused === "meetingPoint" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValuesRainyDay.meetingPointRainy}
                onChange={(e) => { handleInputChange("meetingPointRainy", e.target.value, "rainy") }}
                onFocus={() => setIsFocused("meetingPointRainy")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("shootingConceptRainy")} </span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "shootingConceptRainy" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "shootingConcept" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValuesRainyDay.shootingConceptRainy}
                onChange={(e) => { handleInputChange("shootingConceptRainy", e.target.value, "rainy") }}
                onFocus={() => setIsFocused("shootingConceptRainy")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("clothingTypeRainy")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "clothingTypeRainy" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "clothingType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValuesRainyDay.clothingTypeRainy}
                onChange={(e) => { handleInputChange("clothingTypeRainy", e.target.value, "rainy") }}
                onFocus={() => setIsFocused("clothingTypeRainy")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("shoesTypeRainy")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "shoesTypeRainy" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "shoesType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValuesRainyDay.shoesTypeRainy}
                onChange={(e) => { handleInputChange("shoesTypeRainy", e.target.value, "rainy") }}
                onFocus={() => setIsFocused("shoesTypeRainy")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("itemsTypeRainy")} <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "itemsTypeRainy" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "itemsType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValuesRainyDay.itemsTypeRainy}
                onChange={(e) => { handleInputChange("itemsTypeRainy", e.target.value, "rainy") }}
                onFocus={() => setIsFocused("itemsTypeRainy")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <span className='font-medium text-[14px] leading-[21px] text-[#333333]'>{t("makeupTypeRainy")}e <span className='font-normal text-[10px] leading-[15px] text-[#777777]'>({t("optional")})</span></span>
            <div
              className={`h-[48px] flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${isFocused === "makeUpTypeRainy" ? 'border-[#FF9F1C]' : 'border-[#999999]'
                }`}
            >
              {/* <CalendarIcon fill={isFocused === "makeUpType" ?"#FF9F1C":"#2EC4B6"}/> */}
              <input
                type="text"
                disabled={savingStatus || loading}
                value={formValuesRainyDay.makeUpTypeRainy}
                onChange={(e) => { handleInputChange("makeUpTypeRainy", e.target.value, "rainy") }}
                onFocus={() => setIsFocused("makeUpTypeRainy")}
                onBlur={() => setIsFocused("")}
                className="outline-none w-full"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

        </div>

      </div>

      <div className='px-4 py-4 flex items-center justify-center'>
        <button onClick={handleSlotBooking} disabled={savingStatus} className='w-[calc(min(100%,800px))] h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{savingStatus ? <Loader2 className='animate-spin' /> : t("submit")}</button>
      </div>

    </div>
  )
}

export default BookingDetails

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