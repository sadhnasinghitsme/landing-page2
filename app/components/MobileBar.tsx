"use client";

import { content, telHref } from "@/lib/content";
import { openEnquiryPopup } from "@/lib/enquiryPopup";

export function MobileBar() {
  const phone = content.contact.phones[0];
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-paper/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2 px-4 py-2.5">
        <a href={telHref(phone)} className="btn-ghost">
          Call {phone}
        </a>
        <a
          href="#enquiry"
          onClick={(e) => {
            e.preventDefault();
            openEnquiryPopup();
          }}
          className="btn-primary"
        >
          Enquire Now
        </a>
      </div>
    </div>
  );
}
