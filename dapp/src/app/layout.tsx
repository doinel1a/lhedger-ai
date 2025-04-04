import '../styles/globals.css';
import '../styles/globals.scss';
import '@coinbase/onchainkit/styles.css';

import React from 'react';

import type { Metadata, Viewport } from 'next';

import config from '_config';
import { Analytics } from '@vercel/analytics/react';

import Footer from '@/components/footer';
import WithSupportedChains from '@/components/hoc/with-supported-chains';
import Navbar from '@/components/navbar';
import RootProvider from '@/components/providers/root';
import Sidebar from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: config.metadata.title,
  description: config.metadata.description,
  keywords: config.metadata.keywords,
  icons: '/favicon.svg',
  manifest: '/app.webmanifest'
};

export const viewport: Viewport = {
  themeColor: '#000'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <RootProvider>
          <SidebarProvider>
            <WithSupportedChains>
              <Sidebar />

              <SidebarInset>
                <div className='grid min-h-[100dvh] grid-rows-[auto_1fr_auto]'>
                  <Navbar />
                  <div className='h-full w-full p-2.5 md:p-5'>{children}</div>
                  <Footer />
                </div>
              </SidebarInset>
            </WithSupportedChains>
          </SidebarProvider>

          <Analytics />
          <Toaster richColors closeButton />
        </RootProvider>
      </body>
    </html>
  );
}
