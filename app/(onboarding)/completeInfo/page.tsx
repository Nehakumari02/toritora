"use client"
import { backIcon } from '@/constants/icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react'
import { FaCheckCircle } from 'react-icons/fa';


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


function RegistrationInfo() {
  const router = useRouter();
  const [profession,setProfession] = useState<string>("photographer");
  const [infoStep,setInfoStep] = useState<number>(1);
  

  const infoStepToWidth: { [key: number]: string } = {
    1:"13",
    2:"38",
    3:"63",
    4:"100"
  }

  const handleGoBack = ()=>{
    router.back();
  }

  const handleBack = ()=>{
    if(infoStep>1){
      setInfoStep(infoStep-1);
    }
  }

  const handleNext = ()=>{
    if(infoStep<4){
      setInfoStep(infoStep+1);
    }
  }

  const handleSubmit = ()=>{
    console.log("submitting");
  }

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
    gender: "Male",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    postalCode: "",
    address: "",
  });

  const [formData1, setFormData1] = useState({
    profilePicture: null,
    userId: '',
    username: '',
    genres: '',
    achievements: '',
    cameraType: '',
    shootingPrice: '',
    transportationFee: '',
    snsUsername: '',
    website: '',
    selfIntroduction: '',
    photographyExperience: "", // New field for experience
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    gender: 'Male',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    postalCode: '',
    address: '',
  });




  const handleChange= (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

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

  const toggleGender = () => {
    setFormData((prevData) => ({
      ...prevData,
      gender: prevData.gender === "Male" ? "Female" : "Male",
    }));
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

  

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpMobile, setOtpMobile] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [idProof, setIdProof] = useState<File | null>(null);

  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value);
  };

  const handleOtpEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpEmail(e.target.value);
  };

  const handleOtpMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpMobile(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdProof(e.target.files[0]);
    }
  };

  const handleConsent1Change = () => {
    setConsent1(!consent1);
  };

  const handleConsent2Change = () => {
    setConsent2(!consent2);
  };

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //   }
  // };

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

  const sendEmailOtp = () => {
    // Logic to send OTP to email
    alert('OTP sent to email');
  };

  const sendMobileOtp = () => {
    // Logic to send OTP to mobile number
    alert('OTP sent to mobile');
  };

  const verifyEmailOtp = () => {
    // Logic to verify OTP for email
    setEmailVerified(true);
  };

  const verifyMobileOtp = () => {
    // Logic to verify OTP for mobile number
    setMobileVerified(true);
  };





  useEffect(()=>{
    setProfession("photographer");
  },[])

  return (
    <div className='h-[100dvh] flex flex-col'>
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
      <label className='block text-sm'>First Name</label>
      <div className="flex items-center border rounded p-2">
        <Image src={user} alt='user' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='text'
          name='firstName'
          placeholder='First Name'
          value={formData.firstName}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Last Name */}
      <label className='block text-sm'>Last Name</label>
      <div className="flex items-center border rounded p-2">
        <Image src={user} alt='user' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='text'
          name='lastName'
          placeholder='Last Name'
          value={formData.lastName}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Date of Birth */}
      <label className='block text-sm'>Date of Birth</label>
      <div className="flex items-center border rounded p-2">
        <Image src={calendar} alt='calendar' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='date'
          name='dateOfBirth'
          value={formData.dateOfBirth}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Age */}
      <label className='block text-sm'>Age</label>
      <div className="flex items-center border rounded p-2">
        <Image src={calendar} alt='calendar' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='number'
          name='age'
          placeholder='Age'
          value={formData.age}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Gender */}
      <label className='block text-sm'>Gender</label>
      <div className="flex gap-4">
        <label className="text-sm flex items-center">
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === 'Male'}
            onChange={handleChange}
            className="mr-1"
          />
          Male
        </label>
        <label className="text-sm flex items-center">
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === 'Female'}
            onChange={handleChange}
            className="mr-1"
          />
          Female
        </label>
      </div>

      {/* Email */}
      <label className='block text-sm'>Email</label>
      <div className="flex items-center border rounded p-2">
        <Image src={mail} alt='email' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Mobile Number */}
      <label className='block text-sm'>Mobile Number</label>
      <div className="flex items-center border rounded p-2">
        <Image src={phone} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='tel'
          name='mobile'
          placeholder='Mobile Number'
          value={formData.mobile}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Password */}
      <label className='block text-sm'>Password</label>
      <div className="flex items-center border rounded p-2">
        <Image src={password} alt='gender' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Confirm Password */}
      <label className='block text-sm'>Confirm Password</label>
      <div className="flex items-center border rounded p-2">
        <Image src={password} alt='gender' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='password'
          name='confirmPassword'
          placeholder='Confirm Password'
          value={formData.confirmPassword}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Postal Code */}
      <label className='block text-sm'>Postal Code</label>
      <div className="flex items-center border rounded p-2">
        <Image src={mail} alt='email' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='text'
          name='postalCode'
          placeholder='Postal Code'
          value={formData.postalCode}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>

      {/* Address */}
      <label className='block text-sm'>Address</label>
      <div className="flex items-center border rounded p-2">
        <Image src={location} alt='location' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type='text'
          name='address'
          placeholder='Address'
          value={formData.address}
          onChange={handleChange}
          className='w-full outline-none'
        />
      </div>
    </div>


}

{infoStep === 2 && 
  <div className="flex-1 space-y-4 w-full p-6">



      {/* User ID Field with Icon */}
      <div className="w-full max-w-md mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture
      </label>
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition"
        onDragOver={handleDragOver} // Corrected event handler
        onDrop={handleFileDrop}
        //onClick={() => fileInputRef.current.click()}
      >
        {/* Placeholder image */}
        <Image
          src={drive}
          alt="Upload Icon"
          className="w-[60px] h-[40px] object-cover mb-3"
        />
        <p className="text-gray-500 text-sm">This will be displayed on your profile</p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
  
    </div>

      {/* Username Field with Icon */}
      <label className="block text-sm">Username</label>
      <div className="flex items-center border rounded p-2">
        <Image src={user} alt='mobile' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData1.username}
          onChange={handleChange1}
          className="w-full outline-none"
        />
      </div>

      <label className="block text-sm">Genres You Are Good At</label>
<select
  name="genres"
  value={formData1.genres}
  onChange={handleChange1}
  className="w-full p-2 border rounded"
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

      <label className="block text-sm">Achievements</label>
      <textarea name="achievements" placeholder="Your achievements" value={formData1.achievements} onChange={handleChange1} className="w-full p-2 border rounded"></textarea>

      <label className="block text-sm">Camera Type</label>
      <input type="text" name="cameraType" placeholder="E.g. Canon EOS R5" value={formData1.cameraType} onChange={handleChange1} className="w-full p-2 border rounded" />

      {/* New Field for Photography Experience */}
      <label className="block text-sm">Photography Experience (Years)</label>
      <input type="number" name="photographyExperience" placeholder="Enter years of experience" value={formData1.photographyExperience} onChange={handleChange1} className="w-full p-2 border rounded" />

      <label className="block text-sm">Shooting Price Per Hour</label>
      <input type="number" name="shootingPrice" placeholder="Price per hour" value={formData1.shootingPrice} onChange={handleChange1} className="w-full p-2 border rounded" />

      <label className="block text-sm">Transportation Fee</label>
      <input type="number" name="transportationFee" placeholder="Transportation fee" value={formData1.transportationFee} onChange={handleChange1} className="w-full p-2 border rounded" />

      <label className="block text-sm">SNS Username</label>
      <input type="text" name="snsUsername" placeholder="Instagram, Twitter, etc." value={formData1.snsUsername} onChange={handleChange1} className="w-full p-2 border rounded" />

      <label className="block text-sm">Website</label>
      <input type="url" name="website" placeholder="Your website URL" value={formData1.website} onChange={handleChange1} className="w-full p-2 border rounded" />

      <label className="block text-sm">Self Introduction</label>
      <textarea name="selfIntroduction" placeholder="Introduce yourself" value={formData1.selfIntroduction} onChange={handleChange1} className="w-full p-2 border rounded"></textarea>

    </div>
    }




{infoStep === 3&& 
<div className="flex flex-col space-y-4 w-full p-8 gap-2">
      {/* Email Verification */}
      <label className="block text-sm">Email</label>
      <div className="flex items-center border rounded p-2">
        <Image src={mail} alt='email' width={20} height={20}  className="text-gray-500 mr-2" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          className="w-full outline-none"
        />
                <button
  className="text-[#2EC458] bg-white px-[2px] py-[2px] rounded ml-2 text-sm w-20 h-9 flex items-center justify-center gap-1"
>
  <FaCheckCircle />
  Verified
</button>

      </div>

     

      {/* Mobile Number Verification */}
      <label className="block text-sm">Mobile Number</label>
      <div className="flex items-center border rounded p-2">
        <Image src={phone} alt='email' width={20} height={20} className="text-gray-500 mr-2" />
        <input
          type="tel"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={handleMobileChange}
          className="w-full outline-none"
        />
       <button
          onClick={sendMobileOtp}
          className="bg-[#FF9F1C] text-white px-4 py-2 rounded ml-1 w-1/2 h-[40px]"
        >
          Send OTP
        </button>
      </div>

      <label className="block text-sm">Enter OTP for Mobile</label>
      <div className="flex items-center border rounded p-2">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otpMobile}
          onChange={handleOtpMobileChange}
          className="w-full outline-none"
        />
      </div>
      <button
        onClick={verifyMobileOtp}
        className="mt-2 bg-[#2EC458] text-white px-4 py-2 rounded"
      >
        Verify OTP
      </button>
      {mobileVerified && <p className="text-green-500">Mobile Verified Successfully</p>}

      <div className="w-[362px] h-[162px] max-w-md mx-auto mb-8 mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
        ID Proof
      </label>
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition"
        onDragOver={handleDragOver} // Corrected event handler
        onDrop={handleFileDrop}
        //onClick={() => fileInputRef.current.click()}
      >
        {/* Placeholder image */}
        <Image
          src={drive}
          alt="Upload Icon"
          className="w-[60px] h-[40px] object-cover mb-3"
        />
        <p className="text-gray-500 text-sm">It may contains Driver’s license, National id or any ID Proof</p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
  
    </div>

    <div className='text-[12px] mt-2 mb-3'>Note : Best Resolution 100px*100px, Image should not exceed more than 2MB
        </div>
    

      {/* Consent Checkboxes */}
      <div className="flex gap-4 mt-4">
        <label className="text-sm flex items-center">
          <input
            type="checkbox"
            checked={consent1}
            onChange={handleConsent1Change}
            className="mr-2"
          />
          I have confirmed that my personal information is correct.
        </label>
      </div>
      <div className="flex gap-4 mt-2">
        <label className="text-sm flex items-center">
          <input
            type="checkbox"
            checked={consent2}
            onChange={handleConsent2Change}
            className="mr-2"
          />
          I would like to receive e-mails about the latest information such as events and model entries.
        </label>
      </div>
    </div>
}

{infoStep === 4&& 
  <div className="flex-1 space-y-4 w-full p-6">
    
      {/* Question 1 */}
      <label className="block text-sm">1. What is the most important thing for you at Photorage Photography?</label>
      <textarea
        name="importantThing"
        value={feedback.importantThing}
        onChange={handleChange}
        placeholder="Write your answer here..."
        className="w-full p-2 border rounded"
        rows={4}
      ></textarea>

      {/* Question 2 */}
      <label className="block text-sm">2. Do you have any stress at Photorage Photography? What is it?</label>
      <textarea
        name="stress"
        value={feedback.stress}
        onChange={handleChange}
        placeholder="Write your answer here..."
        className="w-full p-2 border rounded"
        rows={4}
      ></textarea>

      {/* Question 3 */}
      <label className="block text-sm">3. Do you have any assistance with models? What is it?</label>
      <textarea
        name="assistanceWithModels"
        value={feedback.assistanceWithModels}
        onChange={handleChange}
        placeholder="Write your answer here..."
        className="w-full p-2 border rounded"
        rows={4}
      ></textarea>

      {/* Question 4 */}
      <label className="block text-sm">4. Please tell me your hobbies.</label>
      <textarea
        name="hobbies"
        value={feedback.hobbies}
        onChange={handleChange}
        placeholder="Write your answer here..."
        className="w-full p-2 border rounded"
        rows={4}
      ></textarea>

    </div>
}
        <div className='py-4 w-[80%] flex items-center justify-center gap-4'>
        <button onClick={handleBack} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center border-[1px] text-secondary flex items-center justify-center rounded-md'>Back</button>
        {infoStep < 4 && <button onClick={handleNext} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>NEXT</button>}
        {infoStep == 4 && <button onClick={handleSubmit} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>SUBMIT</button>}
        </div>

      </div>
        

    </div>
  )
}

export default RegistrationInfo