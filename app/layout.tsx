import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DEMM OS — Operator Portal',
  description: 'DEMM Marketing Engine — War Room Dashboard',
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

async function LayoutWithAuth({ children }: { children: React.ReactNode }) {
  if (clerkKey) {
    const { ClerkProvider } = await import('@clerk/nextjs');
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen antialiased`}
      >
        <LayoutWithAuth>{children}</LayoutWithAuth>
      </body>
    </html>
  );
}
