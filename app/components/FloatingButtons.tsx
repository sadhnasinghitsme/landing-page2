import { FloatingCta } from "./FloatingCta";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Single fixed bottom-right anchor for both floating CTAs, stacked
 * vertically with a gap so neither overlaps the other: Admission Enquiry
 * on top, WhatsApp closest to the corner. Sits above the mobile Call/Enquire
 * bar (bottom-0, full-width, md:hidden) by lifting up on small screens.
 */
export function FloatingButtons() {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <FloatingCta />
      <WhatsAppButton />
    </div>
  );
}
