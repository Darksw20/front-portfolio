import { NextResponse, type NextRequest } from 'next/server';
// The root can restore a saved choice; explicit localized URLs remain shareable and crawlable.
export function middleware(request: NextRequest) {
  if(request.nextUrl.pathname === '/' && request.nextUrl.locale === 'en-US' && request.cookies.get('NEXT_LOCALE')?.value === 'es-MX') {
    const url=request.nextUrl.clone();url.locale='es-MX';return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/'] };
