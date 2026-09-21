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
            width={1448}
            height={1086}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {keyFactors.map((f) => (
          <li
            key={f.title}
            className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm"
          >
            <Image
              src={f.image}
              alt={f.title}
              width={600}
              height={450}
              sizes="(max-width: 640px) 50vw, 25vw"
              className="aspect-[4/3] w-full object-cover"
            />
            <p className="px-4 py-4 text-sm font-semibold leading-snug text-ink">
              {f.title}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
