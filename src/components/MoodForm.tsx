"use client";

import { useState } from "react";
import { generateMoodImage } from "../lib/hugApi";
import { uploadMoodToIPFS } from "../lib/ipfs";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";
import { MoodType } from "../types";

export default function MoodForm() {
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [ipfsUri, setIpfsUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  const { address, isConnected, isConnecting } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: moodTypes } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "getMoodTypes",
  }) as { data: MoodType[] | undefined };

  const handleGenerateImage = async () => {
    if (!prompt || !mood || !title || !caption) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    setImageUrl("");
    setIpfsUri("");
    setLoadingMessage("Generating image...");

    try {
      const blob = await generateMoodImage(`${mood} ${prompt}`);
      setImageBlob(blob);
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Image generation failed: ${errorMessage}`);
      console.error("MoodForm error:", err);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleApproveAndMint = async () => {
    if (!imageBlob) {
      setError("No image generated");
      return;
    }
    if (!isConnected || !address) {
      setError("Please connect wallet");
      return;
    }
    if (isConnecting) {
      setError("Wallet connection in progress, please wait");
      return;
    }
    setLoading(true);
    setError("");
    setLoadingMessage("Uploading to IPFS...");

    try {
      // Upload to IPFS
      const metadataUri = await uploadMoodToIPFS(
        imageBlob,
        mood,
        title,
        caption,
        Date.now()
      );
      setIpfsUri(metadataUri);

      setLoadingMessage("Minting NFT...");
      // Mint NFT
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: MintMyMoodABI,
        functionName: "mintMood",
        args: [metadataUri, mood],
      });

      alert(`✅ Minted mood NFT: ${mood}`);
      setPrompt("");
      setMood("");
      setTitle("");
      setCaption("");
      setImageBlob(null);
      setImageUrl("");
      setIpfsUri("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed: ${errorMessage}`);
      console.error("MoodForm error:", err);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white shadow rounded space-y-3">
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
          <p>{loadingMessage}</p>
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="w-full border p-2 rounded"
        aria-label="Select mood type"
        disabled={loading}
      >
        <option value="">Select Mood Type</option>
        {moodTypes?.map((mt, i) => (
          <option key={i} value={mt.name}>
            {mt.name} ({mt.category})
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Title (e.g., Happy Vibe)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        aria-label="Mood title"
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Caption (e.g., Feeling great!)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border p-2 rounded"
        aria-label="Mood caption"
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Image prompt (e.g., Astronaut riding a horse)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border p-2 rounded"
        aria-label="Image prompt"
        disabled={loading}
      />
      <button
        onClick={handleGenerateImage}
        disabled={loading}
        className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        aria-label="Generate image"
      >
        {loading ? "Processing..." : "Generate Image"}
      </button>
      {imageUrl && (
        <div className="mt-4 space-y-3">
          <img src={imageUrl} alt="Generated mood" className="w-full rounded" />
          <button
            onClick={handleGenerateImage}
            disabled={loading}
            className="bg-yellow-600 text-white w-full p-2 rounded hover:bg-yellow-700 disabled:bg-gray-400"
            aria-label="Re-generate image"
          >
            Re-generate Image
          </button>
          <button
            onClick={handleApproveAndMint}
            disabled={loading || !isConnected || isConnecting}
            className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            aria-label="Approve and mint"
          >
            Approve & Mint NFT
          </button>
        </div>
      )}
      {ipfsUri && (
        <div className="mt-4">
          <p>
            IPFS URI:{" "}
            <a
              href={ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/")}
              target="_blank"
              className="underline"
            >
              {ipfsUri}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
