"use client";

interface ShareProps {
  moodType: string;
  title: string;
  caption: string;
  emoji: string;
  imageUrl: string;
}

export default function ShareButtons({
  moodType,
  title,
  caption,
  emoji,
  imageUrl,
}: ShareProps) {
  const farcasterUrl = `https://warpcast.com/~/compose?text=Minted ${moodType} mood ${emoji}: ${title} - ${caption} #MintMyMood`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=Minted ${moodType} mood ${emoji}: ${title} - ${caption} #MintMyMood`;

  return (
    <div className="flex gap-2">
      <a
        href={farcasterUrl}
        target="_blank"
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Share to Farcaster
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Share to Twitter
      </a>
      <a
        href={imageUrl}
        download={`${moodType}.png`}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Download PNG
      </a>
    </div>
  );
}
