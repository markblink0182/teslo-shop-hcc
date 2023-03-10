import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { getToken } from 'next-auth/jwt';

 
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log({session})
 
   if (!session) {
    return new Response( JSON.stringify({ message: 'No autorizado' }), {
      status: 401,
      headers: {
          'Content-Type':'application/json'
      }
  });
  } 
 
  const validRoles = ['admin'];
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
 
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
};