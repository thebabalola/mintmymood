"use client";

import { useState, useEffect } from "react";
import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

// --- YOUR ORIGINAL INTERFACES (UNCHANGED) ---
interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: boolean;
  isEligible: boolean;
  progress?: { current: number; required: number; percentage: number };
}
interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

// --- PURELY-UI HELPER COMPONENTS (UNCHANGED) ---
// Note: These components are already mobile-friendly due to their simple structure.
const SkeletonBadgeCard = () => (
  <div className="bg-gray-200/50 rounded-2xl p-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-300/60"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-300/60"></div>
        <div className="h-3 w-1/2 rounded bg-gray-300/60"></div>
      </div>
    </div>
    <div className="mt-3 h-3 w-full rounded bg-gray-300/60"></div>
    <div className="mt-4 h-8 w-full rounded-lg bg-gray-300/60"></div>
  </div>
);
const BadgeCard = ({
  badge,
  onClaim,
  isMinting,
}: {
  badge: Badge;
  onClaim: (id: string) => void;
  isMinting: boolean;
}) => {
  const ipfsImage = badge.image.startsWith("ipfs://")
    ? badge.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : badge.image;
  return (
    <div
      className={`relative bg-white/40 backdrop-blur-lg rounded-2xl p-4 border transition-all duration-300 flex flex-col ${
        badge.earned ? "border-green-300/50 shadow-lg" : "border-gray-300/30"
      }`}
    >
      {badge.earned && (
        <FaCheckCircle
          className="absolute top-3 right-3 text-2xl text-green-500"
          title="Earned!"
        />
      )}
      <div
        className={`flex items-center gap-4 transition-opacity duration-300 ${
          !badge.earned ? "opacity-60 grayscale" : ""
        }`}
      >
        <img
          src={ipfsImage}
          alt={badge.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-md"
        />
        <div>
          <h4 className="font-bold text-[#222222]">{badge.name}</h4>
        </div>
      </div>
      <p className="text-sm text-[#666666] mt-3 flex-grow">
        {badge.description}
      </p>
      <div className="mt-4">
        {!badge.earned && badge.progress && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-[#666666] mb-1">
              <span>Progress</span>
              <span className="font-semibold">
                {badge.progress.current} / {badge.progress.required}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${badge.progress.percentage}%` }}
              ></div>
            </div>
          </div>
        )}
        {!badge.earned && badge.isEligible && (
          <button
            onClick={() => onClaim(badge.id)}
            disabled={isMinting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isMinting ? (
              <>
                <FaSpinner className="animate-spin" /> Claiming...
              </>
            ) : (
              "Claim Badge"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default function UserBadges() {
  // --- YOUR ENTIRE LOGIC BLOCK - COMPLETELY UNCHANGED ---
  const { address } = useAccount();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const {
    writeContract: mintFirstBadge,
    data: firstMintHash,
    isPending: isFirstMinting,
  } = useWriteContract();
  const { isSuccess: isFirstMinted } = useWaitForTransactionReceipt({
    hash: firstMintHash,
  });
  const {
    writeContract: mintStreakBadge,
    data: streakHash,
    isPending: isStreakMinting,
  } = useWriteContract();
  const { isSuccess: isStreakMinted } = useWaitForTransactionReceipt({
    hash: streakHash,
  });
  const {
    writeContract: mintMoodMaestroBadge,
    data: maestroHash,
    isPending: isMaestroMinting,
  } = useWriteContract();
  const { isSuccess: isMaestroMinted } = useWaitForTransactionReceipt({
    hash: maestroHash,
  });
  const handleClaimBadge = async (badgeId: string) => {
    if (!address) {
      return;
    }
    const mintConfig = { abi: MintMyMoodABI, address: contractAddress };
    try {
      switch (badgeId) {
        case "first-mint":
          mintFirstBadge({ ...mintConfig, functionName: "mintFirstMintBadge" });
          break;
        case "streak":
          mintStreakBadge({ ...mintConfig, functionName: "mintStreakBadge" });
          break;
        case "mood-maestro":
          mintMoodMaestroBadge({
            ...mintConfig,
            functionName: "mintMoodMaestroBadge",
          });
          break;
        default:
          console.error("Unknown badge ID:", badgeId);
      }
    } catch (error) {
      console.error("Error claiming badge:", error);
    }
  };
  const { data: hasFirstMintBadge, refetch: refetchFirstMint } =
    useReadContract({
      address: contractAddress,
      abi: MintMyMoodABI,
      functionName: "hasFirstMintBadge",
      args: address ? [address] : undefined,
      query: { enabled: Boolean(address), refetchOnWindowFocus: false },
    });
  const { data: hasStreakBadge, refetch: refetchStreak } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "hasStreakBadge",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address), refetchOnWindowFocus: false },
  });
  const { data: hasMoodMaestroBadge, refetch: refetchMaestro } =
    useReadContract({
      address: contractAddress,
      abi: MintMyMoodABI,
      functionName: "hasMoodMaestroBadge",
      args: address ? [address] : undefined,
      query: { enabled: Boolean(address), refetchOnWindowFocus: false },
    });
  const { data: userMintCount } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "getMintCount",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address), refetchOnWindowFocus: false },
  });
  const { data: streakCount } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakCount",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address), refetchOnWindowFocus: false },
  });
  const { data: streakMilestone } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakMilestone",
    query: { refetchOnWindowFocus: false },
  });
  const { data: moodMaestroMilestone } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "getMoodMaestroMilestone",
    query: { refetchOnWindowFocus: false },
  });
  const { data: firstMintBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "firstMintBadgeURI",
    query: { refetchOnWindowFocus: false },
  });
  const { data: streakBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakBadgeURI",
    query: { refetchOnWindowFocus: false },
  });
  const { data: moodMaestroBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "moodMaestroBadgeURI",
    query: { refetchOnWindowFocus: false },
  });
  useEffect(() => {
    if (isFirstMinted) refetchFirstMint();
  }, [isFirstMinted, refetchFirstMint]);
  useEffect(() => {
    if (isStreakMinted) refetchStreak();
  }, [isStreakMinted, refetchStreak]);
  useEffect(() => {
    if (isMaestroMinted) refetchMaestro();
  }, [isMaestroMinted, refetchMaestro]);
  const fetchBadgeMetadata = async (
    uri: string
  ): Promise<BadgeMetadata | null> => {
    if (!uri || uri.trim() === "") return null;
    try {
      const response = await fetch(uri);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error(`Error fetching metadata from ${uri}:`, e);
      return null;
    }
  };
  useEffect(() => {
    const loadBadges = async () => {
      if (!address) {
        setBadges([]);
        setLoading(false);
        return;
      }
      setError("");
      try {
        const [firstMintMetadata, streakMetadata, maestroMetadata] =
          await Promise.all([
            fetchBadgeMetadata(firstMintBadgeURI as string),
            fetchBadgeMetadata(streakBadgeURI as string),
            fetchBadgeMetadata(moodMaestroBadgeURI as string),
          ]);
        const badgeList: Badge[] = [];
        const firstMintRequired = 1;
        const streakRequired = Number(streakMilestone || 7);
        const maestroRequired = Number(moodMaestroMilestone || 50);
        const currentMints = Number(userMintCount || 0);
        const currentStreak = Number(streakCount || 0);
        badgeList.push({
          id: "first-mint",
          name: firstMintMetadata?.name || "First Mint",
          description:
            firstMintMetadata?.description ||
            "Awarded for your first mood mint!",
          image: firstMintMetadata?.image || "/placeholder-badge.svg",
          earned: Boolean(hasFirstMintBadge),
          isEligible: currentMints >= firstMintRequired,
          progress: !hasFirstMintBadge
            ? {
                current: currentMints,
                required: firstMintRequired,
                percentage: Math.min(
                  100,
                  (currentMints / firstMintRequired) * 100
                ),
              }
            : undefined,
        });
        badgeList.push({
          id: "streak",
          name: streakMetadata?.name || `${streakRequired}-Day Streaker`,
          description:
            streakMetadata?.description ||
            `Awarded for maintaining a ${streakRequired}-day streak!`,
          image: streakMetadata?.image || "/placeholder-badge.svg",
          earned: Boolean(hasStreakBadge),
          isEligible: currentStreak >= streakRequired,
          progress: !hasStreakBadge
            ? {
                current: currentStreak,
                required: streakRequired,
                percentage: Math.min(
                  100,
                  (currentStreak / streakRequired) * 100
                ),
              }
            : undefined,
        });
        badgeList.push({
          id: "mood-maestro",
          name: maestroMetadata?.name || "Mood Maestro",
          description:
            maestroMetadata?.description ||
            `Awarded for minting ${maestroRequired} moods!`,
          image: maestroMetadata?.image || "/placeholder-badge.svg",
          earned: Boolean(hasMoodMaestroBadge),
          isEligible: currentMints >= maestroRequired,
          progress: !hasMoodMaestroBadge
            ? {
                current: currentMints,
                required: maestroRequired,
                percentage: Math.min(
                  100,
                  (currentMints / maestroRequired) * 100
                ),
              }
            : undefined,
        });
        setBadges(badgeList);
      } catch (err) {
        setError(
          `Failed to load badges: ${
            err instanceof Error ? err.message : "An unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    loadBadges();
  }, [
    address,
    hasFirstMintBadge,
    hasStreakBadge,
    hasMoodMaestroBadge,
    userMintCount,
    streakCount,
    streakMilestone,
    moodMaestroMilestone,
    firstMintBadgeURI,
    streakBadgeURI,
    moodMaestroBadgeURI,
    isFirstMinted,
    isStreakMinted,
    isMaestroMinted,
  ]);
  // --- END OF YOUR LOGIC BLOCK ---

  if (!address) {
    return (
      <p className="text-sm text-center text-gray-500 py-4">
        Please connect your wallet to view your badges.
      </p>
    );
  }
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBadgeCard key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
    );
  }

  const earnedBadges = badges.filter((b) => b.earned);
  const pendingBadges = badges.filter((b) => !b.earned);

  return (
    // THE FIX: Reduced vertical spacing on mobile
    <div className="space-y-8 sm:space-y-10">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/40">
        <h3 className="text-base sm:text-lg font-semibold text-[#222222] mb-3">
          📊 Your Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">
              {Number(userMintCount || 0)}
            </p>
            <p className="text-xs text-[#666666]">Total Mints</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">
              {Number(streakCount || 0)}
            </p>
            <p className="text-xs text-[#666666]">Current Streak</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">
              {earnedBadges.length}
            </p>
            <p className="text-xs text-[#666666]">Badges Earned</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">
              {pendingBadges.length}
            </p>
            <p className="text-xs text-[#666666]">Badges Pending</p>
          </div>
        </div>
      </div>

      <div>
        {/* THE FIX: Responsive font size for the section title */}
        <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-4">
          🏆 Unlocked Achievements
        </h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onClaim={handleClaimBadge}
                isMinting={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic p-4 bg-gray-100/50 rounded-lg">
            No badges earned yet. Keep minting!
          </p>
        )}
      </div>

      <div>
        {/* THE FIX: Responsive font size for the section title */}
        <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-4">
          🎯 Your Next Challenges
        </h3>
        {pendingBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingBadges.map((badge) => {
              const isMinting =
                (badge.id === "first-mint" && isFirstMinting) ||
                (badge.id === "streak" && isStreakMinting) ||
                (badge.id === "mood-maestro" && isMaestroMinting);
              return (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  onClaim={handleClaimBadge}
                  isMinting={isMinting}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic p-4 bg-green-100/50 rounded-lg">
            Congratulations! You've earned all available badges!
          </p>
        )}
      </div>
    </div>
  );
}
