"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { generateMoodImage } from "../lib/hugApi";
import { uploadMoodToIPFS } from "../lib/ipfs";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";
import { MoodType } from "../types";
import { FaImage, FaSpinner, FaTimes, FaMagic } from "react-icons/fa";

// The InputField component is already well-sized for mobile. No changes needed here.
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-[#666666] mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
    />
  </div>
);

export default function MoodForm() {
  // --- YOUR ORIGINAL STATE AND LOGIC (UNCHANGED) ---
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
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: moodTypes } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "getMoodTypes",
  }) as { data: MoodType[] | undefined };

  const handleGenerateImage = async () => {
    if (!prompt || !mood || !title || !caption) {
      setError("Please fill all fields to bring your mood to life!");
      return;
    }
    setLoading(true);
    setError("");
    setImageUrl("");
    setLoadingMessage("AI is crafting your mood NFT...");
    try {
      const blob = await generateMoodImage(`${mood} ${prompt}`);
      setImageBlob(blob);
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Image generation failed: ${errorMessage}`);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };
  const handleApproveAndMint = async () => {
    if (!imageBlob || !isConnected || !address || isConnecting) {
      setError("Cannot mint. Check image and wallet connection.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setLoadingMessage("Uploading to IPFS...");
      const metadataUri = await uploadMoodToIPFS(
        imageBlob,
        mood,
        title,
        caption,
        Date.now()
      );
      setIpfsUri(metadataUri);
      setLoadingMessage("Confirming transaction...");
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: MintMyMoodABI,
        functionName: "mintMood",
        args: [metadataUri, mood],
      });
      alert(`✅ Minted mood NFT: ${mood}`);
      handleRetryOrCloseModal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed: ${errorMessage}`);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };
  const handleRetryOrCloseModal = () => {
    setImageUrl("");
    setImageBlob(null);
    setPrompt("");
    setMood("");
    setTitle("");
    setCaption("");
    setIpfsUri("");
  };
  // --- END OF YOUR LOGIC ---

  return (
    <>
      {/* THE FIX: Adjusted padding for better mobile view */}
      <div
        id="mood-form"
        className="w-full max-w-2xl mx-auto bg-white/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/40"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaImage className="text-2xl text-[#FF6B6B]" />
          {/* THE FIX: Responsive font size for the main title */}
          <h2 className="text-xl md:text-2xl font-bold text-[#222222]">
            Mint Your Mood Today
          </h2>
        </div>
        {error && (
          <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
            {error}
          </p>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#666666] mb-1">
              What kind of mood is this?
            </label>
            <select
              value={mood}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setMood(e.target.value)
              }
              disabled={loading}
              className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
            >
              <option value="">Select Mood Type...</option>
              {moodTypes?.map((mt, i) => (
                <option key={i} value={mt.name}>
                  {mt.name} ({mt.category})
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Give it a Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Electric Joy, Peaceful Slumber"
            disabled={loading}
          />
          <InputField
            label="Write a Short Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g., On top of the world today!"
            disabled={loading}
          />

          <div>
            <label className="block text-sm font-medium text-[#666666] mb-1">
              Describe Your Feeling for the AI
            </label>
            <div className="relative">
              {!prompt && (
                // THE FIX: Responsive font size for the placeholder to prevent overflow
                <div className="absolute top-3 left-3 w-full h-full pointer-events-none text-gray-400 text-xs sm:text-sm leading-relaxed">
                  <p className="mb-2">
                    <strong className="text-gray-500">
                      First, your journal entry:
                    </strong>
                    <br />
                    "I felt so happy today after getting the promotion..."
                  </p>
                  <p>
                    <strong className="text-gray-500">
                      Then, describe the NFT visual:
                    </strong>
                    <br />
                    "A cheerful emoji with sparkling eyes, tossing confetti..."
                  </p>
                </div>
              )}
              <textarea
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPrompt(e.target.value)
                }
                rows={5}
                disabled={loading}
                className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateImage}
            disabled={loading}
            // THE FIX: Responsive font size and padding for the main button
            className="w-full flex items-center justify-center gap-3 bg-[#FF6B6B] text-white font-bold text-base md:text-lg px-6 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:scale-100 disabled:shadow-none"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            {loading ? loadingMessage : "Generate My Mood NFT"}
          </button>
        </div>
      </div>

      {isClient &&
        imageUrl &&
        createPortal(
          // THE FIX: Responsive padding for the modal backdrop
          <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4"
            onClick={handleRetryOrCloseModal}
          >
            {/* THE FIX: Responsive padding for the modal content */}
            <div
              className="w-full max-w-lg rounded-2xl bg-[#F7F8FC] p-4 sm:p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleRetryOrCloseModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#666666] hover:text-[#222222]"
              >
                <FaTimes size={24} />
              </button>
              <h3 className="text-lg md:text-xl font-bold text-center text-[#222222] mb-4">
                Your Mood NFT Preview
              </h3>
              <div className="bg-gray-200 rounded-lg p-2 mb-4">
                <img
                  src={imageUrl}
                  alt="Generated mood preview"
                  className="w-full rounded-md"
                />
              </div>
              {error && (
                <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
                  {error}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRetryOrCloseModal}
                  disabled={loading}
                  className="w-full flex-1 bg-gray-200 text-[#222222] font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleApproveAndMint}
                  disabled={loading}
                  className="w-full flex-1 flex items-center justify-center gap-2 bg-[#6BCB77] text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                >
                  {loading &&
                  (loadingMessage.includes("Uploading") ||
                    loadingMessage.includes("Confirming")) ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Looks Good, Mint It!"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
