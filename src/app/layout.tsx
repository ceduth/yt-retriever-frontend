import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from '@/components/Footer';


// Font configuration
const geist = Geist({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-geist-mono', 
});

// Next.js 13+ app router automagically uses metadata for SEO when exported from a layout or page file.
export const metadata: Metadata = {
  title: 'YouTube Data Tools',
  description: 'ML experimentation toolkit for YouTube data. Easily extract YouTube data, gather video statistics, explore API data, and gain novel audience insights.',
  keywords: 'YouTube, analytics, data, metrics, scraper, API, videos, statistics',
  authors: [{ name: 'Data Insights Team at Cru.org' }],
  openGraph: {
    title: 'YouTube Data Tools',
    description: 'Comprehensive YouTube analytics suite and data extraction tools',
    url: 'https://ytdt.ceduth.dev',
    siteName: 'YouTube Data Tools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo-og.png', // Place your Open Graph image here
        width: 1200,
        height: 630,
        alt: 'YouTube Data Tools'
      }
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className={`flex flex-col min-h-screen bg-gray-50 font-sans ${geist.className}`}>

      <header className="bg-white border-b border-gray-200 py-3">
          <div className="container mx-auto px-6">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.svg"
                alt="YouTube Data Tools"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold text-gray-800">YouTube Data Tools</span>
            </Link>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}