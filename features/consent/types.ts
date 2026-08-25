export type ConsentChannel = "EMAIL" | "SMS" | "WHATSAPP";
export type ConsentPurpose = "MARKETING" | "TRANSACTIONAL" | "SUPPORT";

export interface ConsentRecord {
  id: string;
  customerId: string;
  channel: ConsentChannel;
  purpose: ConsentPurpose;
  granted: boolean;
  source: string;
  updatedAt: string;
}

/** A single toggle cell in the settings consent grid. */
export interface ConsentCell {
  channel: ConsentChannel;
  purpose: ConsentPurpose;
  granted: boolean;
}
