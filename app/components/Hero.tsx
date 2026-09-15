import { content } from "@/lib/content";
import { EnquiryForm } from "./EnquiryForm";
import { HeroCarousel } from "./HeroCarousel";

export function Hero() {
  const { hero, images } = content;
  const [l1, l2, l3] = hero.headlineLines;

  return (
    <section className="relative isolate bg-brick-700 lg:min-h-[600px]">
      <HeroCarousel images={images.heroCarousel} />

      <div className="container-page grid items-center gap-10 pb-16 pt-14 sm:pt-16 lg:grid-cols-[1fr_minmax(350px,420px)] lg:gap-12 lg:pb-24 lg:pt-24">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">{l1}</span>
            <span className="block text-flame">{l2}</span>
            <span className="block">{l3}</span>
          </h1>

          <p className="mt-5 text-base text-white/80 sm:text-lg">{hero.subhead}</p>

          <span className="mt-6 block h-px w-24 bg-flame" />
        </div>

        <div className="lg:-mb-28">
          <div id="enquiry" className="scroll-mt-28">
            <EnquiryForm pill />
          </div>
        </div>
      </div>
    </section>
  );
}
