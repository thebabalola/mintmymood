"use client";

import { useState, useEffect } from "react";
import { useReadContract, useAccount } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";

// NOTE: We are removing the write hooks for now to isolate and fix the read loop.
// We can add them back after the display logic is stable.

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: boolean;
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

  // Read contract data for badge tracking
  const { data: hasFirstMintBadge } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "hasFirstMintBadge",
    args: address ? [address] : undefined,
  });

  const { data: hasStreakBadge } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "hasStreakBadge",
    args: address ? [address] : undefined,
  });

  const { data: hasMoodMaestroBadge } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "hasMoodMaestroBadge",
    args: address ? [address] : undefined,
  });

  const { data: userMintCount } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "getMintCount",
    args: address ? [address] : undefined,
  });

  const { data: streakCount } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakCount",
    args: address ? [address] : undefined,
  });

  const { data: streakMilestone } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakMilestone",
  });

  const { data: moodMaestroMilestone } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "getMoodMaestroMilestone",
  });

  // Read badge URIs from contract
  const { data: firstMintBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "firstMintBadgeURI",
  });

  const { data: streakBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "streakBadgeURI",
  });

  const { data: moodMaestroBadgeURI } = useReadContract({
    address: contractAddress,
    abi: MintMyMoodABI,
    functionName: "moodMaestroBadgeURI",
  });

  // ✅ FIXED: This function now correctly converts IPFS URIs to HTTPS URLs.
  const fetchBadgeMetadata = async (
    uri: string
  ): Promise<BadgeMetadata | null> => {
    if (!uri || uri.trim() === "") return null;

    // Convert ipfs:// URI to an HTTP gateway URL
    const httpUri = uri.startsWith("ipfs://")
      ? uri.replace("ipfs://", "https://ipfs.io/ipfs/")
      : uri;

    try {
      const response = await fetch(httpUri);
      if (!response.ok) {
        console.error(
          `Failed to fetch metadata from ${httpUri}: ${response.status}`
        );
        return null; // Return null on failure to prevent crashes
      }
      const metadata: BadgeMetadata = await response.json();
      return metadata;
    } catch (e) {
      console.error(`Error fetching or parsing metadata from ${httpUri}:`, e);
      return null; // Return null on any error
    }
  };

  useEffect(() => {
    const loadBadges = async () => {
      if (!address) {
        setBadges([]); // Clear badges if no user is connected
        setLoading(false);
        return;
      }

      // Only show loader on initial load
      // setLoading(true);
      setError("");

      try {
        const badgePromises = [
          fetchBadgeMetadata(firstMintBadgeURI as string),
          fetchBadgeMetadata(streakBadgeURI as string),
          fetchBadgeMetadata(moodMaestroBadgeURI as string),
        ];

        const [firstMintMetadata, streakMetadata, maestroMetadata] =
          await Promise.all(badgePromises);

        const badgeList: Badge[] = [];

        // First Mint Badge
        badgeList.push({
          id: "first-mint",
          name: firstMintMetadata?.name || "First Mint",
          description:
            firstMintMetadata?.description ||
            "Awarded for your first mood mint!",
          image: firstMintMetadata?.image
            ? firstMintMetadata.image.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              )
            : "/placeholder-badge.svg",
          earned: Boolean(hasFirstMintBadge),
          progress: !hasFirstMintBadge
            ? {
                current: Number(userMintCount || 0),
                required: 1,
                percentage: Number(userMintCount || 0) >= 1 ? 100 : 0,
              }
            : undefined,
        });

        // Streak Badge
        badgeList.push({
          id: "streak",
          name:
            streakMetadata?.name ||
            `${Number(streakMilestone || 7)}-Day Streaker`,
          description:
            streakMetadata?.description ||
            `Awarded for maintaining a ${Number(
              streakMilestone || 7
            )}-day streak!`,
          image: streakMetadata?.image
            ? streakMetadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            : "/placeholder-badge.svg",
          earned: Boolean(hasStreakBadge),
          progress: !hasStreakBadge
            ? {
                current: Number(streakCount || 0),
                required: Number(streakMilestone || 7),
                percentage: Math.min(
                  100,
                  (Number(streakCount || 0) / Number(streakMilestone || 7)) *
                    100
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
            `Awarded for minting ${Number(moodMaestroMilestone || 50)} moods!`,
          image: maestroMetadata?.image
            ? maestroMetadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            : "/placeholder-badge.svg",
          earned: Boolean(hasMoodMaestroBadge),
          progress: !hasMoodMaestroBadge
            ? {
                current: Number(userMintCount || 0),
                required: Number(moodMaestroMilestone || 50),
                percentage: Math.min(
                  100,
                  (Number(userMintCount || 0) /
                    Number(moodMaestroMilestone || 50)) *
                    100
                ),
              }
            : undefined,
        });

        setBadges(badgeList);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to load badges: ${errorMessage}`);
        console.error("UserBadges error:", err);
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
        <div className="flex justify-center items-center py-8">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-purple-600"
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
          <p>Loading your badges...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Earned Badges */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-600 mb-4">
          🏆 Earned Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges
            .filter((badge) => badge.earned)
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
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIzMiIgZmlsbD0iI2ZmZGQwMCIvPjx0ZXh0IHg9IjMyIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+🏆PC90ZXh0Pjwvc3ZnPg==";
                    }}
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

        {badges.filter((badge) => badge.earned).length === 0 && !loading && (
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
            .map((badge) => (
              <div
                key={badge.id}
                className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 shadow-md"
              >
                <div className="flex items-center mb-2">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-16 h-16 rounded-full mr-3 object-cover opacity-60"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIzMiIgZmlsbD0iI2Y5NzMxNiIvPjx0ZXh0IHg9IjMyIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+🎯PC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-orange-800">{badge.name}</h4>
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
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${badge.progress.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {badge.progress.percentage.toFixed(1)}% complete
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Summary Stats */}
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
