import { z } from "zod";

const barberIdSchema = z.enum(["barber-1", "barber-2"]);

export const availabilityQuerySchema = z.object({
  barberId: barberIdSchema,
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const bookingRequestSchema = z.object({
  submissionId: z.uuid(),
  barberId: barberIdSchema,
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  phoneNumber: z.string().trim().min(1).max(32),
  website: z.string().trim().max(120).optional().default(""),
});

export function normalizeKosovoPhone(value: string): string | null {
  const sanitized = value.replace(/[^\d+]/g, "");

  if (/^\+383\d{8}$/.test(sanitized)) {
    return sanitized;
  }

  if (/^0\d{8}$/.test(sanitized)) {
    return `+383${sanitized.slice(1)}`;
  }

  return null;
}
