import type { PaymentLink as PaymentLinkPrisma, Payment as PaymentPrisma } from "@prisma/client";

export interface Payment extends PaymentPrisma {
  id: string;            
  created_at: Date;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentInput extends Pick<
	Payment,
	'amount' | 'currency' | 'receipt'
> {};

export interface PaymentWithLinks extends Payment {
  links: Pick<PaymentLink, 'rel' | 'href'>[];
}

interface PaymentLink extends PaymentLinkPrisma {
  id: string
  paymentId: string,
  rel: string;
  href: string;
}

export const enum PaymentStatus {
  Pending    = 'PENDING',
  Complete   = 'COMPLETE',
  Refunded   = 'REFUNDED',
  Failed     = 'FAILED',
  Cancelled  = 'CANCELLED',
  Authorized = 'AUTHORIZED',
}
