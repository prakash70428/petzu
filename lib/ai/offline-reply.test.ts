import { describe, expect, it } from "vitest";
import { offlineReply } from "./offline-reply";

describe("offlineReply", () => {
  it("puts urgent symptoms first, whatever else is asked", () => {
    expect(offlineReply("my dog swallowed a sock, which vet?")).toContain("call a vet or an emergency clinic now");
    expect(offlineReply("My cat is not eating since yesterday")).toContain("urgent");
  });

  it("points to the page for the question", () => {
    expect(offlineReply("How do I set a reminder for his tablets?")).toContain("/health");
    expect(offlineReply("Where can I find a groomer?")).toContain("/services/grooming");
    expect(offlineReply("Do you deliver dog food?")).toContain("Buy on Amazon");
  });

  it("falls back to the main sections, never to a dead end", () => {
    const reply = offlineReply("hello");
    expect(reply).toContain("/community");
    expect(reply).toContain("/contact");
  });

  it("never uses em dashes", () => {
    for (const message of ["vet", "groom", "buy food", "hello", "poison"]) {
      expect(offlineReply(message)).not.toContain("—");
    }
  });
});
