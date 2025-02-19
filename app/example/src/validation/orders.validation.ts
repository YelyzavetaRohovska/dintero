import { z } from "zod";

export const createPaymentSchema = z.object({
	amount: z.number().positive({ message: "Amount must be a positive number" }),
	currency: z.string().min(1, { message: "Unsupported currency provided" }),
	receipt: z.string().min(1, { message: "Receipt is required" }),
});

export const paramsPaymentSchema = z.object({
  id: z.string().uuid(),
});
