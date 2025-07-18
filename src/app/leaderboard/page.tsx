"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MintMyMoodABI } from "../../lib/MintMyMoodABI";

interface LeaderboardEntry {
  address: string;
  mintCount: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch totalSupply to iterate tokens (simplified; use subgraph for production)
  const { data: totalSupply } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "totalSupply",
  });

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError("");
      try {
        // TODO: Use subgraph or event listener for Minted events in production
        const mintCountByAddress: { [key: string]: number } = {};
        const tokenIds = totalSupply
          ? Array.from({ length: Number(totalSupply) }, (_, i) => i + 1)
          : [];

        for (const tokenId of tokenIds) {
          const { data: owner } = useReadContract({
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
            abi: MintMyMoodABI,
            functionName: "ownerOf",
            args: [BigInt(tokenId)],
          });

          if (owner && typeof owner === "string") {
            mintCountByAddress[owner] = (mintCountByAddress[owner] || 0) + 1;
          }
        }

        const leaderboardData = Object.entries(mintCountByAddress)
          .map(([address, mintCount]) => ({ address, mintCount }))
          .sort((a, b) => b.mintCount - a.mintCount)
          .slice(0, 10); // Top 10 minters

        setLeaderboard(leaderboardData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to load leaderboard: ${errorMessage}`);
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (totalSupply) fetchLeaderboard();
  }, [totalSupply]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-6 space-y-6 flex-grow">
        <h1 className="text-2xl font-bold text-green-600">Leaderboard</h1>
        <div className="w-full max-w-md p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            Top Minters
          </h2>
          {loading && (
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
              <p>Loading leaderboard...</p>
            </div>
          )}
          {error && <p className="text-red-600">{error}</p>}
          {leaderboard.length === 0 && !loading && !error && (
            <p>No mints yet.</p>
          )}
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <span>{`${entry.address.slice(0, 6)}...${entry.address.slice(
                  -4
                )}`}</span>
                <span>{entry.mintCount} NFTs</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
