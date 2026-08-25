import type { RenderedMessage, TemplateData } from "./types";

export function orderConfirmationTemplate(data: TemplateData): RenderedMessage {
  return {
    subject: `Order ${data.orderNumber ?? ""} confirmed`,
    body: `Your PetZu order ${data.orderNumber ?? ""} is confirmed — total ${data.total ?? ""}. We'll let you know the moment it ships.`,
    whatsappTemplateName: "order_confirmation",
  };
}
