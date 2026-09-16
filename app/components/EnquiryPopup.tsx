"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { content } from "@/lib/content";
import { onOpenEnquiryPopup } from "@/lib/enquiryPopup";
import { EnquiryForm } from "./EnquiryForm";

const SEEN_KEY = "sks_popup_seen";
const SUBMITTED_KEY = "sks_enquiry_submitted";
const DELAY_MS = 15_000;
const SCROLL_FRACTION = 0.5;

const readFlag = (k: string) => {
  try {
    return sessionStorage.getItem(k) === "1";
  } catch {
    return false;
  }
};
const writeFlag = (k: string) => {
  try {
    sessionStorage.setItem(k, "1");
  } catch {
    /* private mode / storage disabled — popup just behaves as not-yet-seen */
  }
};

export function EnquiryPopup() {
  const [open, setOpen] = useState(false);
  // Portal target isn't available during SSR / the first client render, so
  // gate on mount before ever calling createPortal(document.body).
  const [mounted, setMounted] = useState(false);
  const shownRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback(() => setOpen(false), []);

  /* --- decide whether / when to reveal (once per session) --- */
  useEffect(() => {
    if (readFlag(SEEN_KEY) || readFlag(SUBMITTED_KEY)) return;

    let timer = 0;

    const teardown = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };

    const reveal = () => {
      if (shownRef.current) return;
      // hero form may have been submitted after this effect mounted
      if (readFlag(SUBMITTED_KEY)) {
        teardown();
        return;
      }
      shownRef.current = true;
      writeFlag(SEEN_KEY);
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      teardown();
    };

    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable > 0 && el.scrollTop / scrollable >= SCROLL_FRACTION) reveal();
    };

    timer = window.setTimeout(reveal, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // in case the page is already past the halfway mark

    return teardown;
  }, []);

  /* --- also open on demand, e.g. the header's "Admission Enquiry" button --- */
  useEffect(() => {
    return onOpenEnquiryPopup(() => {
      shownRef.current = true;
      writeFlag(SEEN_KEY);
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    });
  }, []);

  /* --- while open: lock scroll, Escape to close, manage focus --- */
  useEffect(() => {
    if (!open) return;

    // Plain `overflow: hidden` on <body> isn't enough on mobile Safari: if the
    // popup opens while the page is already scrolled (exactly the 50%-scroll
    // auto-trigger case), a `position: fixed` overlay can render pinned to the
    // *document's* top instead of the visible viewport, and the background
    // still rubber-band-scrolls under the finger. Pinning <body> itself at a
    // negative offset equal to the current scroll position is the standard,
    // robust fix — the popup keeps its own `fixed` positioning and stays
    // centered in the real viewport regardless.
    const scrollY = window.scrollY;
    scrollYRef.current = scrollY;
    const body = document.body.style;
    const prev = {
      position: body.position,
      top: body.top,
      width: body.width,
      overflow: body.overflow,
    };
    body.position = "fixed";
    body.top = `-${scrollY}px`;
    body.width = "100%";
    body.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      body.position = prev.position;
      body.top = prev.top;
      body.width = prev.width;
      body.overflow = prev.overflow;
      window.scrollTo(0, scrollYRef.current);
      document.removeEventListener("keydown", onKey);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  if (!open || !mounted) return null;

  // Rendered via a portal straight onto <body> — fixed inset-0 already made
  // it visually escape any ancestor, but a portal also sidesteps the whole
  // class of "an ancestor gained a transform/filter and now traps position:
  // fixed inside its bounds" bugs, and guarantees it always paints above
  // everything else regardless of where in the tree <EnquiryPopup /> is used.
  return createPortal(
    // The overlay must NOT have overflow-y-auto — on iOS Safari a fixed element
    // with overflow scroll can be clipped / displaced after the page has scrolled.
    // Instead we use a flex centering wrapper and let the card itself scroll.
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-popup-title"
      onClick={dismiss}
    >
      <div
        className="animate-fade-up relative w-[90vw] max-w-md rounded-2xl bg-white p-6 shadow-lift overflow-y-auto sm:w-full sm:max-w-lg sm:p-7"
        style={{ maxHeight: "90vh", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
          <button
            ref={closeRef}
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h2
            id="enquiry-popup-title"
            className="mt-1 font-display text-xl text-brick sm:text-2xl"
          >
            Admissions Open 2026&ndash;27
          </h2>
          <p className="mt-1 pr-8 text-sm text-ink/60">
            Share your details and our admissions team will call you back.
          </p>

          <div className="mt-4">
            <EnquiryForm
              compact
              onSuccess={() => window.setTimeout(dismiss, 2600)}
            />
          </div>
      </div>
    </div>,
    document.body,
  );
}
