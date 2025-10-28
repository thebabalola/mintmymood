"use client";

interface Props {
  streak: number;
}

export default function StreakProgress({ streak }: Props) {
  return (
    <div className="bg-gray-100 p-3 rounded text-center">
      <p className="text-sm text-gray-600">Current Streak</p>
      <p className="text-2xl font-bold text-green-600">{streak} 🔥</p>
    </div>
  );
}
