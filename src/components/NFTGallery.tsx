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

// A dedicated, beautifully styled card for each NFT
const NFTCard = ({ nft }: { nft: NFTMetadata }) => {
  // THE UPDATE: State to handle the flip
  const [isFlipped, setIsFlipped] = useState(false);

  const ipfsUrl = nft.image
    ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : "";
  const formatDate = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const mood = nft.attributes.find((attr) => attr.trait_type === "Mood")?.value;
  const timestamp = nft.attributes.find(
    (attr) => attr.trait_type === "Timestamp"
  )?.value;

  return (
    // THE UPDATE: Container to create 3D perspective. Click handler toggles the flip state.
    <div
      className="group cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        style={{ minHeight: "300px" }} // Set a min-height to ensure the card has dimensions to flip correctly
      >
        {/* --- FRONT OF THE CARD --- */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-md h-full flex flex-col group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
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
            <div className="mt-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-[#222222] truncate">
                {nft.name}
              </h3>
              <p className="text-sm text-[#666666] h-10 overflow-hidden line-clamp-2">
                {nft.description}
              </p>
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
                {mood && (
                  <span className="text-xs font-semibold bg-[#FFD93D]/30 text-[#222222] px-2 py-1 rounded-full">
                    {mood}
                  </span>
                )}
                {timestamp && (
                  <span className="text-xs text-[#666666]">
                    {formatDate(timestamp)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- BACK OF THE CARD --- */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-[#222222] mb-2">
              {nft.name}
            </h3>
            <div className="text-sm text-[#666666] flex-grow overflow-y-auto pr-2">
              <p className="font-semibold mb-1 text-gray-700">Caption:</p>
              <p>{nft.description}</p>
            </div>
            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
              {mood && (
                <span className="text-xs font-semibold bg-[#FFD93D]/30 text-[#222222] px-2 py-1 rounded-full">
                  {mood}
                </span>
              )}
              {timestamp && (
                <span className="text-xs text-[#666666]">
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

// SkeletonCard component remains unchanged
const SkeletonCard = () => (
  <div className="bg-gray-200/50 rounded-2xl p-4 animate-pulse">
    <div className="aspect-square w-full rounded-xl bg-gray-300/60"></div>
    <div className="mt-4 space-y-3">
      <div className="h-4 w-3/4 rounded bg-gray-300/60"></div>
      <div className="h-3 w-full rounded bg-gray-300/60"></div>
      <div className="h-3 w-1/2 rounded bg-gray-300/60"></div>
    </div>
  </div>
);

// Main NFTGallery component remains unchanged
export default function NFTGallery() {
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

  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#222222] mb-6 flex items-center gap-3">
          <FaImage /> My Mood Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg text-center">
          <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
          <h3 className="font-bold">Oops! Something went wrong.</h3>
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (nfts.length === 0) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="text-center bg-gray-100/80 p-12 rounded-2xl">
          <FaSadTear className="text-5xl mx-auto mb-4 text-[#666666]" />
          <h3 className="text-xl font-bold text-[#222222]">
            Your Gallery is Empty
          </h3>
          <p className="text-[#666666] mt-1">
            Looks like you haven't minted any moods yet. Go ahead and mint your
            first one!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#222222] mb-6 flex items-center gap-3">
        <FaImage /> My Mood Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ))}
      </div>
    </section>
  );
}
