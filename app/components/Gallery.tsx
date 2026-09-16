"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Placeholder gallery images — swap these paths for real photos whenever
 * you like. All are already re-hosted in /public/images from earlier work,
 * so nothing new to fetch; just edit this array.
 */
const GALLERY_IMAGES = [
  { src: "/images/hero/slide-1.png", alt: "SKS World School campus building" },
  { src: "/images/gallery/hands-on-activity.png", alt: "Students in a hands-on learning activity" },
  { src: "/images/hero/slide-2.png", alt: "Students at an outdoor morning assembly" },
  { src: "/images/hero/slide-3.png", alt: "A smartboard lesson in progress" },
  { src: "/images/beyond/robotics.webp", alt: "Students in the computer / robotics lab" },
  { src: "/images/hero/slide-4.png", alt: "Art & craft activity in the classroom" },
  { src: "/images/beyond/dramm-jamm.webp", alt: "Music class with keyboards" },
  { src: "/images/beyond/self-defense.webp", alt: "Self-defense class in session" },
  { src: "/images/hero/slide-5.png", alt: "Football on the school grounds" },
];

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
      ),
    [],
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % GALLERY_IMAGES.length)),
    [],
  );

  const open = (i: number) => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveIndex(i);
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      restoreFocusRef.current?.focus?.();
    };
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex === null ? null : GALLERY_IMAGES[activeIndex];

  return (
    <section id="gallery" className="bg-sand">
      <div className="container-page pb-16 pt-16 sm:pb-20 lg:pt-36">
        <p className="eyebrow">Gallery</p>
        <h2 className="mt-2 text-3xl text-brick sm:text-4xl">Life at SKS World School</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          A glimpse of the campus, classrooms and everyday moments at SKS World School.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => open(i)}
              aria-label={`View larger image: ${img.alt}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-brick-700/0 transition-colors duration-300 group-hover:bg-brick-700/10" />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-flame hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame sm:left-4"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-flame hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame sm:right-4"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="flex max-h-[85vh] w-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                key={active.src}
                src={active.src}
                alt={active.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-4 text-center text-sm text-white/80">
              {active.alt}
              <span className="text-white/50">
                {" "}
                — {activeIndex! + 1} / {GALLERY_IMAGES.length}
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
