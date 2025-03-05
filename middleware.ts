import { NextRequest, NextResponse } from 'next/server';

const publicPages = [
  '/onboard',
  '/login',
  '/registration',
  '/forgot-password',
  '/reset-password',
  '/',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Manually check for the presence of a token in the cookies
  const token = req.cookies.get('toritoraAuth')?.value;
  console.log("Token:", token);

  // Regex for public pages
  const publicPathnameRegex = new RegExp(
    `^(${publicPages
      .flatMap((p) => (p === '/' ? [''] : [p]))  // Handle '/' properly
      .map((p) => p.replace(/\//g, '\\/'))         // Escape '/' for regex
      .join('|')})/?$`, 
    'i'
  );

  // If the user is logged in (has a token), prevent them from going to public pages
  if (token) {
    // Check if the user is trying to access a public page (login, signup, onboard)
    if(pathname === '/'){
      return NextResponse.next();
    }
    if (publicPathnameRegex.test(pathname)) {
      console.log("User already logged in. Redirecting to /dashboard or another page.");
      return NextResponse.redirect(new URL('/', req.nextUrl.origin)); // Redirect to dashboard (or home)
    }
  }

  // Check if the current path is public
  const isPublicPage = publicPathnameRegex.test(pathname);

  // If the page is not public and the user does not have a token, redirect to login
  if (!isPublicPage && !token) {
    console.log("No token found. Redirecting to /onboard");
    return NextResponse.redirect(new URL('/onboard', req.nextUrl.origin));
  }

  // Allow the request to continue if it's a public page or if a valid token is present
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // Apply middleware to all paths except those that should be skipped
};
