import { content, telHref } from "@/lib/content";
import { EnquiryForm } from "./EnquiryForm";

export function FinalCta() {
  const { contact, hero } = content;

  return (
    <section className="bg-brick text-white">
      <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame">
            {hero.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl text-white sm:text-4xl">
            Admissions Open 2026-27: Pre-Nursery to Class 5
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/80">
            Call or enquire today to book a campus visit at Sector 137, Noida.
          </p>

          <div className="mt-8 space-y-3 text-sm">
            {contact.phones.map((p) => (
              <a key={p} href={telHref(p)} className="flex items-center gap-3 font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  ☎
                </span>
                {p}
              </a>
            ))}
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 font-semibold break-all"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                @
              </span>
              {contact.email}
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-paper p-5 text-ink sm:p-6">
          <EnquiryForm compact />
        </div>
      </div>
    </section>
  );
}
