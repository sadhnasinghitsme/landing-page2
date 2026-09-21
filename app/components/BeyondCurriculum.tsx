import Image from "next/image";
import { content } from "@/lib/content";

export function BeyondCurriculum() {
  const { beyondCurriculum } = content;

  return (
    <section id="beyond" className="bg-paper">
      <div className="container-page py-16 sm:py-20">
        <p className="eyebrow">{beyondCurriculum.eyebrow}</p>
        <h2 className="mt-2 text-3xl text-brick sm:text-4xl">
          {beyondCurriculum.heading}
        </h2>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {beyondCurriculum.items.map((it) => (
            <li
              key={it.title}
              className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm"
            >
              <Image
                src={it.image}
                alt={it.title}
                width={600}
                height={400}
                sizes="(max-width: 640px) 50vw, 25vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <p className="px-4 py-4 text-center text-sm font-semibold leading-snug text-ink">
                {it.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
