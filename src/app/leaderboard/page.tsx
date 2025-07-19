"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
// We no longer need the Leaderboard component itself, so the import is removed.
// import Leaderboard from "../../components/Leaderboard";

// Using a construction-themed icon from react-icons
import { FaHardHat } from "react-icons/fa";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FC]">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        {/* The "Under Construction" UI */}
        <div className="bg-white/50 backdrop-blur-lg p-12 rounded-2xl shadow-lg border border-white/40 max-w-lg">
          <FaHardHat className="text-7xl text-[#FFD93D] mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-[#222222] mb-2">
            Leaderboard Coming Soon!
          </h1>

          <p className="text-[#666666] leading-relaxed">
            We're busy crafting an exciting leaderboard where you can track the
            longest streaks and see who's the most consistent mood minter in the
            community. Stay tuned!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
