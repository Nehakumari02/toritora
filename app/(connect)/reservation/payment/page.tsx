"use client"
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import UserDetailsSkeleton from '@/components/skeleton/userDetailsSkeleton';
import { Loader2 } from 'lucide-react';
import { backIcon } from '@/constants/icons';
import { useTranslations } from 'next-intl'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const t = useTranslations('Payment');
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/reservation/payment/success`,
      },
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className='m-4 flex-1 flex flex-col items-center justify-around'>
      <PaymentElement className='w-full' />
      <button onClick={handleSubmit} disabled={isLoading} className='w-full h-[54px] text-[16px] leading-[24px] font-bold text-center bg-secondary flex items-center justify-center text-white rounded-md'>{isLoading ? <Loader2 className='animate-spin' /> : t("payNow")}</button>
    </div>
  );
};

const PaymentPage = () => {
  const t = useTranslations('Payment');
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");

  if (!clientSecret) return <div className='h-full w-full flex items-center justify-center'><Loader2 className='animate-spin' /></div>;

  const handleGoBack = () => {
    router.back();
  }

  return (
    <div className='h-[100dvh] flex flex-col'>
      <header className='w-full h-[72px] flex-shrink-0 sticky top-0 z-10 bg-white flex items-center justify-center shadow-lg'>
        <button onClick={handleGoBack} className='absolute top-[50%] translate-y-[-50%] left-4'>{backIcon}</button>
        <span className='text-[16px] leading-[24px] text-center font-semibold'>{t("title")}</span>
      </header>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<UserDetailsSkeleton />}>
      <PaymentPage />
    </Suspense>
  );
}
