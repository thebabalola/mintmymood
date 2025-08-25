export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
  isBadge?: boolean;
  owner?: string; // Ensure this is present
}

export interface MoodReview {
  reviewText: string;
  moodCounts: { [key: string]: number };
  dominantMood: string;
}
