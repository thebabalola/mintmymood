import { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import AppKitProvider from "@/contexts/AppKitProvider";
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const URL = "https://mintmymood.vercel.app";
  return {
    title: 'MintMyMood',
    description: 'Transform your daily emotions into unique NFTs and share your mood journey with friends',
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: 'https://mintmymood.vercel.app/og.png',
        button: {
          title: 'Launch MintMyMood',
          action: {
            type: 'launch_frame',
            name: 'MintMyMood',
            url: URL,
            splashImageUrl: 'https://mintmymood.vercel.app/mym-logo.png',
            splashBackgroundColor: '#FFFACD',
          },
        },
      }),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <body>
        <AppKitProvider cookies={cookies}>
          <Providers>{children}</Providers>
        </AppKitProvider>
      </body>
    </html>
  );
}
