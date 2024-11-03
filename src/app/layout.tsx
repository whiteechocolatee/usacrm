import { ConvexClientProvider } from '@/components/convex-client-provider';
import JotaiProvider from '@/components/jotai-provider';
import Modals from '@/components/modals';
import { Toaster } from '@/components/ui/sonner';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunito = Nunito_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Slack',
  description: 'slack',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={nunito.className}>
          <ConvexClientProvider>
            <Toaster />
            <JotaiProvider>
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
