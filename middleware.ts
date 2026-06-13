import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Only activate Clerk middleware when keys are present.
// When keys are absent, pass all requests through so the app can render
// its "Setup Required" page instead of throwing a 500.
let clerkMiddleware: ((req: NextRequest) => Response | NextResponse) | null = null;

if (clerkKey) {
  const { authMiddleware } = require('@clerk/nextjs/server');
  clerkMiddleware = authMiddleware({
    publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)'],
  });
}

export default function middleware(req: NextRequest) {
  if (clerkMiddleware) {
    return clerkMiddleware(req);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
