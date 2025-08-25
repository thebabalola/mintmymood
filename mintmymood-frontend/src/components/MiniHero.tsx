"use client";

import React, { useState, useEffect } from "react";
import { FaGem, FaMagic, FaTrophy, FaBrain, FaHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// The FeatureCard component's UI is already suitable for mobile, so no changes are needed here.
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
  const [showFeatures, setShowFeatures] = useState(false);
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
    // THE FIX: Adjusted vertical padding for better spacing on mobile.
    <section className="relative w-full overflow-hidden py-4 md:py-8 lg:py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#FF6B6B] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FFD93D] rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-[#6BCB77] rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* THE FIX: Adjusted gap for mobile vs. desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <div className="text-center lg:text-left">
            {/* THE FIX: Responsive font sizes for the main headline. */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#222222] mb-4 tracking-tight">
              Turn Your Feelings Into <br className="hidden sm:block" />{" "}
              {/* Hide line break on very small screens */}
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

            {/* THE FIX: Responsive font size for the paragraph. */}
            <p className="text-md md:text-lg text-[#666666] mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              The first gamified Web3 mood journal. Express your emotions daily,
              receive AI-powered insights, and own your wellness journey as
              unique NFTs.
            </p>

            {/* The flex-wrap already makes this section responsive. No changes needed. */}
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

            {/* THE FIX: The justify-center is already responsive due to lg:justify-start on the parent */}
            <div className="flex flex-col items-center lg:items-start gap-4">
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
              
              {/* Mobile Features Toggle */}
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-[#FF6B6B] hover:text-[#FF5252] transition-colors duration-200"
              >
                {showFeatures ? (
                  <>
                    <FaChevronUp className="w-4 h-4" />
                    Hide Features
                  </>
                ) : (
                  <>
                    <FaChevronDown className="w-4 h-4" />
                    Show Features
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feature cards - hidden on mobile by default, shown on desktop */}
          <div className={`relative flex flex-col items-center gap-4 transition-all duration-300 ${
            showFeatures ? 'block' : 'hidden lg:flex'
          }`}>
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
