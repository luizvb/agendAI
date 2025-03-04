import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const isAppDomain = hostname.startsWith("app.");
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const url = request.nextUrl.clone();

  // Em localhost, permite acesso a todas as rotas
  if (isLocalhost) {
    return NextResponse.next();
  }

  // Para app.gendaia.com.br - permite acesso ao dashboard e rotas do app
  if (isAppDomain) {
    // Se tentar acessar a landing page pelo domínio do app, redireciona para o dashboard
    if (url.pathname === "/" || url.pathname.startsWith("/(marketing)")) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Para gendaia.com.br - permite apenas acesso à landing page
  if (!url.pathname.startsWith("/(marketing)") && url.pathname !== "/") {
    url.pathname = "/";
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
