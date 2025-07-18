"use client";

import ConnectButton from "./ConnectButton";

export default function Header() {
  return (
    <header className="w-full bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">MintMyMood</h1>
      <ConnectButton />
    </header>
  );
}
