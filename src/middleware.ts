import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest, res: NextResponse) {
  const url = req.nextUrl.clone();
  if (url.pathname === '/' || url.pathname === '/channels') {
    url.pathname = '/channels/me';
    return NextResponse.redirect(url);
  }
}

