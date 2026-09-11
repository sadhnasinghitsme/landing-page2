import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { AboutStrip } from "./components/AboutStrip";
import { WhySks } from "./components/WhySks";
import { Programmes } from "./components/Programmes";
import { BeyondCurriculum } from "./components/BeyondCurriculum";
import { Stats } from "./components/Stats";
import { AdmissionProcess } from "./components/AdmissionProcess";
import { Testimonials } from "./components/Testimonials";
import { Location } from "./components/Location";
import { GrowingGroup } from "./components/GrowingGroup";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { MobileBar } from "./components/MobileBar";
import { EnquiryPopup } from "./components/EnquiryPopup";
import { FloatingCta } from "./components/FloatingCta";
import { content } from "@/lib/content";

export default function Page() {
  const { school } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: school.name,
    description: content.hero.intro,
    url: "https://sksworldschoolnoida.ac.in/",
    telephone: `+91${content.contact.phones[0]}`,
    email: content.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. SS, Sector 137",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201305",
      addressCountry: "IN",
    },
    parentOrganization: { "@type": "Organization", name: school.trust },
    sameAs: Object.values(content.social),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="pb-16 md:pb-0">
        <Hero />
        <AboutStrip />
        <WhySks />
        <Programmes />
        <BeyondCurriculum />
        <Stats />
        <AdmissionProcess />
        <Testimonials />
        <Location />
        <GrowingGroup />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
      <FloatingCta />
      <EnquiryPopup />
    </>
  );
}
