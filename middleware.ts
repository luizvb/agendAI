import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const isAppDomain = hostname.startsWith("app.");
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const url = request.nextUrl.clone();

  // Se for app.gendaia.com.br, continua normalmente
  if (isAppDomain) {
    return NextResponse.next();
  }

  // Se for localhost ou gendaia.com.br e não estiver na landing page, redireciona para a landing page
  if ((isLocalhost || !isAppDomain) && !url.pathname.startsWith("/")) {
    url.pathname = "/(marketing)";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons (PWA icons)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons).*)",
  ],
};
