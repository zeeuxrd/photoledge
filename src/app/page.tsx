"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import PhotoCard from "@/components/PhotoCard";
import PhotoLightbox from "@/components/PhotoLightbox";

const initialPhotos = [
  {
    id: "work",
    src: "/images/assets/love-my-work-time.png",
    caption: "Love my work time...",
    date: "October 12, 2025",
    location: "San Francisco, CA",
    rotation: -5,
    color: "#d4edb4", // light green
    initialX: "-35%",
    initialY: "-15vh",
    mobileX: "-25%",
    mobileY: "-30vh",
    zIndex: 1,
  },
  {
    id: "bedtime",
    src: "/images/assets/bedtime.png",
    caption: "Bedtime...",
    date: "November 4, 2025",
    location: "Home Studio",
    rotation: 8,
    color: "#fff8cc", // light yellow
    initialX: "-35%",
    initialY: "35vh",
    mobileX: "-20%",
    mobileY: "50vh",
    zIndex: 2,
  },
  {
    id: "vacation",
    src: "/images/assets/vacation.png",
    caption: "Vacation...",
    date: "August 15, 2024",
    location: "Santorini, Greece",
    rotation: 25,
    color: "#f9ded8", // peach
    initialX: "12%",
    initialY: "-10vh",
    mobileX: "5%",
    mobileY: "-15vh",
    zIndex: 3,
  },
  {
    id: "ypit",
    src: "/images/assets/ypit2025.png",
    caption: "YPIT 2025...",
    date: "January 10, 2025",
    location: "Lagos, Nigeria",
    rotation: 0,
    color: "#ffffff", // white
    initialX: "-10%",
    initialY: "40vh",
    mobileX: "25%",
    mobileY: "5vh",
    zIndex: 4,
  },
  {
    id: "mirror",
    src: "/images/assets/mirror-selfies.png",
    caption: "Mirror selfies...",
    date: "March 22, 2025",
    location: "Downtown Cafe",
    rotation: 5,
    color: "#ffc8bd", // coral
    initialX: "35%",
    initialY: "-10vh",
    mobileX: "-20%",
    mobileY: "20vh",
    zIndex: 5,
  },
  {
    id: "stargirl",
    src: "/images/assets/star-girl.png",
    caption: "Star Girl...",
    date: "December 31, 2024",
    location: "New York City, NY",
    rotation: 15,
    color: "#a4e2ff", // light blue
    initialX: "15%",
    initialY: "40vh",
    mobileX: "20%",
    mobileY: "60vh",
    zIndex: 6,
  },
  {
    id: "accessories",
    src: "/images/assets/cute-acessories.png",
    caption: "Cute accessories...",
    date: "February 14, 2025",
    location: "My Bedroom",
    rotation: -25,
    color: "#f5c3f3", // light pink
    initialX: "-12%",
    initialY: "-10vh",
    mobileX: "15%",
    mobileY: "40vh",
    zIndex: 7,
  },
  {
    id: "beach",
    src: "/images/assets/beach-day-with-fam.png",
    caption: "Beach day with fam...",
    date: "July 4, 2024",
    location: "Malibu Beach, CA",
    rotation: -10,
    color: "#b0abff", // light purple
    initialX: "35%",
    initialY: "35vh",
    mobileX: "0%",
    mobileY: "55vh",
    hideOnMobile: true,
    zIndex: 8,
  },
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [items, setItems] = useState(initialPhotos);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Hide the intro sequence after 2.5 seconds
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const introText = isMobile
    ? "creating memories"
    : "creating memories that last a lifetime";

  return (
    <>
    <main className="min-h-[150vh] w-full bg-[#E6DACA] flex flex-col">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#E6DACA]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.h2
              className="font-handwriting text-[36px] md:text-[80px] text-black px-4 text-center leading-[0.73] md:leading-tight flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5"
            >
              {introText.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 40, rotate: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 10,
                    delay: 0.2 + index * 0.15,
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section OUTSIDE the brown board */}
      <div className="w-full flex flex-col items-center pt-16 pb-8">
        <h1 className="font-handwriting text-[30px] md:text-[42px] leading-[0.4] md:leading-[0.75] text-black tracking-wide mb-2">
          hang your Favorite photos
        </h1>
        <p className="text-[#5B637A] text-[11px] md:text-[20px] font-medium tracking-wide mt-2">
          tap a photo to pick it up, tap again to place it
        </p>
      </div>

      {/* Brown Board Section */}
      <div className="w-full px-[30px] pb-[30px] flex-1 flex flex-col">
        <div
          className="flex-1 w-full relative overflow-hidden rounded-[30px] shadow-2xl"
          style={{
            backgroundImage: "url('/images/assets/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Card Container with symmetrical top and bottom padding */}
          <div className="relative w-full min-h-[calc(100vh-200px)] pt-[25vh] pb-[25vh] flex items-center justify-center pointer-events-none box-border">
            <div className="relative w-full h-0 pointer-events-auto">
              {items.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  index={index}
                  photo={photo}
                  onZoom={(src, alt) => setZoomedPhoto({ src, alt })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>

    <PhotoLightbox
      src={zoomedPhoto?.src || ""}
      alt={zoomedPhoto?.alt || ""}
      isOpen={!!zoomedPhoto}
      onClose={() => setZoomedPhoto(null)}
    />
    </>
  );
}
