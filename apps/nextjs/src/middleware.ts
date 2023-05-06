import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest, res: NextResponse) {
  const url = req.nextUrl.clone();
  if (url.pathname === "/" || url.pathname === "/channels") {
    url.pathname = "/channels/me";
    return NextResponse.redirect(url);
  }
}
