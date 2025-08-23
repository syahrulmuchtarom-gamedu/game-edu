import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RegisterSW from './register-sw';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Game Edukasi Anak - Belajar Sambil Bermain',
  description: 'Aplikasi game edukasi untuk anak-anak dengan 15 permainan seru dan mendidik',
  keywords: 'game edukasi, anak-anak, belajar, matematika, bahasa, sains',
  authors: [{ name: 'Educational Games Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#4F46E5',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}