import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, searchParams } = req.nextUrl;
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  console.log('Callback URL:', callbackUrl);

  if (token && (pathname === "/" || pathname === '/auth/sign-in' || pathname === '/auth/sign-up')) {
    return NextResponse.redirect(new URL(callbackUrl , req.url));
  }

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/sign-in", "/auth/sign-up", "/dashboard", "/"],
};
