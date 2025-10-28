"use client";

import { useState, useEffect } from "react";
import { useReadContract, usePublicClient } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";
import { FaImage, FaExclamationTriangle, FaSadTear } from "react-icons/fa";

// Interface remains unchanged
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

// NFTCard component with enhanced mobile responsive updates matching UserNFTCard
const NFTCard = ({ nft }: { nft: NFTMetadata }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const ipfsUrl = nft.image
    ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : "";
  const formatDate = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const mood = nft.attributes.find((attr) => attr.trait_type === "Mood")?.value;
  const timestamp = nft.attributes.find(
    (attr) => attr.trait_type === "Timestamp"
  )?.value;

  return (
    <div
      className="group cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Enhanced responsive min-height matching UserNFTCard */}
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] min-h-[260px] sm:min-h-[340px] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* --- FRONT OF THE CARD --- */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          {/* Updated card styling to match UserNFTCard mobile layout */}
          <div className="border border-gray-200/50 rounded-xl p-3 bg-white/50 shadow-sm flex flex-col h-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 min-w-[140px] sm:min-w-[211px]">
            {/* Image container matching UserNFTCard aspect ratio */}
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
              <img
                src={ipfsUrl}
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml;base64,${btoa(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" fill="#9ca3af" font-family="sans-serif" font-size="14" text-anchor="middle" dy=".3em">Image Error</text></svg>'
                  )}`;
                }}
              />
            </div>
            {/* Content area matching UserNFTCard layout */}
            <div className="mt-2 flex flex-col flex-grow">
              {/* Description matching UserNFTCard styling */}
              <p className="text-sm text-[#666666] h-10 sm:h-auto sm:min-h-[40px] overflow-hidden line-clamp-2 sm:line-clamp-none">
                {nft.description}
              </p>
              {/* Footer area pushed to bottom of card */}
              <div className="mt-auto pt-3 border-t border-gray-200/80 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                  {mood && (
                    <span className="font-semibold bg-[#FFD93D]/30 text-[#222222] px-2 py-0.5 rounded-full mb-1 sm:mb-0 inline-block w-fit max-w-full truncate">
                      {mood}
                    </span>
                  )}
                  <div className="text-[#666666] truncate">
                    {timestamp && formatDate(timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BACK OF THE CARD --- */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/40 shadow-xl h-full flex flex-col">
            {/* Responsive title size on back of card */}
            <h3 className="text-lg sm:text-xl font-bold text-[#222222] mb-2">
              {nft.name}
            </h3>
            <div className="text-xs sm:text-sm text-[#666666] flex-grow overflow-y-auto pr-2">
              <p className="font-semibold mb-1 text-gray-700">Caption:</p>
              <p className="leading-relaxed">{nft.description}</p>
            </div>
            {/* Consistent responsive footer on back */}
            <div className="flex justify-between items-center mt-auto pt-2 sm:pt-3 border-t border-gray-200">
              {mood && (
                <span className="text-xs font-semibold bg-[#FFD93D]/30 text-[#222222] px-2 py-0.5 sm:py-1 rounded-full truncate max-w-[60%]">
                  {mood}
                </span>
              )}
              {timestamp && (
                <span className="text-xs text-[#666666] truncate">
                  {formatDate(timestamp)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SkeletonCard component with enhanced mobile responsive updates
const SkeletonCard = () => (
  <div className="border border-gray-200/50 rounded-xl p-3 bg-white/50 shadow-sm animate-pulse min-h-[260px] sm:min-h-[340px] min-w-[140px] sm:min-w-[211px]">
    {/* Skeleton matches the enhanced responsive aspect ratio */}
    <div className="aspect-square w-full rounded-lg bg-gray-300/60"></div>
    <div className="mt-2 space-y-2">
      <div className="h-3 w-3/4 rounded bg-gray-300/60"></div>
      <div className="h-2 w-full rounded bg-gray-300/60"></div>
      <div className="h-2 w-1/2 rounded bg-gray-300/60"></div>
    </div>
  </div>
);

// Main NFTGallery component with enhanced mobile responsive updates
export default function NFTGallery() {
  // --- YOUR ORIGINAL LOGIC, STATE, AND HOOKS (UNCHANGED) ---
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const publicClient = usePublicClient();
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const BADGE_URIS = [
    "https://chocolate-electrical-wasp-990.mypinata.cloud/ipfs/bafybeifjwou3dmsxoli3ggm6vg55ex44zae367x6am6ncvmkcz2c6pogki/0-First-Mint-Badge.json",
    "https://chocolate-electrical-wasp-990.mypinata.cloud/ipfs/bafybeifjwou3dmsxoli3ggm6vg55ex44zae367x6am6ncvmkcz2c6pogki/1-Mood-Maestro-Badge.json",
    "https://chocolate-electrical-wasp-990.mypinata.cloud/ipfs/bafybeifjwou3dmsxoli3ggm6vg55ex44zae367x6am6ncvmkcz2c6pogki/2-The-Streaker-Achievement-Badge.json",
  ];
  const { data: mintCount, isLoading: mintCountLoading } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "totalSupply",
  });
  useEffect(() => {
    async function fetchNFTs() {
      if (!mintCount || !publicClient || mintCountLoading) return;
      setLoading(true);
      setError("");
      try {
        const tokenIds = Array.from(
          { length: Number(mintCount) },
          (_, i) => i + 1
        );
        const fetchedNfts: NFTMetadata[] = [];
        for (const tokenId of tokenIds) {
          try {
            const uri = await publicClient.readContract({
              address: contractAddress,
              abi: MintMyMoodABI,
              functionName: "tokenURI",
              args: [BigInt(tokenId)],
            });
            if (uri && typeof uri === "string") {
              if (
                BADGE_URIS.includes(uri) ||
                uri.startsWith("data:application/json;base64,")
              ) {
                continue;
              }
              const httpUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
              const response = await fetch(httpUri);
              if (!response.ok) {
                console.error(
                  `Failed to fetch metadata for token ${tokenId}: ${response.status}`
                );
                continue;
              }
              const metadata = await response.json();
              fetchedNfts.push(metadata);
            }
          } catch (tokenError) {
            console.error(`Error fetching token ${tokenId}:`, tokenError);
            continue;
          }
        }
        setNfts(fetchedNfts.reverse());
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to load NFTs: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
    fetchNFTs();
  }, [mintCount, publicClient, mintCountLoading, contractAddress]);
  // --- END OF YOUR LOGIC ---

  // Loading state with enhanced responsive SkeletonCard grid matching profile page
  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Enhanced responsive title and better mobile spacing */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <FaImage className="text-lg sm:text-xl" /> 
          <span>Mood Gallery</span>
        </h2>
        {/* Truly dynamic grid using auto-fit with responsive min-width */}
        <div className="grid gap-4 auto-rows-fr nft-gallery-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  // Error state with enhanced mobile responsiveness
  if (error) {
    return (
      <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 sm:p-6 rounded-lg text-center">
          <FaExclamationTriangle className="text-2xl sm:text-3xl mx-auto mb-2" />
          <h3 className="font-bold text-base sm:text-lg">Oops! Something went wrong.</h3>
          <p className="text-xs sm:text-sm mt-1">{error}</p>
        </div>
      </section>
    );
  }

  // Empty state with enhanced mobile responsiveness
  if (nfts.length === 0) {
    return (
      <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center bg-gray-100/80 p-8 sm:p-12 rounded-2xl">
          <FaSadTear className="text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 text-[#666666]" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222222]">
            Your Gallery is Empty
          </h3>
          <p className="text-sm sm:text-base text-[#666666] mt-1">
            Looks like you haven't minted any moods yet. Go ahead and mint your
            first one!
          </p>
        </div>
      </section>
    );
  }

  // Main gallery display with enhanced mobile responsiveness matching profile page
  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Enhanced responsive title with better mobile sizing */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <FaImage className="text-lg sm:text-xl" /> 
        <span>Mood Gallery</span>
      </h2>
      {/* Truly dynamic grid using auto-fit with responsive min-width */}
      <div className="grid gap-4 auto-rows-fr nft-gallery-grid">
        {nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ))}
      </div>
    </section>
  );
}