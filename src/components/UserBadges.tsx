"use client";

import { useState, useEffect } from "react";
import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: boolean;
  isEligible: boolean;
  progress?: {
    current: number;
    required: number;
    percentage: number;
  };
}

interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export default function UserBadges() {
  const { address } = useAccount();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  // Write hooks for each badge mint function
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

  // Helper function to call the correct mint function based on badge ID
  const handleClaimBadge = async (badgeId: string) => {
    if (!address) {
      console.error("No wallet connected");
      return;
    }

    const mintConfig = {
      abi: MintMyMoodABI,
      address: contractAddress,
    };

    try {
      switch (badgeId) {
        case "first-mint":
          console.log("Minting first badge...");
          await mintFirstBadge({
            ...mintConfig,
            functionName: "mintFirstMintBadge",
          });
          break;
        case "streak":
          console.log("Minting streak badge...");
          await mintStreakBadge({
            ...mintConfig,
            functionName: "mintStreakBadge",
          });
          break;
        case "mood-maestro":
          console.log("Minting mood maestro badge...");
          await mintMoodMaestroBadge({
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

  // Fixed read hooks with proper refetch capability
  const { data: hasFirstMintBadge, refetch: refetchFirstMint } =
    useReadContract({
      address: contractAddress,
      abi: MintMyMoodABI,
      functionName: "hasFirstMintBadge",
      args: address ? [address] : undefined,
      query: {
        enabled: Boolean(address),
        refetchOnWindowFocus: false,
      },
    });

  const { data: hasStreakBadge, refetch: refetchStreak } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "hasStreakBadge",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  const { data: hasMoodMaestroBadge, refetch: refetchMaestro } =
    useReadContract({
      address: contractAddress,
      abi: MintMyMoodABI,
      functionName: "hasMoodMaestroBadge",
      args: address ? [address] : undefined,
      query: {
        enabled: Boolean(address),
        refetchOnWindowFocus: false,
      },
    });

  const { data: userMintCount } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "getMintCount",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  const { data: streakCount } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakCount",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  const { data: streakMilestone } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakMilestone",
    query: {
      refetchOnWindowFocus: false,
    },
  });

  const { data: moodMaestroMilestone } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "getMoodMaestroMilestone",
    query: {
      refetchOnWindowFocus: false,
    },
  });

  const { data: firstMintBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "firstMintBadgeURI",
    query: {
      refetchOnWindowFocus: false,
    },
  });

  const { data: streakBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakBadgeURI",
    query: {
      refetchOnWindowFocus: false,
    },
  });

  const { data: moodMaestroBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "moodMaestroBadgeURI",
    query: {
      refetchOnWindowFocus: false,
    },
  });

  // Refetch badge status when transactions are successful
  useEffect(() => {
    if (isFirstMinted) {
      console.log("First badge minted successfully!");
      refetchFirstMint();
    }
  }, [isFirstMinted, refetchFirstMint]);

  useEffect(() => {
    if (isStreakMinted) {
      console.log("Streak badge minted successfully!");
      refetchStreak();
    }
  }, [isStreakMinted, refetchStreak]);

  useEffect(() => {
    if (isMaestroMinted) {
      console.log("Maestro badge minted successfully!");
      refetchMaestro();
    }
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

        // Define requirements
        const firstMintRequired = 1;
        const streakRequired = Number(streakMilestone || 7);
        const maestroRequired = Number(moodMaestroMilestone || 50);

        // Define current progress
        const currentMints = Number(userMintCount || 0);
        const currentStreak = Number(streakCount || 0);

        // First Mint Badge
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

        // Streak Badge
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

        // Mood Maestro Badge
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
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to load badges: ${errorMessage}`);
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

  if (!address) {
    return (
      <div className="w-full max-w-4xl p-4">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Your Badges</h2>
        <p className="text-gray-600">
          Please connect your wallet to view your badges.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-4">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Your Badges</h2>
      {loading && (
        <div className="text-center py-8">Loading your badges...</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      {/* Earned Badges */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-600 mb-4">
          🏆 Earned Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges
            .filter((b) => b.earned)
            .map((badge) => (
              <div
                key={badge.id}
                className="bg-green-50 border-2 border-green-200 rounded-lg p-4 shadow-md"
              >
                <div className="flex items-center mb-2">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-16 h-16 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-green-800">{badge.name}</h4>
                    <p className="text-sm text-green-600">✅ Earned!</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{badge.description}</p>
              </div>
            ))}
        </div>
        {badges.filter((b) => b.earned).length === 0 && !loading && (
          <p className="text-gray-500 italic">
            No badges earned yet. Start minting to earn your first badge!
          </p>
        )}
      </div>

      {/* Pending Badges */}
      <div>
        <h3 className="text-xl font-semibold text-orange-600 mb-4">
          🎯 Badges in Progress
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges
            .filter((badge) => !badge.earned)
            .map((badge) => {
              const isMinting =
                (badge.id === "first-mint" && isFirstMinting) ||
                (badge.id === "streak" && isStreakMinting) ||
                (badge.id === "mood-maestro" && isMaestroMinting);

              return (
                <div
                  key={badge.id}
                  className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center mb-2">
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className="w-16 h-16 rounded-full mr-3 object-cover opacity-60"
                      />
                      <div>
                        <h4 className="font-bold text-orange-800">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-orange-600">In Progress</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {badge.description}
                    </p>
                    {badge.progress && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress:</span>
                          <span className="font-semibold">
                            {badge.progress.current}/{badge.progress.required}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${badge.progress.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Claim Button */}
                  <div className="mt-4">
                    {badge.isEligible && (
                      <button
                        onClick={() => handleClaimBadge(badge.id)}
                        disabled={isMinting}
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isMinting ? "Claiming..." : "Claim Badge"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📊 Your Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-blue-600">
              {Number(userMintCount || 0)}
            </p>
            <p className="text-gray-600">Total Mints</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-blue-600">
              {Number(streakCount || 0)}
            </p>
            <p className="text-gray-600">Current Streak</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-blue-600">
              {badges.filter((b) => b.earned).length}
            </p>
            <p className="text-gray-600">Badges Earned</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-blue-600">
              {badges.filter((b) => !b.earned).length}
            </p>
            <p className="text-gray-600">Badges Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
