"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NFTGallery from "../../components/NFTGallery";

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-6 space-y-6 flex-grow">
        <h1 className="text-2xl font-bold text-green-600">Mood Gallery</h1>
        <NFTGallery />
      </main>
      <Footer />
    </div>
  );
}
