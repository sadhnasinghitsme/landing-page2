"use client";

import Image from "next/image";
import Link from "next/link";
import { content, telHref } from "@/lib/content";
import { openEnquiryPopup } from "@/lib/enquiryPopup";

export function Header() {
  const { images, school, contact } = content;
  const phone = contact.phones[0];

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label={`${school.name} home`}>
          <Image
            src={images.logo}
            alt={`${school.name} logo`}
            width={308}
            height={90}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={telHref(phone)}
            className="hidden items-center gap-2 text-sm font-semibold text-brick sm:inline-flex"
          >
            <PhoneIcon />
            {phone}
          </a>
          <a
            href="#enquiry"
            onClick={(e) => {
              e.preventDefault();
              openEnquiryPopup();
            }}
            className="btn-dark px-4 py-2.5 text-[13px] sm:px-5 sm:text-sm"
          >
            Admission Enquiry
          </a>
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5c.5 0 .9.3 1 .8l.9 3c.1.4 0 .8-.3 1L6.8 12a13 13 0 0 0 5.2 5.2l1.7-1.3c.3-.2.7-.3 1-.2l3 .9c.5.1.8.5.8 1V21c0 .6-.5 1-1 1A17 17 0 0 1 3 6c0-.6.4-1 1-1h2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
