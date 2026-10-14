import { submitEnquiry } from "@/features/enquiries/submit";

export type DataRequestKind = "export" | "delete";

/**
 * Customer sign-in isn't verified yet (see AUTH.md), so a browser asking for
 * "my data" can't prove whose data it is. Instead of acting on any email,
 * the request goes to the team, who confirm by email with the address on
 * the account and then export or delete from the admin customer page.
 */
export function requestMyData(kind: DataRequestKind, name: string, email: string) {
  return submitEnquiry({
    kind: "GENERAL",
    name,
    email,
    message:
      kind === "export"
        ? "Data request: please send me a copy of my PetZu data (profile, consents, chats, messages and feedback)."
        : "Data request: please delete my PetZu account and all data linked to it.",
  });
}
