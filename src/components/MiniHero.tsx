"use client";

import React, { useState, useEffect } from "react";
// Added FaHeart and HiSparkles back for the process flow
import { FaGem, FaMagic, FaTrophy, FaBrain, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// The dedicated FeatureCard component remains unchanged
const FeatureCard = ({
  icon,
  title,
  description,
  color,
  highlightColor,
}: any) => (
  <div
    className={`group relative bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40 transition-all duration-300 hover:shadow-xl hover:!border-${highlightColor}`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`flex-shrink-0 w-12 h-12 border-2 border-${color} rounded-xl flex items-center justify-center bg-${color}/10`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#222222] mb-1">{title}</h3>
        <p className="text-sm text-[#666666] leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default function MiniHero() {
  const [currentEmoji, setCurrentEmoji] = useState("😊");
  const [isAnimating, setIsAnimating] = useState(false);
  const moodEmojis = ["😊", "🎨", "🌟", "💎", "🚀", "💡"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentEmoji(
          moodEmojis[Math.floor(Math.random() * moodEmojis.length)]
        );
        setIsAnimating(false);
      }, 200);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Background radial gradients (no change) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#FF6B6B] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FFD93D] rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-[#6BCB77] rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Left Side: The Message & CTA */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#222222] mb-4 tracking-tight">
              Turn Your Feelings Into <br />
              <span className="bg-gradient-to-r from-[#FF6B6B] via-[#FFD93D] to-[#6BCB77] bg-clip-text text-transparent">
                Digital Treasures
              </span>
              <span
                className={`inline-block ml-2 transform transition-transform duration-500 ${
                  isAnimating ? "scale-125 rotate-12" : "scale-100"
                }`}
              >
                {currentEmoji}
              </span>
            </h1>

            <p className="text-lg text-[#666666] mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              The first gamified Web3 mood journal. Express your emotions daily,
              receive AI-powered insights, and own your wellness journey as
              unique NFTs.
            </p>

            {/* --- ADDED SECTION: The Process Flow --- */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="flex items-center gap-2">
                <FaHeart className="text-[#FF6B6B] w-5 h-5" />
                <span className="font-medium text-[#222222]">Feel</span>
              </div>
              <span className="font-semibold text-[#666666]">→</span>
              <div className="flex items-center gap-2">
                <HiSparkles className="text-[#FFD93D] w-5 h-5" />
                <span className="font-medium text-[#222222]">Generate</span>
              </div>
              <span className="font-semibold text-[#666666]">→</span>
              <div className="flex items-center gap-2">
                <FaGem className="text-[#6BCB77] w-5 h-5" />
                <span className="font-medium text-[#222222]">Own</span>
              </div>
            </div>
            {/* --- END OF ADDED SECTION --- */}

            <div className="flex justify-center">
              <p
                onClick={() =>
                  document
                    .getElementById("mood-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="cursor-pointer text-center text-sm text-[#aaaaaa] hover:text-[#777777] transition-colors duration-200"
              >
                Start minting your mood
              </p>
            </div>
          </div>

          {/* Right Side: Dynamic Feature Cards (no change) */}
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-full lg:translate-x-4">
              <FeatureCard
                icon={<FaMagic className="text-[#FF6B6B] w-6 h-6" />}
                title="AI-Powered Mood NFTs"
                description="Simply describe your feeling, and our AI crafts a unique NFT with personalized captions to capture your emotional essence."
                color="primary"
                highlightColor="[#FF6B6B]"
              />
            </div>
            <div className="w-full lg:-translate-x-4 lg:translate-y-2">
              <FeatureCard
                icon={<FaTrophy className="text-[#6BCB77] w-6 h-6" />}
                title="Streak & Badge System"
                description="Stay consistent with daily mood tracking to unlock exclusive badges and achievements that celebrate your journey."
                color="success"
                highlightColor="[#6BCB77]"
              />
            </div>
            <div className="w-full lg:translate-x-4 lg:translate-y-4">
              <FeatureCard
                icon={<FaBrain className="text-[#FFD93D] w-6 h-6" />}
                title="Smart Mood Analytics"
                description="Get weekly and monthly AI-generated reviews with personalized insights and positive wellness suggestions."
                color="secondary"
                highlightColor="[#FFD93D]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
