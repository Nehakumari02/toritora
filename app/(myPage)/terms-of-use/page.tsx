"use client"
import { backIcon } from '@/constants/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react'

function TermsOfUse() {
  const router = useRouter();
  const t = useTranslations("MyPage.settings.termsOfServicePage")

  const handleGoBack = ()=>{
    router.back();
  }

  const handleGoToLink = (route:string)=>{
    router.push(route)
  }

  return (
    <div className='flex flex-col h-full'>
      <header className="sticky top-0 w-full h-[72px] flex items-center justify-center bg-white shadow-lg">
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className="text-[16px] leading-[24px] text-center font-semibold">{t("termsOfService")}</span>
      </header>

      <div className='mx-8 py-8 space-y-8 md:max-w-[800px] md:mx-auto flex-1 overflow-y-scroll no-scrollbar'>
        
        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("purpose_of_terms")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("purpose_of_terms_text")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("agreement_to_terms")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("agreement_to_terms_d1")}</p>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("agreement_to_terms_d2")}</p>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("agreement_to_terms_d3")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("membership_eligibility")}</span>
          <div className='pl-5 space-y-2'>
            <ol className='list-disc'>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_eligibility_d1")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_eligibility_d2")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_eligibility_d3")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_eligibility_d4")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_eligibility_d5")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_eligibility_d6")}</p></li>
            </ol>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("membership_restriction_conditions")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("membership_restriction_conditions_d")}</p>
          <div className='pl-5 space-y-2'>
            <ol className='list-disc'>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list1")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list2")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list3")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list4")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list5")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list6")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list7")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list8")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("membership_restriction_conditions_list9")}</p></li>
            </ol>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("service_provision")}</span>
          <div className='pl-5 space-y-2'>
            <ol className='list-disc'>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_provision_d1")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_provision_d2")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_provision_d3")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_provision_d4")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_provision_d5")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_provision_d6")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_provision_d7")}</p></li>
            </ol>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("service_suspension_conditions")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("service_suspension_conditions_d")}</p>
          <div className='pl-5 space-y-2'>
            <ol className='list-disc'>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspension_conditions_list1")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspension_conditions_list2")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspension_conditions_list3")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspension_conditions_list4")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspension_conditions_list5")}</p></li>
            </ol>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("member_responsibilities")}</span>
          <div className='pl-5 space-y-2'>
            <ol className='list-disc'>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("member_responsibilities_d1")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("member_responsibilities_d2")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("member_responsibilities_d3")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("member_responsibilities_d4")}</p></li>
              <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("member_responsibilities_d5")}</p></li>
            </ol>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("prohibited_acts")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("prohibited_acts_d")}</p>
          <div className='pl-8 space-y-2'>
            <ol className='list-decimal text-[14px]'>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list1")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list2")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list3")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list4")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list5")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list6")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list7")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list8")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list9")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list10")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list11")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list12")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list13")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list14")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list15")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list16")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list17")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list18")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list19")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list20")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list21")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list22")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list23")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list24")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list25")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list26")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list27")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list28")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list29")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list30")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list31")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list32")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list33")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list34")}</p></li>
              <li><p className='pl-1 font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_acts_list35")}</p></li>
            </ol>
            <div className='pl-4 space-y-2'>
              <ol className='list-disc'>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_discriminatory")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_defamatory")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_false_information")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_illegal_acts")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_infringement")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_personal_info_request")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_illegal_info")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_external_service_promotion")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_advertisement")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_personal_identifiable_info")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_sexual_inducement")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_sexual_expression")}</p></li>
                <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibited_content_other_inappropriate")}</p></li>
              </ol>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("response_to_prohibited_acts_intro")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("response_to_prohibited_acts_delete_without_notice")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("response_to_prohibited_acts_warn_member")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("response_to_prohibited_acts_suspend_or_expulse")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("response_to_prohibited_acts_no_liability")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("cancel_section_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("cancel_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("cancel_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("cancel_clause_3")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("payment_application_and_fee_section_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_5")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_6")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_7")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_8")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_9")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_10")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_11")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_12")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("payment_clause_13")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("rights_ownership_title")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("rights_ownership_content")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("portrait_rights_agreement_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3")}</p>
              <div className='pl-2 space-y-2'>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3_1")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3_2")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3_3")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3_4")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3_5")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3_6")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_3_note")}</p>
              </div>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4")}</p>
              <div className='pl-2 space-y-2'>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4_1")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4_2")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4_3")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4_4")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4_5")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4_6")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("portrait_rights_agreement_clause_4_note")}</p>
              </div>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("portrait_rights_between_members_title")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("portrait_rights_between_members_content")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("warranty_of_rights_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2")}</p>
              <div className='pl-2 space-y-2'>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_1")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_2")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_3")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_4")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_5")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_6")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_7")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_2_8")}</p>
              </div>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("warranty_of_rights_clause_3")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("point_grant_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("point_grant_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("point_grant_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("point_grant_clause_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("point_grant_clause_4")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("point_non_redeemable_title")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("point_non_redeemable_content")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("tax_and_costs_title")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("tax_and_costs_content")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("loss_of_membership_title")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("loss_of_membership_content")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("equipment_and_environment_title")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("equipment_and_environment_clause_1")}</p>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("equipment_and_environment_clause_2")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("confidentiality_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_2")}</p>
              <div className='pl-2 space-y-2'>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_2_1")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_2_2")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_2_3")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_2_4")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_2_5")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_2_6")}</p>
              </div>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_5")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("confidentiality_clause_6")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("personal_information_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("personal_information_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("personal_information_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("personal_information_clause_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("personal_information_clause_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("personal_information_clause_5")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("personal_information_clause_6")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("representation_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("representation_clause_1")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("prohibition_of_assignment_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("prohibition_of_assignment_clause_1")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("username_password_management_title")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("username_password_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("username_password_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("username_password_clause_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("username_password_clause_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("username_password_clause_5")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("death_handling_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("death_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("death_clause_2")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("service_suspend_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_1")}</p>
              <div className='pl-2 space-y-2'>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_1_1")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_1_2")}</p>
                  <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_1_3")}</p>
              </div>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_suspend_5")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("info_storage_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("info_storage_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("info_storage_2")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("service_update_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_update_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("service_update_2")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("disclaimer_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer_5")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer_6")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("disclaimer.disclaimer")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer.disclaimer_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer.disclaimer_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer.disclaimer_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer.disclaimer_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("disclaimer.disclaimer_5")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("anti_social_forces")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_4")}</p>
              <div className='pl-5 space-y-2'>
                <ol className='list-disc'>
                  <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_4_1")}</p></li>
                  <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_4_2")}</p></li>
                  <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_4_3")}</p></li>
                  <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_4_4")}</p></li>
                  <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_4_5")}</p></li>
                  <li><p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("anti_social_4_6")}</p></li>
                </ol>
              </div>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("damage_compensation_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("damage_compensation_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("damage_compensation_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("damage_compensation_clause_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("damage_compensation_clause_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("damage_compensation_clause_5")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("liability_cap_heading")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("liability_cap_clause")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("terms_change_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("terms_change_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("terms_change_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("terms_change_clause_3")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("notification_heading")}</span>
          <div className=' space-y-2'>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("notification_clause_1")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("notification_clause_2")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("notification_clause_3")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("notification_clause_4")}</p>
              <p className='font-normal text-[14px] leading-[20px] text-[#333333] py-1'>{t("notification_clause_5")}</p>
          </div>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("service_transfer_heading")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("service_transfer_clause")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("severability_heading")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("severability_clause")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("entire_agreement_heading")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("entire_agreement_clause")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("governing_law_jurisdiction_heading")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("governing_law_jurisdiction_clause")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("language_heading")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("language_clause")}</p>
        </div>

        <div className='space-y-4'>
          <span className='font-semibold text-[18px] leading-[24px] text-[#111111]'>{t("discussion_heading")}</span>
          <p className='font-normal text-[14px] leading-[20px] text-[#333333]'>{t("discussion_clause")}</p>
        </div>

      </div>

    </div>
  )
}

export default TermsOfUse