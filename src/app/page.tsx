"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MoodForm from "../components/MoodForm";
import NFTGallery from "../components/NFTGallery";
import Leaderboard from "../components/Leaderboard";
import StreakProgress from "../components/StreakProgress";
import ShareButtons from "../components/ShareButtons";
import UserBadges from "../components/UserBadges";
import { useReadContract, useAccount } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";

export default function Home() {
  const { address } = useAccount();
  const { data: streak } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "streakCount",
    args: [address],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-6 space-y-6 flex-grow">
        <MoodForm />
        <NFTGallery />
        <Leaderboard />
        <UserBadges />
        <StreakProgress streak={Number(streak) || 0} />
        <ShareButtons
          moodType="Happy" // Placeholder: Update dynamically post-mint
          title="Happy Vibe"
          caption="Feeling great!"
          emoji="😊"
          imageUrl="ipfs://placeholder"
        />
      </main>
      <Footer />
    </div>
  );
}
