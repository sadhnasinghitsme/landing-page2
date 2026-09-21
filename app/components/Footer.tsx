import Image from "next/image";
import Link from "next/link";
import { content, telHref } from "@/lib/content";

export function Footer() {
  const { school, contact, social, images, growingGroup } = content;
  const year = new Date().getFullYear();

  const socials: [string, string][] = [
    ["Facebook", social.facebook],
    ["Instagram", social.instagram],
    ["YouTube", social.youtube],
    ["LinkedIn", social.linkedin],
  ];

  return (
    <footer className="border-t border-ink/10 bg-sand">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src={images.logo}
            alt={`${school.name} logo`}
            width={308}
            height={90}
            className="h-11 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            {school.type} run under the aegis of the {school.trust}, led by its
            Chairman {school.chairman}. Affiliated to {school.board}, New Delhi —
            Affiliation No. {school.affiliationNo}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/50">
            Contact
          </h3>
          <address className="mt-3 space-y-1 text-sm not-italic text-ink/70">
            {contact.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <div className="mt-3 space-y-1 text-sm">
            {contact.phones.map((p) => (
              <a key={p} href={telHref(p)} className="block font-medium text-brick">
                {p}
              </a>
            ))}
            <a href={`mailto:${contact.email}`} className="block break-all font-medium text-brick">
              {contact.email}
            </a>
          </div>
          <p className="mt-3 text-xs text-ink/50">{contact.officeHours}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/50">
            Explore
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            <li><a href="#why" className="hover:text-brick">Why SKS World School</a></li>
            <li><a href="#admissions" className="hover:text-brick">Admission process</a></li>
            <li><a href="#location" className="hover:text-brick">Location &amp; connectivity</a></li>
            <li><a href="#enquiry" className="hover:text-brick">Admission enquiry</a></li>
            <li><Link href="/privacy-policy" className="hover:text-brick">Privacy policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/50">
            Our growing group
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            {growingGroup.campuses.map((c) => (
              <li key={c.name}>{c.name}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {socials.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink/70 hover:border-brick hover:text-brick"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {school.name}, Sector 137, Noida. CBSE Affiliation No. {school.affiliationNo}.
            All rights reserved. Managed by {school.trust}.
          </p>
          <p>
            Content sourced from{" "}
            <a
              href="https://sksworldschoolnoida.ac.in/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              sksworldschoolnoida.ac.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
