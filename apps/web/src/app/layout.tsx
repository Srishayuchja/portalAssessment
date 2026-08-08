import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Lato, Public_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const lato = Lato({
  variable: '--font-lato',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  weight: ['500'],
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  weight: ['600'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DEALPORT Admin',
  description: 'DEALPORT admin dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${publicSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
