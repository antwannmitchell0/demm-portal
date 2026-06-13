import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-[#0d0d0d] border border-[#2a2a2a] shadow-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-zinc-400',
            formFieldLabel: 'text-zinc-300',
            formFieldInput:
              'bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-zinc-600 focus:border-amber-500',
            formButtonPrimary:
              'bg-amber-500 hover:bg-amber-400 text-black font-semibold',
            footerActionLink: 'text-amber-500 hover:text-amber-400',
          },
        }}
      />
    </div>
  );
}
