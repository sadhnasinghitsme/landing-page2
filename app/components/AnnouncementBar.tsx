import { content } from "@/lib/content";

export function AnnouncementBar() {
  const phone = content.contact.phones[0];

  return (
    <div className="bg-black text-white">
      <div className="container-page flex min-h-9 items-center justify-center gap-4 py-2 text-xs leading-tight sm:justify-between sm:text-[13px]">
        <p className="hidden whitespace-nowrap sm:block">
          CBSE Affiliated &middot; Affiliation No. 2134003
        </p>
        <p className="whitespace-nowrap">
          Admission Helpline:{" "}
          <a href={`tel:+91${phone}`} className="font-semibold text-white hover:underline">
            +91-{phone}
          </a>
        </p>
      </div>
    </div>
  );
}
