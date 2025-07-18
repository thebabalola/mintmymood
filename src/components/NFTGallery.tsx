"use client";

import { useState, useEffect } from "react";
import { useReadContract, usePublicClient } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export default function NFTGallery() {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const publicClient = usePublicClient();
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  // Fetch total supply
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

        // Fetch tokenURIs for all tokens
        for (const tokenId of tokenIds) {
          try {
            const uri = await publicClient.readContract({
              address: contractAddress,
              abi: MintMyMoodABI,
              functionName: "tokenURI",
              args: [BigInt(tokenId)],
            });

            if (uri && typeof uri === "string") {
              console.log(
                `Fetching metadata for token ${tokenId} from URI: ${uri}`
              );

              let metadata: NFTMetadata;

              // Check if it's a data URI (for badges) or IPFS URI (for regular moods)
              if (uri.startsWith("data:application/json;base64,")) {
                // Handle base64-encoded badge metadata
                const base64Data = uri.split(",")[1];
                const jsonString = atob(base64Data);
                metadata = JSON.parse(jsonString);
                console.log(`Badge metadata for token ${tokenId}:`, metadata);
              } else {
                // Handle IPFS metadata for regular mood NFTs
                const httpUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");

                const response = await fetch(httpUri);
                if (!response.ok) {
                  console.error(
                    `Failed to fetch metadata for token ${tokenId}: ${response.status}`
                  );
                  continue;
                }

                metadata = await response.json();
                console.log(`IPFS metadata for token ${tokenId}:`, metadata);
              }

              fetchedNfts.push(metadata);
            }
          } catch (tokenError) {
            console.error(`Error fetching token ${tokenId}:`, tokenError);
            continue;
          }
        }

        console.log(`Successfully fetched ${fetchedNfts.length} NFTs`);
        setNfts(fetchedNfts);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to load NFTs: ${errorMessage}`);
        console.error("NFTGallery error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [mintCount, publicClient, mintCountLoading, contractAddress]);

  return (
    <div className="w-full max-w-4xl p-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Recent Moods</h2>
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
          <p>Loading NFTs...</p>
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
      {nfts.length === 0 && !loading && !error && (
        <p>
          No NFTs minted yet. {mintCount ? `Total supply: ${mintCount}` : ""}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {nfts.map((nft, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <img
              src={
                nft.image
                  ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                  : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CYWRnZTwvdGV4dD48L3N2Zz4="
              }
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
            <p>
              Mood:{" "}
              {nft.attributes.find((attr) => attr.trait_type === "Mood")?.value}
            </p>
            <p>
              Timestamp:{" "}
              {new Date(
                Number(
                  nft.attributes.find((attr) => attr.trait_type === "Timestamp")
                    ?.value
                ) * 1000
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
