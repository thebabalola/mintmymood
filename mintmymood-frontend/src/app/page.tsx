"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MiniHero from "../components/MiniHero";
import MoodForm from "../components/MoodForm";
import NFTGallery from "../components/NFTGallery";
import { useReadContract, useAccount } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

// A simple component to render the background emojis
const BackgroundEmojis = () => (
  <div
    className="absolute inset-0 -z-10 h-full w-full overflow-hidden"
    aria-hidden="true"
  >
    <div className="relative h-full w-full">
      {/* The text color of the parent is inherited, and opacity-5 makes them faint */}
      <span className="absolute top-[5%] left-[10%] text-5xl opacity-5">
        😊
      </span>
      <span className="absolute top-[15%] right-[15%] text-6xl opacity-5">
        😢
      </span>
      <span className="absolute top-[30%] left-[25%] text-4xl opacity-5">
        😠
      </span>
      <span className="absolute top-[50%] right-[30%] text-7xl opacity-5">
        🤔
      </span>
      <span className="absolute top-[65%] left-[5%] text-6xl opacity-5">
        😍
      </span>
      <span className="absolute bottom-[10%] right-[10%] text-5xl opacity-5">
        😂
      </span>
      <span className="absolute bottom-[25%] left-[40%] text-4xl opacity-5">
        🥳
      </span>
      <span className="absolute top-[80%] right-[50%] text-6xl opacity-5">
        😴
      </span>
    </div>
  </div>
);

export default function Home() {
  const { address } = useAccount();
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { data: streak } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "streakCount",
    args: [address],
  });

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return (
    // We are using hardcoded hex values for background and text colors.
    <div className="relative flex min-h-screen flex-col bg-[#F7F8FC] text-[#222222]">
      {/* Renders the faint emojis in the background */}
      <BackgroundEmojis />

      {/* Renders the new, modern header */}
      <Header />

      {/* Main content area for the mood form and gallery */}
      <main className="flex w-full flex-col items-center px-2 py-12 md:px-6 md:py-16 flex-grow">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col items-center gap-12 md:gap-16">
            <MiniHero />
            <MoodForm />
            <NFTGallery />
          </div>
        </div>
      </main>

      {/* Renders the new, minimal footer */}
      <Footer />
    </div>
  );
}
