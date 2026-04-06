import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ScrollProgressBar } from '@/components/scroll-progress'
import { PageTitle } from '@/components/page-title'
import { LangProvider } from '@/contexts/lang-context'
import { ToastProvider } from '@/contexts/toast-context'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'erikderkeks',
  description: 'Software Developer from Switzerland. TypeScript, Azure, FiveM. Building systems worth maintaining.',
  openGraph: {
    title: 'erikderkeks',
    description: 'Software Developer from Switzerland. TypeScript, Azure, FiveM. Building systems worth maintaining.',
    url: 'https://erikderkeks.github.io/dev',
    siteName: 'erikderkeks',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://erikderkeks.github.io/dev/profile.webp',
        width: 400,
        height: 400,
        alt: 'erikderkeks',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'erikderkeks',
    description: 'Software Developer from Switzerland. TypeScript, Azure, FiveM.',
    images: ['https://erikderkeks.github.io/dev/profile.webp'],
  },
  metadataBase: new URL('https://erikderkeks.github.io'),
  icons: {
    icon: '/dev/favicon.svg',
    shortcut: '/dev/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <head>
        {/* Prevent flash of wrong theme — runs before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();` }} />
      </head>
      <body>
        <ScrollProgressBar />
        <PageTitle />
        <LangProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LangProvider>
      </body>
    </html>
  )
}
