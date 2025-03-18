import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
    // let locale = await requestLocale;

    // if (!locale || !routing.locales.includes(locale as any)) {
    //     locale = routing.defaultLocale;
    // }
    
    const cookieLocale = (await cookies()).get("TORITORA_LOCALE")?.value || 'jn';
    // const locale = 'jn';
    const locale = cookieLocale;

    return {
        locale,
        messages: (await import(`@/messages/${locale}.json`)).default
    };
});