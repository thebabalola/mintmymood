import { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
