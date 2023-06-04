import { NextResponse, type NextRequest } from "next/server";
// import { authMiddleware } from "@zapix/auth";

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  afterAuth(auth, req, evt) {
    // console.log("Shoudlnt Be Showing", auth);
    const url = req.nextUrl.clone();
    if (!url.pathname.startsWith("/api/")) {
      console.log("Found", url.pathname);
      if (!auth.userId) {
        if (
          url.pathname !== "/login" &&
          url.pathname !== "/sso-callback" &&
          url.pathname !== "/register"
        ) {
          console.log("NotAuthed", url.pathname);
          url.pathname = "/login";
          return NextResponse.redirect(url);
        }
      }
    }
    console.log("IsAuthed", auth.userId);
    if (url.pathname === "/" || url.pathname === "/channels") {
      url.pathname = "/channels/me";
      return NextResponse.redirect(url);
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
