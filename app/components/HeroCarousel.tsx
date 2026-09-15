"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const INTERVAL_MS = 4500; // 4-5s per slide

/**
 * Passive, auto-advancing background carousel for the hero. No arrows/dots —
 * it only exists to crossfade the backdrop photo; the headline, subtitle and
 * enquiry form are rendered by Hero.tsx on top of this and never move.
 */
export function HeroCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0 -z-10">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay: darker on the left (behind the headline), fading lighter to
          the right and toward the top so the campus photo stays visible.
          A little extra weight at the bottom on small screens keeps the
          stacked headline readable. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,58,0.80)_0%,rgba(11,31,58,0.58)_42%,rgba(11,31,58,0.30)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(11,31,58,0.40)_0%,rgba(11,31,58,0)_58%)] sm:bg-[linear-gradient(0deg,rgba(11,31,58,0.24)_0%,rgba(11,31,58,0)_52%)]" />
    </div>
  );
}
