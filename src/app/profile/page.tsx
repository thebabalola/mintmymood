"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, usePublicClient } from "wagmi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ConnectButton from "../../components/ConnectButton";
import StreakProgress from "../../components/StreakProgress";

import UserBadges from "../../components/UserBadges";
import Link from "next/link";
import { MintMyMoodABI } from "../../lib/MintMyMoodABI";
import { NFTMetadata } from "../../lib/types";
import {
  fetchUserMoods,
  generateReview,
  shouldTriggerReview,
  MoodReview,
} from "../../lib/reviewUtils";
import html2canvas from "html2canvas";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [weeklyReview, setWeeklyReview] = useState<MoodReview | null>(null);
  const [monthlyReview, setMonthlyReview] = useState<MoodReview | null>(null);
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [showReview, setShowReview] = useState(false);
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const [nftError, setNftError] = useState("");

  // Fetch streak
  const { data: streak } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "streakCount",
    args: [address],
  });

  // Fetch user-owned NFTs
  const { data: tokenIds } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "getTokensOwnedBy",
    args: [address],
  });

  // Fetch user NFTs
  useEffect(() => {
    async function fetchNfts() {
      if (!isConnected || !address || !tokenIds || !publicClient) {
        setLoadingNfts(false);
        setNftError("Connect your wallet to view your NFTs.");
        return;
      }

      setLoadingNfts(true);
      setNftError("");

      try {
        const fetchedNfts: NFTMetadata[] = [];

        // Use publicClient to fetch tokenURI for each token owned by the user
        for (const tokenId of tokenIds as bigint[]) {
          try {
            const uri = await publicClient.readContract({
              address: process.env
                .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
              abi: MintMyMoodABI,
              functionName: "tokenURI",
              args: [tokenId],
            });

            if (uri && typeof uri === "string") {
              let metadata: NFTMetadata;

              console.log(
                `Fetching metadata for token ${tokenId} from URI: ${uri}`
              );

              if (uri.startsWith("data:application/json;base64,")) {
                // Handle base64 data URI (for badges)
                const base64Data = uri.split(",")[1];
                const jsonString = atob(base64Data);
                metadata = JSON.parse(jsonString);
                metadata.isBadge = true;
                console.log(`Badge metadata for token ${tokenId}:`, metadata);
              } else {
                // Handle IPFS URI (for regular moods)
                const httpUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
                const response = await fetch(httpUri);

                if (!response.ok) {
                  console.error(
                    `Failed to fetch metadata for token ${tokenId}: ${response.status}`
                  );
                  continue;
                }

                metadata = await response.json();
                metadata.isBadge =
                  metadata.attributes?.some(
                    (attr) =>
                      attr.trait_type === "Badge" ||
                      attr.trait_type === "Badge Type"
                  ) || false;
                console.log(`IPFS metadata for token ${tokenId}:`, metadata);
              }

              // Normalize metadata
              if (!metadata.name || !metadata.description) {
                console.warn(
                  `Invalid metadata for token ${tokenId}:`,
                  metadata
                );
                continue;
              }

              // Handle image URLs
              if (metadata.image) {
                if (metadata.image.startsWith("ipfs://")) {
                  metadata.image = metadata.image.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  );
                }
              } else {
                metadata.image =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CYWRnZTwvdGV4dD48L3N2Zz4=";
              }

              fetchedNfts.push(metadata);
            }
          } catch (tokenError) {
            console.error(`Error fetching token ${tokenId}:`, tokenError);
            continue;
          }
        }

        console.log(
          `Successfully fetched ${fetchedNfts.length} NFTs for user ${address}`
        );
        setNfts(fetchedNfts);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setNftError(`Failed to load NFTs: ${errorMessage}`);
        console.error("NFT fetch error:", err);
      } finally {
        setLoadingNfts(false);
      }
    }

    fetchNfts();
  }, [address, isConnected, tokenIds, publicClient]);

  // Check and generate reviews
  useEffect(() => {
    async function loadReviews() {
      if (!address) return;

      const lastWeeklyReview = Number(
        localStorage.getItem(`lastWeeklyReview_${address}`)
      );
      const lastMonthlyReview = Number(
        localStorage.getItem(`lastMonthlyReview_${address}`)
      );

      if (shouldTriggerReview(lastWeeklyReview, "weekly")) {
        const moods = await fetchUserMoods(address, "weekly");
        const review = await generateReview(moods, "weekly");
        setWeeklyReview(review);
        localStorage.setItem(
          `lastWeeklyReview_${address}`,
          Date.now().toString()
        );
        setShowReview(true);
      }

      if (shouldTriggerReview(lastMonthlyReview, "monthly")) {
        const moods = await fetchUserMoods(address, "monthly");
        const review = await generateReview(moods, "monthly");
        setMonthlyReview(review);
        localStorage.setItem(
          `lastMonthlyReview_${address}`,
          Date.now().toString()
        );
        setShowReview(true);
      }
    }

    loadReviews();
  }, [address]);

  // Handle share to Twitter/X
  const handleShareTwitter = async () => {
    const canvas = await html2canvas(document.getElementById("review-card")!);
    const image = canvas.toDataURL("image/png");
    const text = encodeURIComponent(
      `${
        activeTab === "weekly"
          ? weeklyReview?.reviewText
          : monthlyReview?.reviewText
      } Check my ${activeTab} mood on MintMyMood!`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        image
      )}`,
      "_blank"
    );
  };

  // Handle share to Farcaster
  const handleShareFarcaster = async () => {
    const canvas = await html2canvas(document.getElementById("review-card")!);
    const image = canvas.toDataURL("image/png");
    const text = encodeURIComponent(
      `${
        activeTab === "weekly"
          ? weeklyReview?.reviewText
          : monthlyReview?.reviewText
      } Check my ${activeTab} mood on MintMyMood!`
    );
    // Replace with actual Farcaster API or URL
    window.open(
      `https://warpcast.com/~/compose?text=${text}&url=${encodeURIComponent(
        image
      )}`,
      "_blank"
    );
  };

  // Handle download card
  const handleDownload = async () => {
    const canvas = await html2canvas(document.getElementById("review-card")!);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${activeTab}-mood-review.png`;
    link.click();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-6 space-y-6 flex-grow">
        <nav className="w-full max-w-md">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </nav>
        <h1 className="text-3xl font-bold text-purple-600">Profile Page</h1>
        {!isConnected && (
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Connect your wallet to view your profile
            </p>
            <ConnectButton />
          </div>
        )}
        {isConnected && address && (
          <div className="w-full max-w-4xl space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
              <p>Address: {`${address.slice(0, 6)}...${address.slice(-4)}`}</p>
              <StreakProgress streak={Number(streak) || 0} />
            </div>
            {showReview && (weeklyReview || monthlyReview) && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Mood Review</h2>
                <div className="flex mb-4">
                  <button
                    className={`px-4 py-2 ${
                      activeTab === "weekly"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                    } rounded-l`}
                    onClick={() => setActiveTab("weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      activeTab === "monthly"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                    } rounded-r`}
                    onClick={() => setActiveTab("monthly")}
                  >
                    Monthly
                  </button>
                </div>
                <div id="review-card" className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-bold">
                    Your {activeTab === "weekly" ? "Weekly" : "Monthly"} Mood
                  </h3>
                  <p>
                    {activeTab === "weekly"
                      ? weeklyReview?.reviewText
                      : monthlyReview?.reviewText}
                  </p>
                  <p>
                    Mood Counts:{" "}
                    {Object.entries(
                      activeTab === "weekly"
                        ? weeklyReview?.moodCounts || {}
                        : monthlyReview?.moodCounts || {}
                    )
                      .map(([mood, count]) => `${mood}: ${count}`)
                      .join(", ")}
                  </p>
                  <p>Streak: {Number(streak) || 0} 🔥</p>
                  <p>
                    Dominant Mood:{" "}
                    {activeTab === "weekly"
                      ? weeklyReview?.dominantMood
                      : monthlyReview?.dominantMood}
                  </p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleShareTwitter}
                  >
                    Share to Twitter/X
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                    onClick={handleShareFarcaster}
                  >
                    Share to Farcaster
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={handleDownload}
                  >
                    Download Card
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded"
                    onClick={() => setShowReview(false)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Your Minted NFTs</h2>
              {loadingNfts && (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-blue-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p>Loading your NFTs...</p>
                </div>
              )}
              {nftError && <p className="text-red-600">{nftError}</p>}
              {nfts.length === 0 && !loadingNfts && !nftError && (
                <p>No NFTs minted yet. Mint a mood to get started!</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {nfts.map((nft, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded shadow relative"
                  >
                    {nft.isBadge && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                        Badge
                      </span>
                    )}
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        console.error(`Failed to load image: ${nft.image}`);
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
                      }}
                    />
                    <h3 className="text-lg font-bold mt-2">{nft.name}</h3>
                    <p>{nft.description}</p>
                    {nft.attributes &&
                      nft.attributes.map((attr, idx) => (
                        <p key={idx}>
                          {attr.trait_type}:{" "}
                          {attr.trait_type === "Timestamp"
                            ? new Date(
                                Number(attr.value) * 1000
                              ).toLocaleString()
                            : attr.value}
                        </p>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
