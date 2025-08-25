"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Images,
  User,
  Menu,
  X,
} from "lucide-react";
import ConnectButton from "./ConnectButton";

const Logo = () => (
  <Link href="/" className="flex items-center gap-0.5">
    <img 
      src="/mym-logo.png" 
      alt="MintMyMood Logo" 
      className="h-10 w-10 object-contain flex-shrink-0"
    />
    <span className="hidden md:inline text-base font-bold text-[#222222]">
      MintMyMood
    </span>
  </Link>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky w-full top-0 z-50 border-b border-gray-200/50 bg-white/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
        <Logo />
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-lg text-[#666666]">
            <Link
              href="/leaderboard"
              title="Leaderboard"
              className="flex items-center gap-2 transition-transform hover:scale-110 hover:text-[#FF6B6B]"
            >
              <Trophy size={18} />
              <span className="text-sm font-medium">Leaderboard</span>
            </Link>
            <Link
              href="/gallery"
              title="Mood Gallery"
              className="flex items-center gap-2 transition-transform hover:scale-110 hover:text-[#FF6B6B]"
            >
              <Images size={18} />
              <span className="text-sm font-medium">Gallery</span>
            </Link>
            <Link
              href="/profile"
              title="My Profile"
              className="flex items-center gap-2 transition-transform hover:scale-110 hover:text-[#FF6B6B]"
            >
              <User size={18} />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </nav>
          <div className="hidden md:block h-6 w-px bg-gray-200" />
          <ConnectButton />

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-[#222222]"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* THE FIX: Menu Panel updated with blur and semi-transparent background */}
        <div
          className={`absolute top-0 right-0 h-full w-64 bg-white/80 backdrop-blur-lg border-l border-gray-200/50 shadow-xl transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-[#222222]">Navigation</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-[#666666] hover:text-[#222222]"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              <Link
                href="/leaderboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#222222] hover:text-[#FF6B6B]"
              >
                <Trophy size={20} /> Leaderboard
              </Link>
              <Link
                href="/gallery"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#222222] hover:text-[#FF6B6B]"
              >
                <Images size={20} /> Gallery
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#222222] hover:text-[#FF6B6B]"
              >
                <User size={20} /> My Profile
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
