export type TemplateData = Record<string, string>;

export interface RenderedMessage {
  subject?: string;
  body: string;
  whatsappTemplateName: string;
}

export type TemplateRenderer = (data: TemplateData) => RenderedMessage;
