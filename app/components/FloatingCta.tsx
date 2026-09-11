"use client";

import { openEnquiryPopup } from "@/lib/enquiryPopup";

export function FloatingCta() {
  return (
    <button
      type="button"
      onClick={openEnquiryPopup}
      aria-label="Admission Enquiry"
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-brick px-4 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-brick-600 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame md:bottom-7 md:right-7 md:px-5"
    >
      <ChatIcon />
      <span className="hidden md:inline">Admission Enquiry</span>
    </button>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
