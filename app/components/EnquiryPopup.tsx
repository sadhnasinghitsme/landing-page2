"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const shownRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

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

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-ink/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-popup-title"
      onClick={dismiss}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="animate-fade-up relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lift sm:p-7"
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
      </div>
    </div>
  );
}
