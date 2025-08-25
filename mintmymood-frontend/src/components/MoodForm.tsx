"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { generateMoodImage } from "../lib/hugApi";
import { uploadMoodToIPFS } from "../lib/ipfs";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { MintMyMoodABI } from "../lib/MintMyMoodABI";
import { MoodType } from "../types";
import {
  FaImage,
  FaSpinner,
  FaTimes,
  FaMagic,
  FaPaintBrush,
  FaRobot,
  FaCheckCircle,
} from "react-icons/fa";

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
    <label className="block text-sm font-medium text-[#666666] mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-white/60 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);

export default function MoodForm() {
  // --- YOUR ORIGINAL STATE AND LOGIC (UNCHANGED) ---
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState("");
  const [customization, setCustomization] = useState("");
  const [showCustomization, setShowCustomization] = useState(false);
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
    if (!prompt || !mood) {
      setError("Please select a mood and write a caption describing how you feel!");
      return;
    }
    setLoading(true);
    setError("");
    setImageUrl("");
    setLoadingMessage("AI is crafting your mood NFT...");
    try {
      // THE FIX: Add emoji NFT style prefix to ensure consistent emoji-style generation
      const customizationText = customization ? ` ${customization}` : "";
      const emojiNFTPrompt = `Create a high-quality emoji-style NFT image with clean, vibrant colors and smooth digital art style. The image should be: ${mood} ${prompt}${customizationText}. Strictly Make a premium emoji NFT style image.`;
      const blob = await generateMoodImage(emojiNFTPrompt);
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
        mood, // Use mood as title
        prompt, // Use user's caption as caption
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
      handleCloseModal();
    } catch (err) {
      // THE FIX: Filter out user rejection errors to avoid showing technical details
      if (
        err instanceof Error &&
        err.message.includes("User rejected the request")
      ) {
        // User cancelled - just close modal silently or show friendly message
        setError("Transaction cancelled.");
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Failed: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };
  const handleCloseModal = () => {
    setImageUrl("");
    setImageBlob(null);
    setPrompt("");
    setMood("");
    setCustomization("");
    setShowCustomization(false);
    setIpfsUri("");
  };

  const handleTryAgain = () => {
    // Keep the form data but clear the generated image
    setImageUrl("");
    setImageBlob(null);
    setIpfsUri("");
    setError(""); // Clear any previous errors
  };
  // --- END OF YOUR LOGIC ---

  return (
    <>
      {/* THE FIX: Adjusted padding for better mobile view */}
      <div
        id="mood-form"
        className="w-full max-w-2xl mx-auto bg-white/40 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/50"
      >
        <div className="flex items-center gap-3 mb-8">
          <FaImage className="text-2xl text-[#FF6B6B]" />
          <h2 className="text-xl md:text-2xl font-bold text-[#222222]">
            Mint Your Mood Today
          </h2>
        </div>
        {error && (
          <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg overflow-hidden">
            <p className="break-words whitespace-pre-wrap text-sm max-h-32 overflow-y-auto">
              {error}
            </p>
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#666666] mb-2">
              What kind of mood is this?
            </label>
            <select
              value={mood}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setMood(e.target.value)
              }
              disabled={loading}
              className="w-full bg-white/60 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ maxHeight: "200px" }}
              size={1}
            >
              <option value="">Select Mood Type...</option>
              {moodTypes?.map((mt, i) => (
                <option key={i} value={mt.name}>
                  {mt.name} ({mt.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#666666] mb-2">
              Write a short caption, describing how you feel
            </label>
            <div className="relative">
              {!prompt && (
                <div className="absolute top-3 left-3 right-3 pointer-events-none text-gray-400 text-xs leading-relaxed">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-500 mb-1">
                        Start with your journal entry:
                      </div>
                      <div className="text-gray-400 break-words">
                        "I felt so happy today after getting the promotion..."
                        <span className="block text-xs italic mt-1">
                          (Describe your feeling in your own words)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <textarea
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPrompt(e.target.value)
                }
                rows={3}
                disabled={loading}
                className="w-full bg-white/60 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-2 text-sm font-medium text-[#666666] hover:text-[#FF6B6B] transition-colors"
            >
              <span>Customize the visual detail (Optional)</span>
              <svg
                className={`w-4 h-4 transition-transform ${showCustomization ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showCustomization && (
              <div className="mt-3">
                <textarea
                  value={customization}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCustomization(e.target.value)
                  }
                  rows={2}
                  disabled={loading}
                  className="w-full bg-white/60 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  placeholder="e.g., Make it golden with sparkles, Add rainbow colors, Make it glow..."
                />
                <p className="text-xs text-[#666666] mt-1">
                  This won't be stored on the NFT - only used for AI NFT generation
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateImage}
            disabled={loading}
            // THE FIX: Enhanced mobile responsive button with better text and icon scaling
            className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 bg-[#FF6B6B] text-white font-bold text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:scale-100 disabled:shadow-none"
          >
            {loading ? (
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                {/* THE FIX: Mobile responsive assembly line with stacked layout on small screens */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex flex-col sm:flex-row items-center text-xs sm:text-sm">
                    <FaRobot className="text-base sm:text-xl animate-pulse" />
                    <div className="ml-0 sm:ml-1 text-xs opacity-75">AI</div>
                  </div>
                  <div className="text-gray-300 text-xs sm:text-base">→</div>
                  <div className="flex flex-col sm:flex-row items-center text-xs sm:text-sm">
                    <FaPaintBrush className="text-base sm:text-xl animate-bounce" />
                    <div className="ml-0 sm:ml-1 text-xs opacity-75">Paint</div>
                  </div>
                  <div className="text-gray-300 text-xs sm:text-base">→</div>
                  <div className="flex flex-col sm:flex-row items-center text-xs sm:text-sm">
                    <FaImage
                      className="text-base sm:text-xl animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div className="ml-0 sm:ml-1 text-xs opacity-75">NFT</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm md:text-base">
                  {loadingMessage}
                </div>
              </div>
            ) : (
              <FaMagic className="text-base sm:text-xl" />
            )}
            {!loading && (
              <span className="text-sm sm:text-base md:text-lg">
                Generate My Mood NFT
              </span>
            )}
          </button>
        </div>
      </div>

      {isClient &&
        imageUrl &&
        createPortal(
          // THE FIX: Responsive padding for the modal backdrop
          <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 overflow-y-auto"
            onClick={handleCloseModal}
          >
            {/* THE FIX: Responsive padding for the modal content + overflow handling */}
            <div
              className="w-full max-w-lg rounded-2xl bg-[#F7F8FC] p-4 sm:p-6 shadow-2xl relative my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
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
                <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg overflow-hidden">
                  <p className="break-words whitespace-pre-wrap text-sm max-h-32 overflow-y-auto">
                    {error}
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleTryAgain}
                  disabled={loading}
                  className="w-full flex-1 bg-gray-200 text-[#222222] font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Regenerate Image
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
