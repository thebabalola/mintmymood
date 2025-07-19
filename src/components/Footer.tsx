import Link from "next/link";
import { FaTrophy, FaImages, FaUserCircle } from "react-icons/fa";

// Logo component remains unchanged
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-[#FF6B6B] flex items-center justify-center font-bold text-white text-xl">
      M
    </div>
    <span className="font-bold text-[#222222]">MintMyMood</span>
  </Link>
);

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200/80 bg-[#F7F8FC]">
      {/* 
        THE FIX: The main container now orchestrates the layout.
        - On mobile (default): `flex-col` stacks and centers everything.
        - On desktop (`sm:`): `flex-row` and `justify-between` distributes the three main items evenly.
      */}
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-6 sm:flex-row sm:justify-between md:px-6">
        {/* Item 1: Logo (Stays on the left on desktop) */}
        <Logo />

        {/* Item 2: Navigation (Perfectly centered on desktop) */}
        <nav className="flex items-center gap-6">
          <Link
            href="/leaderboard"
            title="Leaderboard"
            className="text-[#666666] transition-colors hover:text-[#222222]"
          >
            <FaTrophy size={20} />
          </Link>
          <Link
            href="/gallery"
            title="Mood Gallery"
            className="text-[#666666] transition-colors hover:text-[#222222]"
          >
            <FaImages size={20} />
          </Link>
          <Link
            href="/profile"
            title="My Profile"
            className="text-[#666666] transition-colors hover:text-[#222222]"
          >
            <FaUserCircle size={20} />
          </Link>
        </nav>

        {/* Item 3: Copyright (Stays on the right on desktop) */}
        {/* Shortened the text slightly for better balance */}
        <p className="text-sm text-[#666666]">
          © {new Date().getFullYear()} MintMyMood
        </p>
      </div>
    </footer>
  );
}
