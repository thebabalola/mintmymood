"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaHardHat } from "react-icons/fa";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FC]">
      <Header />
      {/* THE FIX: Adjusted padding on the main container for better mobile spacing */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        {/* The "Under Construction" UI */}
        {/* THE FIX: Added responsive padding and width classes */}
        <div className="w-full max-w-lg bg-white/50 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-lg border border-white/40">
          {/* THE FIX: Responsive icon size */}
          <FaHardHat className="text-6xl sm:text-7xl text-[#FFD93D] mx-auto mb-6" />

          {/* THE FIX: Responsive heading font size */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-2">
            Leaderboard Coming Soon!
          </h1>

          {/* The paragraph text size is already suitable for all screens, no changes needed */}
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
