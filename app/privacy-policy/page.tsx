import type { Metadata } from "next";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { EnquiryPopup } from "../components/EnquiryPopup";
import { FloatingButtons } from "../components/FloatingButtons";
import { content } from "@/lib/content";

const { school } = content;

export const metadata: Metadata = {
  title: `Privacy Policy — ${school.name}, Noida`,
  description: `How ${school.name} collects, uses, and protects information provided by visitors to this website.`,
  alternates: { canonical: "/privacy-policy" },
};

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "Information We Collect",
    body: (
      <>
        <p>The institution may gather the following data:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Name, email address, phone number submitted through contact or enquiry forms</li>
          <li>Information provided voluntarily by parents, students, or visitors</li>
          <li>Basic technical data such as IP address, browser type, and pages visited (for website analytics)</li>
        </ul>
      </>
    ),
  },
  {
    heading: "How We Use the Information",
    body: (
      <>
        <p>The information collected is used to:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Respond to enquiries and communication requests</li>
          <li>Provide school-related information and updates</li>
          <li>Improve website functionality and user experience</li>
          <li>Maintain internal records</li>
        </ul>
        <p className="mt-3">
          Where you have provided consent, we may also send promotional and marketing
          communications through channels such as Google Ads, RCS, Facebook Ads, SMS, voice and
          broadcasting calls, WhatsApp, and other approved communication platforms.
        </p>
      </>
    ),
  },
  {
    heading: "Cookies",
    body: (
      <p>
        Our website may use cookies to enhance user experience. Cookies help us understand how
        visitors use the site. Users can choose to disable cookies through their browser settings.
      </p>
    ),
  },
  {
    heading: "Data Protection",
    body: (
      <p>
        We take reasonable steps to protect personal information from unauthorized access,
        misuse, or disclosure. However, no method of transmission over the internet is completely
        secure.
      </p>
    ),
  },
  {
    heading: "Sharing of Information",
    body: (
      <p>
        We do not sell, trade, or rent personal information to third parties. Information may be
        shared only when required by law or government authorities.
      </p>
    ),
  },
  {
    heading: "External Links",
    body: (
      <p>
        Our website may contain links to external websites. We are not responsible for the
        privacy practices or content of those websites.
      </p>
    ),
  },
  {
    heading: "Changes to This Policy",
    body: <p>This Privacy Policy may be updated from time to time. Changes will be posted on this page.</p>,
  },
  {
    heading: "Contact Information",
    body: (
      <p>
        If you have any questions regarding this Privacy Policy, please contact us through the
        details provided on this website.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pb-16 md:pb-0">
        <section className="bg-paper">
          <div className="container-page py-16 sm:py-20">
            <p className="eyebrow">{school.name}</p>
            <h1 className="mt-2 font-display text-2xl text-brick sm:text-3xl">Privacy Policy</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/75 sm:text-base">
              {school.name} respects the privacy of all visitors to our website. This Privacy
              Policy explains how we collect, use, and protect information provided by users
              while accessing our website.
            </p>

            <div className="mt-10 max-w-3xl divide-y divide-ink/10 border-t border-ink/10">
              {sections.map((s, i) => (
                <div key={s.heading} className="py-7 first:pt-0">
                  <h2 className="font-display text-lg text-ink sm:text-xl">
                    {i + 1}. {s.heading}
                  </h2>
                  <div className="mt-2.5 text-[15px] leading-relaxed text-ink/75">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
      <EnquiryPopup />
    </>
  );
}
