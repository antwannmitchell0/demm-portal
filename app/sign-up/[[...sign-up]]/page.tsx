'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-amber-500">DEMM</span>{' '}
            <span className="text-white">OS</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Create Operator Account</p>
        </div>

        <div className="flex justify-center">
          <SignUp
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
