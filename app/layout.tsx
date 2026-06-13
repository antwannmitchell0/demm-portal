import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DEMM OS — Operator Portal',
  description: 'DEMM Marketing Engine — War Room Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
