import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'jn'];

export default getRequestConfig(async ({ requestLocale }) => {
  if (!locales.includes(requestLocale)) notFound();

  return {
    messages: (await import(`./messages/${requestLocale}.json`)).default
  };
});
