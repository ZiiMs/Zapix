import { NextResponse, type NextRequest } from "next/server";
// import { authMiddleware } from "@zapix/auth";

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  afterAuth(auth, req, evt) {
    if (auth.userId) {
      const url = req.nextUrl.clone();
      if (url.pathname === "/" || url.pathname === "/channels") {
        url.pathname = "/channels/me";
        return NextResponse.redirect(url);
      }
    }
  },
  // debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export function middleware(req: NextRequest, res: NextResponse) {
//   const url = req.nextUrl.clone();
//   if (url.pathname === "/" || url.pathname === "/channels") {
//     url.pathname = "/channels/me";
//     return NextResponse.redirect(url);
//   }
// }
