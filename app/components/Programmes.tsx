import Image from "next/image";
import { content } from "@/lib/content";

export function Programmes() {
  const { programmes } = content;

  return (
    <section id="programmes" className="bg-sand">
      <div className="container-page py-16 sm:py-20">
        <p className="eyebrow">Curriculum</p>
        <h2 className="mt-2 text-3xl text-brick sm:text-4xl">{programmes.heading}</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          {programmes.subheading}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {programmes.items.map((p) => (
            <article
              key={p.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm"
            >
              <Image
                src={p.image}
                alt={p.title}
                width={1448}
                height={1086}
                sizes="(max-width: 640px) 100vw, 33vw"
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
