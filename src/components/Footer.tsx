import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

// Reusing the logo concept from the Header for consistency
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    {/* TODO: Replace this div with your actual <Image> or <svg> logo */}
    <div className="w-8 h-8 rounded-lg bg-[#FF6B6B] flex items-center justify-center font-bold text-white text-xl">
      M
    </div>
    <span className="font-bold text-[#222222]">MintMyMood</span>
  </Link>
);

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200/80 bg-[#F7F8FC]">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-6">
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center gap-2 text-center sm:items-start">
          <Logo />
          <p className="text-sm text-[#666666]">
            © {new Date().getFullYear()} MintMyMood. All rights reserved.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/your-profile" // TODO: Add your Twitter link
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter"
            className="text-[#666666] transition-colors hover:text-[#222222]"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://github.com/your-repo" // TODO: Add your GitHub repo link
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="text-[#666666] transition-colors hover:text-[#222222]"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
