/**
 * Answers when the AI model can't be reached (no ANTHROPIC_API_KEY, or the
 * API is down). Instead of "the chatbot isn't set up", it points to the
 * right page for the question, which is most of what a support chat does.
 * Rules are checked in order; the first match wins.
 */
interface Route {
  words: RegExp;
  reply: string;
}

const URGENT =
  /poison|swallow|choking|can'?t breathe|not breathing|breathing hard|bleeding|collapse|seizure|fit\b|unconscious|hit by|vomiting blood|not eating|stopped eating|won'?t eat/i;

const routes: Route[] = [
  {
    words: /medicine|medication|tablet|dose|prescription|reminder|record|report|blood ?work|scan|x-?ray/i,
    reply:
      "You can keep your pet's medicines, prescriptions, lab reports and scans at /health. Add a medicine with its morning or evening time and you'll get a reminder on this device. To buy medicines, the prescription in your records has a \"Buy medicines nearby\" button that opens pharmacies near you.",
  },
  {
    words: /vet|doctor|clinic|vaccin|check-?up|sick|ill\b|emergency|hospital/i,
    reply:
      "To find a vet, open /services/vet-booking and tap \"Near me\" (or type your area or PIN code) to see clinics on the map. You can also book a video or in-clinic visit with a PetZu partner vet there. Not sure which vet is good? Ask other pet parents at /community.",
  },
  {
    words: /groom|bath|haircut|nail|spa|shed/i,
    reply: "Groomers are at /services/grooming. If your pet is nervous, look for a groomer who mentions gentle handling, and ask the community at /community who they trust.",
  },
  { words: /train|bite|biting|bark|leash|potty|toilet|recall|behaviou?r/i, reply: "Trainers and behaviourists are at /services/training. The care guides at /guides also cover house training and common behaviour problems." },
  { words: /sit(ter|ting)|walk(er|ing)|holiday|boarding|travel|away/i, reply: "Pet sitters and walkers are at /services/sitting, and boarding and pet-friendly stays at /services/holidays." },
  { words: /insur/i, reply: "Pet insurance plans, explained in plain language, are at /services/insurance." },
  { words: /adopt|rescue|new pet|get a (dog|cat|puppy|kitten)/i, reply: "Adoption is at /services/adoption. The care guides at /guides help with the first few weeks." },
  { words: /goodbye|put down|euthan|passed away|died|last journey|end of life/i, reply: "We're so sorry. The Last Journey at /services/the-last-journey covers gentle at-home care, aftercare and support for you. Take your time." },
  {
    words: /buy|order|product|food|treat|toy|bed|deliver|shipping|return|refund|amazon|price/i,
    reply:
      "PetZu picks products but doesn't sell or ship them: each product at /shop has a \"Buy on Amazon\" button, and Amazon handles price, delivery and returns. Wondering if a food is actually good? Ask other pet parents at /community.",
  },
  { words: /communit|forum|ask (other|people)|question/i, reply: "Ask other pet parents at /community. You only need your name and email, and you can filter by animal and topic." },
  { words: /partner|business|list my|clinic owner|join as/i, reply: "Businesses can partner with PetZu at /partners." },
  { words: /account|sign ?in|log ?in|password|sign ?up|register/i, reply: "Sign in at /sign-in or create an account at /sign-up. You don't need an account for the community, the chat or health records." },
  { words: /delete|my data|privacy|export/i, reply: "You can export or delete your data from /dashboard/settings once signed in. The privacy policy is at /privacy." },
];

export function offlineReply(message: string): string {
  if (URGENT.test(message)) {
    return "This could be urgent. Please call a vet or an emergency clinic now rather than waiting. To find the nearest clinic, open /services/vet-booking and tap \"Near me\".";
  }
  const route = routes.find((r) => r.words.test(message));
  if (route) return route.reply;
  return "I can point you to the right place: vets (/services/vet-booking), the community (/community), health records and medicine reminders (/health), care guides (/guides) or products (/shop). If none of those help, the PetZu team is at /contact.";
}
