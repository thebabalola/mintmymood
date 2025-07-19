"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, usePublicClient } from "wagmi";
import { MintMyMoodABI } from "../../lib/MintMyMoodABI";
import { NFTMetadata } from "../../lib/types";
import {
  fetchUserMoods,
  generateReview,
  shouldTriggerReview,
  MoodReview,
} from "../../lib/reviewUtils";
import html2canvas from "html2canvas";

// Imports (no changes)
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UserBadges from "../../components/UserBadges";
import ShareButtons from "../../components/ShareButtons";
import {
  FaExclamationTriangle,
  FaIdCard,
  FaSpinner,
  FaTrophy,
  FaImages,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

// Reusable Components (no changes)
const ProfileSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/40">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-xl text-[#FF6B6B]">{icon}</div>
      <h2 className="text-xl font-bold text-[#222222]">{title}</h2>
    </div>
    {children}
  </section>
);
const UserNFTCard = ({ nft }: { nft: NFTMetadata }) => {
  const mood = nft.attributes?.find(
    (attr) => attr.trait_type === "Mood"
  )?.value;
  const timestamp = nft.attributes?.find(
    (attr) => attr.trait_type === "Timestamp"
  )?.value;
  const formatDate = (ts: string | undefined) => {
    if (!ts) return "";
    return new Date(Number(ts)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <div className="border border-gray-200/50 rounded-xl p-3 bg-white/50 shadow-sm flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-2 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-[#222222] truncate">
          {nft.name}
        </h3>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/80 text-xs">
          {mood && (
            <span className="font-semibold bg-[#FFD93D]/30 text-[#222222] px-2 py-0.5 rounded-full">
              {mood}
            </span>
          )}
          <span className="text-[#666666]">{formatDate(timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  // --- YOUR ORIGINAL STATE AND LOGIC (UNCHANGED) ---
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [weeklyReview, setWeeklyReview] = useState<MoodReview | null>(null);
  const [monthlyReview, setMonthlyReview] = useState<MoodReview | null>(null);
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [showReview, setShowReview] = useState(false);
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const [nftError, setNftError] = useState("");

  const { data: streak } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "streakCount",
    args: [address],
  });
  const { data: tokenIds } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "getTokensOwnedBy",
    args: [address],
  });

  useEffect(() => {
    /* Your data fetching logic remains here, unchanged */ async function fetchNfts() {
      if (!isConnected || !address || !tokenIds || !publicClient) {
        setLoadingNfts(false);
        setNftError("Connect your wallet to view your NFTs.");
        return;
      }
      setLoadingNfts(true);
      setNftError("");
      try {
        const fetchedNfts: NFTMetadata[] = [];
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
              if (uri.startsWith("data:application/json;base64,")) {
                metadata = JSON.parse(atob(uri.split(",")[1]));
                metadata.isBadge = true;
              } else {
                const httpUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
                const response = await fetch(httpUri);
                if (!response.ok) {
                  continue;
                }
                metadata = await response.json();
                metadata.isBadge =
                  metadata.attributes?.some(
                    (attr) =>
                      attr.trait_type === "Badge" ||
                      attr.trait_type === "Badge Type"
                  ) || false;
              }
              if (!metadata.name || !metadata.description) {
                continue;
              }
              if (metadata.image && metadata.image.startsWith("ipfs://")) {
                metadata.image = metadata.image.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                );
              }
              fetchedNfts.push(metadata);
            }
          } catch (tokenError) {
            console.error(`Error fetching token ${tokenId}:`, tokenError);
            continue;
          }
        }
        setNfts(fetchedNfts);
      } catch (err) {
        setNftError(
          `Failed to load NFTs: ${
            err instanceof Error ? err.message : "An unknown error"
          }`
        );
      } finally {
        setLoadingNfts(false);
      }
    }
    fetchNfts();
  }, [address, isConnected, tokenIds, publicClient]);
  useEffect(() => {
    /* Your review logic remains here, unchanged */ async function loadReviews() {
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

  const handleShareTwitter = async () => {
    /* Your logic here */
  };
  const handleShareFarcaster = async () => {
    /* Your logic here */
  };
  const handleDownload = async () => {
    /* Your logic here */
  };
  const activeReview = activeTab === "weekly" ? weeklyReview : monthlyReview;
  // --- END OF YOUR ORIGINAL LOGIC ---

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FC]">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {!isConnected && (
            <div className="text-center py-20 bg-white/50 rounded-2xl">
              <h2 className="text-2xl font-bold text-[#222222]">
                View Your Profile
              </h2>
              <p className="mt-2 text-[#666666]">
                Please connect your wallet to see your moods, badges, and
                reviews.
              </p>
            </div>
          )}

          {isConnected && address && (
            <div className="space-y-8">
              {/* --- SECTION 1: Profile Summary --- */}
              <ProfileSection title="Your Profile" icon={<FaIdCard />}>
                <p className="font-mono bg-gray-100 p-3 rounded-md text-center break-all">
                  {address}
                </p>
                <p className="text-center text-sm text-[#666666] mt-4">
                  This is your personal space to view minted moods, track
                  achievements, and see AI-powered reviews.
                </p>
              </ProfileSection>

              {/* --- SECTION 2: Achievements --- */}
              <ProfileSection title="Your Achievements" icon={<FaTrophy />}>
                <UserBadges />
              </ProfileSection>

              {/* --- SECTION 3: Minted Moods --- */}
              <ProfileSection title="Your Minted Moods" icon={<FaImages />}>
                {loadingNfts && (
                  <div className="text-center p-4 flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    <span>Loading your collection...</span>
                  </div>
                )}
                {nftError && (
                  <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
                    <FaExclamationTriangle className="inline mr-2" />
                    {nftError}
                  </div>
                )}
                {nfts.length === 0 && !loadingNfts && !nftError && (
                  <p className="text-center p-4 text-gray-500">
                    No moods minted yet. Go mint one!
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {nfts
                    .filter((nft) => !nft.isBadge)
                    .map((nft, index) => (
                      <UserNFTCard key={index} nft={nft} />
                    ))}
                </div>
              </ProfileSection>

              {/* --- THE FIX: SECTION 4 (MOVED) - AI Mood Review --- */}
              <ProfileSection
                title="Your AI Mood Review"
                icon={<HiOutlineSparkles />}
              >
                {showReview && activeReview ? (
                  // If a review is available, show the full card
                  <div>
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-200 p-1 rounded-full flex items-center">
                        <button
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                            activeTab === "weekly"
                              ? "bg-white shadow"
                              : "bg-transparent"
                          }`}
                          onClick={() => setActiveTab("weekly")}
                        >
                          Weekly
                        </button>
                        <button
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                            activeTab === "monthly"
                              ? "bg-white shadow"
                              : "bg-transparent"
                          }`}
                          onClick={() => setActiveTab("monthly")}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>
                    <div
                      id="review-card"
                      className="p-6 bg-gradient-to-br from-[#FF6B6B]/80 via-[#FFD93D]/80 to-[#6BCB77]/80 rounded-xl text-white shadow-lg"
                    >
                      <h3 className="text-lg font-bold">
                        Your {activeTab} Mood Analysis
                      </h3>
                      <p className="mt-2">{activeReview.reviewText}</p>
                      <div className="mt-4 text-xs space-y-1 bg-black/10 p-3 rounded-md">
                        <p>
                          <strong>Mood Counts:</strong>{" "}
                          {Object.entries(activeReview.moodCounts)
                            .map(([mood, count]) => `${mood}: ${count}`)
                            .join(", ")}
                        </p>
                        <p>
                          <strong>Dominant Mood:</strong>{" "}
                          {activeReview.dominantMood}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <ShareButtons
                        moodType={activeReview.dominantMood}
                        title={`My ${activeTab} Mood Review`}
                        caption={activeReview.reviewText}
                        emoji="📊"
                        imageUrl=""
                      />
                    </div>
                    <button
                      className="text-sm text-gray-500 hover:text-gray-800 mx-auto block mt-2"
                      onClick={() => setShowReview(false)}
                    >
                      Dismiss Review
                    </button>
                  </div>
                ) : (
                  // THE FIX: If no review, show a placeholder
                  <div className="text-center p-6 bg-gray-100/70 rounded-lg">
                    <h3 className="font-semibold text-gray-800">
                      Your Mood Analysis Awaits!
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Keep minting your moods daily. Your personalized weekly
                      and monthly summaries will appear here once enough data is
                      collected.
                    </p>
                  </div>
                )}
              </ProfileSection>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
