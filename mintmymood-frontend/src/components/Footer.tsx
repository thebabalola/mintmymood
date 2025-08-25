import Link from "next/link";
import Image from "next/image";

// Logo component with actual logo image
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <img 
      src="/mym-logo.png" 
      alt="MintMyMood Logo" 
      className="h-8 w-8 object-contain flex-shrink-0"
    />
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
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-3 sm:flex-row sm:justify-between md:px-6">
        {/* Item 1: Logo (Stays on the left on desktop) */}
        <Logo />



        {/* Item 3: Feedback and Social Links */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-[#666666]">
            Have feedback? Let us know!
          </p>
          <Link
            href="https://farcaster.xyz/therebirth"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Farcaster"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/farcaster.svg"
              alt="Farcaster"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </Link>
          <Link
            href="https://x.com/_therebirth"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on X (Twitter)"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/twitter-x.svg"
              alt="X (Twitter)"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </Link>
        </div>

        {/* Item 4: Copyright (Stays on the right on desktop) */}
        <p className="text-sm text-[#666666]">
          © {new Date().getFullYear()} MintMyMood
        </p>
      </div>
    </footer>
  );
}
