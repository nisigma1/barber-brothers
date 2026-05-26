import { z } from "zod";

import { ACTIVE_BARBER_IDS } from "@/lib/barbers";
import { isValidServiceSelection } from "@/lib/constants";

const barberIdSchema = z
  .string()
  .refine((value) => ACTIVE_BARBER_IDS.includes(value), { message: "Invalid barber" });
const serviceIdSchema = z.enum(["haircut", "beard-trim", "face-treatment", "all-in-one"]);
const addOnIdSchema = z.enum(["premium-product"]);
const customerNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[\p{L}\s.'-]+$/u);

export const availabilityQuerySchema = z.object({
  barberId: barberIdSchema,
  serviceId: serviceIdSchema.optional(),
  serviceIds: z.array(serviceIdSchema).optional(),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).superRefine((value, context) => {
  if (!isValidServiceSelection({ serviceId: value.serviceId, serviceIds: value.serviceIds })) {
    context.addIssue({
      code: "custom",
      path: ["serviceIds"],
      message: "Invalid service selection",
    });
  }
});

export const staffQuickBookingSchema = z.object({
  serviceId: serviceIdSchema.optional(),
  serviceIds: z.array(serviceIdSchema).min(1).max(3).optional(),
  addOnIds: z.array(addOnIdSchema).max(1).optional().default([]),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: customerNameSchema,
  lastName: customerNameSchema,
}).superRefine((value, context) => {
  if (!isValidServiceSelection({
    serviceId: value.serviceId,
    serviceIds: value.serviceIds,
    addOnIds: value.addOnIds,
  })) {
    context.addIssue({
      code: "custom",
      path: ["serviceIds"],
      message: "Invalid service selection",
    });
  }
});

export const bookingRequestSchema = z.object({
  submissionId: z.uuid(),
  serviceId: serviceIdSchema.optional(),
  serviceIds: z.array(serviceIdSchema).min(1).max(3).optional(),
  addOnIds: z.array(addOnIdSchema).max(1).optional().default([]),
  barberId: barberIdSchema,
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: customerNameSchema,
  lastName: customerNameSchema,
  phoneNumber: z.string().trim().min(1).max(32),
  website: z.string().trim().max(120).optional().default(""),
}).superRefine((value, context) => {
  if (!isValidServiceSelection({
    serviceId: value.serviceId,
    serviceIds: value.serviceIds,
    addOnIds: value.addOnIds,
  })) {
    context.addIssue({
      code: "custom",
      path: ["serviceIds"],
      message: "Invalid service selection",
    });
  }
});
