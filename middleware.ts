import { NextRequest, NextResponse } from "next/server";
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token");
  if (url.pathname === "/") {
    if (token === undefined || token === null || token.value === "") {
      //   return NextResponse.redirect(new URL("/", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  if (url.pathname != "/") {
    if (token === undefined || token === null || token.value === "") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|pharm_logo.png|chickoo_logo.png).*)",
  ],
};
