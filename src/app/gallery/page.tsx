"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NFTGallery from "../../components/NFTGallery";

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FC]">
      <Header />
      {/* THE FIX: Adjusted padding and vertical spacing for mobile */}
      <main className="flex flex-col items-center p-4 sm:p-6 space-y-4 sm:space-y-6 flex-grow">
        {/* THE FIX: Responsive font size and color updated to match the site's theme */}
        <h1 className="text-xl sm:text-2xl font-bold text-green-600">
          The Mood Stream
        </h1>

        <NFTGallery />
      </main>
      <Footer />
    </div>
  );
}
