import { useReadContract } from "wagmi";
import { MintMyMoodABI } from "./MintMyMoodABI";
import { generateAIReview } from "./hugApi";

// Mood metadata from IPFS
interface NFTMetadata {
  name: string; // Mood type (e.g., Happy)
  description: string; // Caption
  image: string;
  attributes: { trait_type: string; value: string }[];
}

// Review data structure
export interface MoodReview {
  period: "weekly" | "monthly";
  moodCounts: { [key: string]: number };
  dominantMood: string;
  reviewText: string;
}

// Predefined review messages (fallback)
const reviewMessages: {
  [key: string]: { positive: string; negative: string };
} = {
  Happy: {
    positive: "Wow, you've been super happy this {period}! Keep shining 😊!",
    negative: "",
  },
  Hopeful: {
    positive: "Lots of hope this {period}! Keep chasing those dreams 🌟!",
    negative: "",
  },
  Sad: {
    positive: "",
    negative:
      "It's been a tough {period}. Try journaling or a walk to lift your spirits ❤️.",
  },
  Anxious: {
    positive: "",
    negative:
      "Feeling anxious this {period}? Try meditation or a fun hobby to relax 🌈.",
  },
};

// Build dynamic prompt for AI
export function buildMoodPrompt(
  moodCounts: { [key: string]: number },
  period: "weekly" | "monthly"
): string {
  const moodsSummary = Object.entries(moodCounts)
    .map(([mood, count]) => `${mood}: ${count}`)
    .join(", ");

  return `You are a friendly mood coach. Based on these mood counts for the past ${period}: ${moodsSummary}, write a short, positive review (max 50 words). 
  If most moods are positive, congratulate and encourage consistency. 
  If mostly negative, give a short uplifting suggestion to improve the next ${period}.`;
}

// Fetch user's minted NFTs for a given period
export async function fetchUserMoods(
  address: string,
  period: "weekly" | "monthly"
): Promise<NFTMetadata[]> {
  const { data: balance } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: MintMyMoodABI,
    functionName: "balanceOf",
    args: [address],
  });

  const timeRange =
    period === "weekly" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - timeRange;
  const moods: NFTMetadata[] = [];

  if (balance) {
    for (let i = 0; i < Number(balance); i++) {
      const { data: tokenId } = useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: MintMyMoodABI,
        functionName: "tokenOfOwnerByIndex",
        args: [address, BigInt(i)],
      });

      if (tokenId) {
        const { data: uri } = useReadContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: MintMyMoodABI,
          functionName: "tokenURI",
          args: [tokenId],
        });

        if (uri && typeof uri === "string") {
          const response = await fetch(
            uri.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          if (response.ok) {
            const metadata: NFTMetadata = await response.json();
            const timestamp = Number(
              metadata.attributes.find(
                (attr) => attr.trait_type === "Timestamp"
              )?.value
            );
            if (timestamp >= cutoff) {
              moods.push(metadata);
            }
          }
        }
      }
    }
  }

  return moods;
}

// Analyze moods and generate review (AI-enhanced with fallback)
export async function generateReview(
  moods: NFTMetadata[],
  period: "weekly" | "monthly"
): Promise<MoodReview> {
  const moodCounts: { [key: string]: number } = {};
  moods.forEach((mood) => {
    const moodType = mood.name;
    moodCounts[moodType] = (moodCounts[moodType] || 0) + 1;
  });

  // Find dominant mood
  let dominantMood = "Mixed";
  let maxCount = 0;
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      dominantMood = mood;
      maxCount = count;
    }
  }

  // Try AI-generated review
  let reviewText = "";
  try {
    reviewText = await generateAIReview(moodCounts, period);
  } catch (error) {
    console.error("AI review failed, using fallback:", error);
    // Fallback to predefined messages
    reviewText = `A balanced ${period}! Keep expressing yourself!`;

    if (reviewMessages[dominantMood]) {
      const isPositive = ["Happy", "Hopeful"].includes(dominantMood);
      const messageTemplate = isPositive
        ? reviewMessages[dominantMood].positive
        : reviewMessages[dominantMood].negative;

      // Only use the template if it's not empty
      if (messageTemplate) {
        reviewText = messageTemplate.replace("{period}", period);
      }
    }
  }

  return { period, moodCounts, dominantMood, reviewText };
}

// Check if review should be triggered
export function shouldTriggerReview(
  lastReview: number | null,
  period: "weekly" | "monthly"
): boolean {
  const timeRange =
    period === "weekly" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  return !lastReview || Date.now() - lastReview >= timeRange;
}
