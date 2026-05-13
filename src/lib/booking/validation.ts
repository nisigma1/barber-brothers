import { z } from "zod";

const barberIdSchema = z.enum(["barber-1", "barber-2"]);
const customerNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[\p{L}\s.'-]+$/u);

export const availabilityQuerySchema = z.object({
  barberId: barberIdSchema,
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const bookingRequestSchema = z.object({
  submissionId: z.uuid(),
  barberId: barberIdSchema,
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: customerNameSchema,
  lastName: customerNameSchema,
  phoneNumber: z.string().trim().min(1).max(32),
  website: z.string().trim().max(120).optional().default(""),
});
