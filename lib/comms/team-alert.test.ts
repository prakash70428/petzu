import { afterEach, describe, expect, it, vi } from "vitest";
import { excerpt, normaliseWhatsAppNumber, notifyTeam, whatsappSummary } from "./team-alert";

const env = { ...process.env };
afterEach(() => {
  process.env = { ...env };
  vi.unstubAllGlobals();
});

const alert = {
  kind: "booking" as const,
  title: "Booking request PZ-482913: Wellness exam with Dr. Meera Rao",
  from: "Asha Rao <asha@example.test>",
  excerpt: "Itching for two weeks,\nworse after walks",
  path: "/admin/feedback",
};

describe("whatsappSummary", () => {
  it("is one line that WhatsApp templates accept, with the admin link", () => {
    const summary = whatsappSummary(alert);
    expect(summary).not.toMatch(/[\n\t]| {4,}/);
    expect(summary).toContain("New booking request: Booking request PZ-482913");
    expect(summary).toContain("https://thepetzu.com/admin/feedback");
    expect(summary.length).toBeLessThanOrEqual(900);
  });
});

describe("normaliseWhatsAppNumber", () => {
  it("adds India's code to a 10-digit mobile and strips formatting", () => {
    expect(normaliseWhatsAppNumber("98765 43210")).toBe("919876543210");
    expect(normaliseWhatsAppNumber("+91-98765-43210")).toBe("919876543210");
    expect(normaliseWhatsAppNumber("123")).toBeNull();
  });
});

describe("excerpt", () => {
  it("flattens and shortens", () => {
    expect(excerpt("a\n\nb   c")).toBe("a b c");
    expect(excerpt("x".repeat(300)).length).toBe(160);
  });
});

describe("notifyTeam", () => {
  it("sends a template message to every team number and never throws", async () => {
    process.env.WHATSAPP_ACCESS_TOKEN = "token";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "123";
    process.env.TEAM_WHATSAPP_NUMBERS = "9876543210, +44 7700 900123";
    delete process.env.RESEND_API_KEY;
    const calls: { url: string; body: { to: string; template: { name: string } } }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init: { body: string }) => {
        calls.push({ url, body: JSON.parse(init.body) });
        return new Response(JSON.stringify({ messages: [{ id: "wamid" }] }), { status: 200 });
      }),
    );
    await notifyTeam(alert);
    expect(calls.map((c) => c.body.to)).toEqual(["919876543210", "447700900123"]);
    expect(calls[0].body.template.name).toBe("team_alert");
  });

  it("does nothing, quietly, when nothing is configured", async () => {
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.RESEND_API_KEY;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await expect(notifyTeam(alert)).resolves.toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("survives a WhatsApp error", async () => {
    process.env.WHATSAPP_ACCESS_TOKEN = "token";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "123";
    process.env.TEAM_WHATSAPP_NUMBERS = "9876543210";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { message: "template not approved" } }), { status: 400 })));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(notifyTeam(alert)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
