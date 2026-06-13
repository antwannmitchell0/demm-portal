import { redirect } from 'next/navigation';

export default async function Home() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If Clerk is not configured, show setup page instead of crashing
  if (!clerkKey) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-2xl font-bold tracking-wider">
              <span className="text-amber-500">DEMM</span>
              <span className="text-white"> OS</span>
            </span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-100 mb-3">
            Portal Setup Required
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6">
            Authentication keys have not been configured yet. Add{' '}
            <code className="text-amber-500/80 bg-amber-500/10 px-1 py-0.5 rounded text-xs">
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            </code>{' '}
            and{' '}
            <code className="text-amber-500/80 bg-amber-500/10 px-1 py-0.5 rounded text-xs">
              CLERK_SECRET_KEY
            </code>{' '}
            to Vercel to activate the portal.
          </p>
          <div className="w-full h-px bg-[#2a2a2a]" />
          <p className="text-zinc-700 text-xs mt-4">DEMM Marketing Engine</p>
        </div>
      </div>
    );
  }

  // Clerk is configured — import auth dynamically and handle redirect
  const { auth } = await import('@clerk/nextjs/server');
  const { userId } = auth();
  if (userId) {
    redirect('/dashboard');
  }
  redirect('/sign-in');
}
