"use client";

import Link from "next/link";
import { FaTrophy, FaImages, FaUserCircle } from "react-icons/fa";
import ConnectButton from "./ConnectButton";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B6B] text-xl font-bold text-white">
      M
    </div>
    <span className="text-2xl font-bold text-[#222222]">MintMyMood</span>
  </Link>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Logo />
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="flex items-center gap-2 md:gap-6 text-lg text-[#666666]">
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
          <div className="h-6 w-px bg-gray-200 hidden md:block" />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
