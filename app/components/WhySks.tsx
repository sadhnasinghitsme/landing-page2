import Image from "next/image";
import { content } from "@/lib/content";

export function WhySks() {
  const { keyFactors, welcome, images } = content;

  return (
    <section id="why" className="container-page py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-12">
        <div>
          <p className="eyebrow">Why SKS World School</p>
          <h2 className="mt-2 text-3xl text-brick sm:text-4xl">{welcome.heading}</h2>
          {/* paragraphs[0] is shown in the About strip under the hero */}
          {welcome.paragraphs[1] && (
            <p className="mt-4 text-[15px] leading-relaxed text-ink/75">
              {welcome.paragraphs[1]}
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-card">
          <Image
            src={images.whyPhoto}
            alt="Students attending a smartboard lesson in an SKS World School classroom"
            width={359}
            height={269}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {keyFactors.map((f) => (
          <li
            key={f.title}
            className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
          >
            <span className="flex h-16 w-16 items-center justify-center">
              <Image
                src={f.image}
                alt=""
                width={96}
                height={96}
                className="h-14 w-14 object-contain"
              />
            </span>
            <span className="text-sm font-semibold leading-snug text-ink">{f.title}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-ink/45">
        Key Factors as listed on the school&rsquo;s homepage.
      </p>
    </section>
  );
}
