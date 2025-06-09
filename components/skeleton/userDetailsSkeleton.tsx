import Image from "next/image";
import { Gallery } from "../common/gallery";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { backIcon } from '@/constants/icons';
import userAvatar from "@/public/images/mypage/profileImageDefault.avif"
import { useTranslations } from 'next-intl'

export default function UserDetailsSkeleton() {
  const router = useRouter();
  const { toast } = useToast();
  const [profession, setProfession] = useState("modelling");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [selectedMode, setSelectedMode] = useState(0);


  const handleGoBack = () => {
    router.back();
  }

  const handleGoToLink = (route: string) => {
    router.push(route)
  }
  const t = useTranslations('MyPage.editProfile');

  return (
    <div className='no-scrollbar'>
      <header className="sticky top-0 z-10 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{profession === "modelling" ? "Model Details" : "Photographer Details"}</span>
      </header>


      <div className='bg-primary-foreground my-4'>
        <div className='max-w-[800px] mx-auto min-h-[52px] py-2 w-full flex flex-wrap items-center justify-center gap-[8px] transition-all duration-300'>
          <button onClick={() => setSelectedMode(0)} className={`${selectedMode === 0 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>Profile</button>
          <button onClick={() => setSelectedMode(1)} className={`${selectedMode === 1 ? "bg-primary text-white rounded-md" : ""} h-[40px] min-w-32 text-center font-semibold text-[14px] leading-[21px] w-[40%] transition-all duration-300`}>Calendar</button>
        </div>
      </div>

      <div className={`${selectedMode === 0 ? "" : "hidden"} h-full pb-4`}>

        {/* Model profile view */}
        <div className={`${profession === "modelling" ? "" : "hidden"} max-w-[800px] md:mx-auto my-4 mx-2`}>

          {/* Profile image */}
          <div className='md:flex md:items-center md:justify-center my-8'>
            <div className='flex items-center justify-center md:w-[50%]'>
              <div className='h-[calc(min(100%,380px))] w-[calc(min(100%,380px))] flex items-center justify-center overflow-hidden aspect-square'>
                {loading || user?.profilePicture === "" ?
                  <div className='w-full h-full md:h-[380px] md:w-[380px] rounded-md bg-gray-200 animate-pulse'></div>
                  :
                  (user?.profilePicture ? <Image src={user?.profilePicture} alt="User" height={380} width={380} className='h-full w-full rounded-md animate-in object-cover object-center' /> : <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" height={380} width={380} className='h-full w-full' />)
                }
              </div>
            </div>

            <div className='md:w-[50%] md:h-[380px] md:p-4 p-2 flex items-center justify-between'>
              <div className={`${loading ? "animate-pulse" : ""} bg-primary px-6 py-2 rounded-full`}>
                {loading ? <div className='h-6 w-20'></div> : <span className='h-6 w-20 flex items-center justify-center gap-2 font-medium text-[14px] leading-[25px] text-white'>{badgeIcon} Visitor</span>}
              </div>
              <div className='flex flex-col items-end justify-center md:space-y-2'>
                {loading ? <>
                  <div className='h-4 w-24 rounded-md bg-gray-200 animate-pulse'></div>
                  <div className='h-4 w-20 rounded-md bg-gray-200 animate-pulse'></div>
                </> :
                  <>
                    <span className='font-medium text-[14px] leading-[25px] text-[#111111]'>{user?.firstName} {user?.lastName}</span>
                    <span className='font-normal text-[12px] leading-[25px] text-primary'>{user?.username}</span>
                  </>}
              </div>
            </div>
          </div>

          {/* Model details section */}
          <div className='max-w-[800px] mx-auto mt-4 bg-white p-4 space-y-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("userName")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.username}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("userId")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.userId}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("selfIntroduction")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.selfIntroduction}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("address")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.address}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("genres")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.genres}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-start justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("achievements")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <div className='flex-1 min-w-[140px]'>
                    {
                      user?.achievements?.map((achievement: any, index: number) => {
                        return (
                          <span key={index}><span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{achievement}</span><br></br></span>
                        )
                      })
                    }
                  </div>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("shootingPrice")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.shootingPrice}</span>
                </>
              }
            </div>

            {user?.snsUsername && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("snsUsername")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.snsUsername}</span>
                </>
              }
            </div>}

            {user?.instagram && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("instagram")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.instagram}</span>
                </>
              }
            </div>}

            {user?.twitter && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>{t("twitter")}</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.twitter}</span>
                </>
              }
            </div>}
          </div>

          {/* Gallery */}
          <div className='mt-8 mb-4'>
            <div className='max-w-[800px] mx-auto'>
              <span className='text-[14px] leading-[20px] font-semibold text-[#111111]'>Gallery</span>
            </div>
          </div>
          <div>
            <Gallery images={user?.images} loading={loading} />
          </div>

        </div>

        {/* Photographer profile view */}
        <div className={`${profession === "photographer" ? "" : "hidden"} max-w-[800px] md:mx-auto my-4 mx-2`}>

          {/* Profile image */}
          <div className='md:flex md:items-center md:justify-center my-8'>
            <div className='flex items-center justify-center md:w-[50%]'>
              <div className='h-[calc(min(100%,380px))] w-[calc(min(100%,380px))] flex items-center justify-center overflow-hidden aspect-square'>
                {loading || user?.profilePicture === "" ?
                  <div className='w-full h-full md:h-[380px] md:w-[380px] rounded-md bg-gray-200 animate-pulse'></div>
                  :
                  (user?.profilePicture ? <Image src={user?.profilePicture} alt="User" height={380} width={380} className='h-full w-full rounded-md animate-in object-cover object-center' /> : <Image src={userAvatar} alt="User" objectFit="contain" objectPosition="center" height={380} width={380} className='h-full w-full' />)
                }
              </div>
            </div>

            <div className='md:w-[50%] md:h-[380px] p-4 flex items-center justify-between'>
              <div className={`${loading ? "animate-pulse" : ""} bg-primary px-6 py-2 rounded-full`}>
                {loading ? <div className='h-6 w-20'></div> : <span className='h-6 w-20 flex items-center justify-center gap-2 font-medium text-[14px] leading-[25px] text-white'>{badgeIcon} Visitor</span>}
              </div>
              <div className='flex flex-col items-end justify-center space-y-2'>
                {loading ? <>
                  <div className='h-4 w-24 rounded-md bg-gray-200 animate-pulse'></div>
                  <div className='h-4 w-20 rounded-md bg-gray-200 animate-pulse'></div>
                </> :
                  <>
                    <span className='font-medium text-[14px] leading-[25px] text-[#111111]'>{user?.firstName} {user?.lastName}</span>
                    <span className='font-normal text-[12px] leading-[25px] text-primary'>{user?.username}</span>
                  </>}
              </div>
            </div>
          </div>

          {/* Photographer details section */}
          <div className='max-w-[800px] mx-auto mt-4 bg-white p-4 space-y-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>User Name</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.username}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Camera Type</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.cameraType}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Photography Experience</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.photographyExperience}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Main area</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.address}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Genre of expertise</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.genres}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-start justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Achievements</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <div className='flex-1 min-w-[140px]'>
                    {
                      user?.achievements?.map((achievement: any, index: number) => {
                        return (
                          <span key={index}><span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{achievement}</span><br></br></span>
                        )
                      })
                    }
                  </div>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Shooting price per hours</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.shootingPrice}</span>
                </>
              }
            </div>

            <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Transportation fee</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.transportationFee}</span>
                </>
              }
            </div>

            {user?.snsUsername && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>SNS Username</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.snsUsername}</span>
                </>
              }
            </div>}

            {user?.instagram && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>Instagram</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.instagram}</span>
                </>
              }
            </div>}

            {user?.twitter && <div className='flex flex-row gap-4 flex-wrap items-center justify-between'>
              <span className='flex-1 min-w-[140px] font-medium text-[14px] leading-[25px] text-[#111111]'>X</span>
              {loading ?
                <>
                  <div className='h-4 min-w-[140px] flex-1 bg-gray-200 animate-pulse rounded-md'></div>
                </> :
                <>
                  <span className='flex-1 min-w-[140px] font-normal text-[12px] leading-[18px] text-[#777777]'>{user?.twitter}</span>
                </>
              }
            </div>}
          </div>

          {/* Gallery */}
          <div className='mt-8 mb-4'>
            <div className='max-w-[800px] mx-auto'>
              <span className='text-[14px] leading-[20px] font-semibold text-[#111111]'>Gallery</span>
            </div>
          </div>
          <div>
            <Gallery images={user?.images} loading={loading} />
          </div>

        </div>

      </div>

    </div>
  )
}

const badgeIcon = <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.8611 0.342165C15.5486 -0.114055 16.4485 -0.114055 17.136 0.342165L18.2484 1.07337C18.6234 1.3171 19.0608 1.43584 19.5045 1.41084L20.8357 1.3296C21.6607 1.2796 22.4356 1.72957 22.8043 2.46702L23.4043 3.66069C23.6043 4.06067 23.9293 4.3794 24.323 4.57938L25.5291 5.18559C26.2666 5.55432 26.7166 6.32927 26.6666 7.15421L26.5853 8.48537C26.5603 8.92909 26.6791 9.37281 26.9228 9.74154L27.6603 10.854C28.1165 11.5414 28.1165 12.4414 27.6603 13.1288L26.9228 14.2475C26.6791 14.6225 26.5603 15.0599 26.5853 15.5037L26.6666 16.8348C26.7166 17.6598 26.2666 18.4347 25.5291 18.8034L24.3355 19.4034C23.9355 19.6034 23.6168 19.9284 23.4168 20.3221L22.8106 21.5283C22.4419 22.2657 21.6669 22.7157 20.842 22.6657L19.5108 22.5844C19.0671 22.5594 18.6234 22.6782 18.2546 22.9219L17.1422 23.6594C16.4548 24.1156 15.5548 24.1156 14.8674 23.6594L13.7487 22.9219C13.3737 22.6782 12.9362 22.5594 12.4925 22.5844L11.1614 22.6657C10.3364 22.7157 9.56146 22.2657 9.19273 21.5283L8.59277 20.3346C8.39278 19.9346 8.06781 19.6159 7.67408 19.4159L6.46791 18.8097C5.73046 18.441 5.28049 17.666 5.33049 16.8411L5.41173 15.5099C5.43673 15.0662 5.31799 14.6225 5.07425 14.2537L4.34305 13.1351C3.88683 12.4476 3.88683 11.5477 4.34305 10.8602L5.07425 9.74779C5.31799 9.37281 5.43673 8.93534 5.41173 8.49162L5.33049 7.16046C5.28049 6.33552 5.73046 5.56057 6.46791 5.19184L7.66158 4.59188C8.06156 4.38565 8.38654 4.06067 8.58652 3.66069L9.18648 2.46702C9.55521 1.72957 10.3302 1.2796 11.1551 1.3296L12.4863 1.41084C12.93 1.43584 13.3737 1.3171 13.7424 1.07337L14.8611 0.342165ZM20.9982 11.9976C20.9982 9.23532 18.7608 6.99797 15.9985 6.99797C13.2362 6.99797 10.9989 9.23532 10.9989 11.9976C10.9989 14.76 13.2362 16.9973 15.9985 16.9973C18.7608 16.9973 20.9982 14.76 20.9982 11.9976ZM4.08057 27.6091L6.77414 21.2033C6.78664 21.2095 6.79289 21.2158 6.79914 21.2283L7.3991 22.4219C8.1303 23.8718 9.64895 24.753 11.2738 24.6593L12.605 24.5781C12.6175 24.5781 12.6363 24.5781 12.6488 24.5906L13.7612 25.328C14.0799 25.5342 14.4174 25.6967 14.7674 25.8092L12.4175 31.3901C12.2738 31.7338 11.955 31.9651 11.5863 31.9963C11.2176 32.0276 10.8614 31.8588 10.6614 31.5463L8.64902 28.4653L5.143 28.984C4.78677 29.034 4.43055 28.8903 4.20556 28.609C3.98058 28.3278 3.93683 27.9403 4.07432 27.6091H4.08057ZM19.5795 31.3839L17.2297 25.8092C17.5797 25.6967 17.9172 25.5405 18.2359 25.328L19.3483 24.5906C19.3608 24.5843 19.3733 24.5781 19.3921 24.5781L20.7232 24.6593C22.3481 24.753 23.8668 23.8718 24.598 22.4219L25.1979 21.2283C25.2042 21.2158 25.2104 21.2095 25.2229 21.2033L27.9227 27.6091C28.0602 27.9403 28.0102 28.3216 27.7915 28.609C27.5728 28.8965 27.2103 29.0403 26.8541 28.984L23.348 28.4653L21.3357 31.5401C21.1357 31.8526 20.7795 32.0213 20.4107 31.9901C20.042 31.9588 19.7233 31.7213 19.5795 31.3839Z" fill="#FFFFFF" />
</svg>