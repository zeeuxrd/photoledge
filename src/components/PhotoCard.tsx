"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface PhotoCardProps {
  index: number;
  photo: {
    id: string;
    src: string;
    caption: string;
    date: string;
    location: string;
    rotation: number;
    color: string;
    initialX: string;
    initialY: string;
    mobileX?: string;
    mobileY?: string;
    hideOnMobile?: boolean;
    zIndex: number;
  };
  onZoom?: (src: string, alt: string) => void;
}

export default function PhotoCard({ index, photo, onZoom }: PhotoCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const lastTapRef = useRef(0);
  
  // Pinch-to-zoom state
  const [scaleMultiplier, setScaleMultiplier] = useState(1);
  const initialDistance = useRef(0);
  const initialScale = useRef(1);
  const isPinching = useRef(false);

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      initialDistance.current = getDistance(e.touches);
      initialScale.current = scaleMultiplier;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching.current) {
      e.preventDefault(); // Prevent scrolling while pinching
      const currentDistance = getDistance(e.touches);
      const delta = currentDistance / initialDistance.current;
      const newScale = Math.min(Math.max(initialScale.current * delta, 0.5), 3);
      setScaleMultiplier(newScale);
    }
  };

  const handleTouchEnd = () => {
    isPinching.current = false;
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately on mount
    window.addEventListener("resize", checkMobile);
    
    // Set mounted flag after initial animation completes (approx 5s)
    const timer = setTimeout(() => setHasMounted(true), 5000);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const currentX = isMobile && photo.mobileX ? photo.mobileX : photo.initialX;
  const currentY = isMobile && photo.mobileY ? photo.mobileY : photo.initialY;

  // On both desktop and mobile, click to flip
  const shouldFlip = isFlipped;

  return (
    <motion.div
      drag
      dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
      whileDrag={{ scale: scaleMultiplier * 1.05, zIndex: 50, cursor: "grabbing" }}
      initial={{ x: 0, y: 0, rotate: photo.rotation - 360, scale: 0, opacity: 0 }}
      animate={{ scale: scaleMultiplier, rotate: photo.rotation, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: hasMounted ? 0 : 3.2 + index * 0.15,
      }}
      className={`absolute cursor-grab pointer-events-auto ${photo.hideOnMobile ? 'hidden md:block' : ''}`}
      style={{
        left: `calc(50% + ${currentX} - 100px)`,
        top: `calc(50% + ${currentY} - 100px)`,
        zIndex: photo.zIndex,
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Flip Wrapper */}
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: shouldFlip ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={(e) => {
          const now = Date.now();
          if (now - lastTapRef.current < 300) {
            // Double tap/click — zoom
            e.stopPropagation();
            onZoom?.(photo.src, photo.caption);
          } else {
            // Single tap — flip
            setIsFlipped(!isFlipped);
          }
          lastTapRef.current = now;
        }}
      >
        {/* FRONT FACE */}
        <div 
          className="relative flex-col items-center select-none border-4 border-white p-2 pb-0 rounded-[25px] shadow-2xl flex"
          style={{ backgroundColor: photo.color, backfaceVisibility: "hidden" }}
        >
          <div className="relative w-[185px] h-[185px] 2xl:w-[206px] 2xl:h-[206px] overflow-hidden rounded-xl bg-gray-200 pointer-events-none border border-gray-100">
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              className="object-cover"
              unoptimized
              draggable={false}
            />
          </div>
          <div className="w-full mt-2 pt-2 pb-3 px-4 flex items-center justify-center text-center pointer-events-none">
            <span className="font-handwriting text-[16px] font-medium text-black/90">
              {photo.caption}
            </span>
          </div>
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center select-none border-4 border-white p-6 rounded-[25px] shadow-2xl text-center"
          style={{ 
            backgroundColor: photo.color, 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <h3 className="font-handwriting text-2xl 2xl:text-3xl font-medium text-black/80 mb-2">
            {photo.location}
          </h3>
          <p className="font-handwriting text-lg 2xl:text-xl font-medium text-black/60">
            {photo.date}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
