const EVENT_NAME = "sks:open-enquiry-popup";

export function openEnquiryPopup() {
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function onOpenEnquiryPopup(handler: () => void) {
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
