import Image from "next/image";
import { content, telHref } from "@/lib/content";

export function Location() {
  const { contact, images, school } = content;

  return (
    <section id="location" className="container-page py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="eyebrow">Visit us</p>
          <h2 className="mt-2 text-3xl text-brick sm:text-4xl">
            Right Opposite Sector 137 Metro Station
          </h2>

          <address className="mt-5 space-y-1 text-[15px] not-italic leading-relaxed text-ink/75">
            {contact.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-ink/50">Phone</dt>
              <dd>
                {contact.phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 && <span className="text-ink/30">, </span>}
                    <a href={telHref(p)} className="font-medium text-brick">
                      {p}
                    </a>
                  </span>
                ))}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink/50">Hours</dt>
              <dd className="text-ink/75">{contact.officeHours}</dd>
            </div>
          </dl>

          <a
            href={contact.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-6"
          >
            Open in Google Maps
          </a>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-card">
            <Image
              src={images.campus}
              alt={`${school.name} campus`}
              width={768}
              height={299}
              className="h-48 w-full object-cover sm:h-56"
            />
          </div>
          <div className="relative h-64 overflow-hidden rounded-2xl border border-ink/10 bg-sand shadow-card">
            <span className="absolute inset-0 flex items-center justify-center text-sm text-ink/45">
              Loading map…
            </span>
            <iframe
              title={`Map to ${school.name}`}
              src={contact.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="relative h-64 w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
