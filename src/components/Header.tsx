"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaTrophy,
  FaImages,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import ConnectButton from "./ConnectButton";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B6B] text-xl font-bold text-white flex-shrink-0">
      M
    </div>
    <span className="hidden md:inline text-2xl font-bold text-[#222222]">
      MintMyMood
    </span>
  </Link>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Logo />
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 text-lg text-[#666666]">
            <Link
              href="/leaderboard"
              title="Leaderboard"
              className="transition-transform hover:scale-110 hover:text-[#FF6B6B]"
            >
              <FaTrophy />
            </Link>
            <Link
              href="/gallery"
              title="Mood Gallery"
              className="transition-transform hover:scale-110 hover:text-[#FF6B6B]"
            >
              <FaImages />
            </Link>
            <Link
              href="/profile"
              title="My Profile"
              className="transition-transform hover:scale-110 hover:text-[#FF6B6B]"
            >
              <FaUserCircle />
            </Link>
          </nav>
          <div className="hidden md:block h-6 w-px bg-gray-200" />
          <ConnectButton />

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-2xl text-[#222222]"
            >
              <FaBars />
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
                className="text-2xl text-[#666666] hover:text-[#222222]"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              <Link
                href="/leaderboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#222222] hover:text-[#FF6B6B]"
              >
                <FaTrophy /> Leaderboard
              </Link>
              <Link
                href="/gallery"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#222222] hover:text-[#FF6B6B]"
              >
                <FaImages /> Gallery
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#222222] hover:text-[#FF6B6B]"
              >
                <FaUserCircle /> My Profile
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
