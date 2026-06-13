'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs text-amber-500 font-mono tracking-widest uppercase">Live System</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-amber-500">DEMM</span>{' '}
            <span className="text-white">OS</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Operator Portal — Authorized Access Only</p>
        </div>

        {/* Clerk sign-in widget */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              variables: {
                colorBackground: '#111111',
                colorText: '#ffffff',
                colorPrimary: '#f59e0b',
                colorInputBackground: '#1a1a1a',
                colorInputText: '#ffffff',
                borderRadius: '6px',
              },
              elements: {
                card: 'bg-[#111] border border-[#2a2a2a] shadow-2xl',
                headerTitle: 'text-white',
                headerSubtitle: 'text-zinc-400',
                formButtonPrimary:
                  'bg-amber-500 hover:bg-amber-400 text-black font-semibold',
                footerActionLink: 'text-amber-500 hover:text-amber-400',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
