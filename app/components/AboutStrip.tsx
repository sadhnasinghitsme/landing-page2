import Image from "next/image";
import { content, telHref } from "@/lib/content";

export function AboutStrip() {
  const { welcome, school, contact, about, philosophy, images } = content;

  const facts = [
    { label: "Board", value: `CBSE · Affiliation No. ${school.affiliationNo}` },
    { label: "Campus", value: "Opp. Sector 137 Metro Station" },
    {
      label: "Admissions desk",
      value: contact.phones[0],
      href: telHref(contact.phones[0]),
    },
  ];

  return (
    <section id="about" className="bg-paper">
      <div className="container-page py-16 sm:py-20">
        {/* 1 — About SKS World School */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-12">
          <div>
            <p className="eyebrow">About the school</p>
            <h2 className="mt-2 font-display text-2xl text-brick sm:text-3xl">
              About SKS World School, Noida Sector 137 (CBSE, Class 6 to 12)
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75 sm:text-base">
              {welcome.paragraphs[0]}
            </p>

            <dl className="mt-8 grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3">
              {facts.map((it) => (
                <div key={it.label}>
                  <dt className="eyebrow">{it.label}</dt>
                  <dd className="mt-1.5 font-display text-lg text-ink">
                    {it.href ? (
                      <a href={it.href} className="text-brick hover:text-flame-600">
                        {it.value}
                      </a>
                    ) : (
                      it.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-card">
            <Image
              src={images.aboutPhoto}
              alt="SKS World School campus building, Sector 137 Noida"
              width={1448}
              height={1086}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>

        {/* 2 — Prime Location */}
        <div className="mt-14 border-t border-ink/10 pt-10">
          <h3 className="font-display text-xl text-brick sm:text-2xl">
            Location: Opposite Sector 137 Metro Station, Noida Expressway
          </h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/75">
            {about.locationCopy}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {about.proximity.map((p) => (
              <li
                key={p.place}
                className="rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-sm"
              >
                <span className="font-display font-semibold text-lagoon-700">
                  {p.distance}
                </span>
                <span className="text-ink/40"> — </span>
                <span className="text-ink/75">{p.place}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 — Our Philosophy */}
        <div className="mt-14 border-t border-ink/10 pt-10">
          <h3 className="font-display text-xl text-brick sm:text-2xl">
            {philosophy.heading}
          </h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/75">
            {philosophy.statement}
          </p>

          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            {philosophy.values.map((v) => (
              <div key={v.name} className="border-l-2 border-flame pl-4">
                <dt className="font-display text-base font-semibold text-ink">
                  {v.name}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink/70">{v.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
