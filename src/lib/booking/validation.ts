import { z } from "zod";

import { ACTIVE_BARBER_IDS } from "@/lib/barbers";
import { OFF_SITE_CITIES } from "@/lib/booking/types";
import { getSelectedServiceIds, isValidServiceSelection } from "@/lib/constants";

const barberIdSchema = z
  .string()
  .refine((value) => ACTIVE_BARBER_IDS.includes(value), { message: "Invalid barber" });
const serviceIdSchema = z.enum(["haircut", "beard-trim", "face-treatment", "all-in-one"]);
const publicServiceIdSchema = z.enum([...serviceIdSchema.options, "after-hours-haircut", "off-site-haircut"]);
const addOnIdSchema = z.enum(["premium-product"]);
const closureReasonSchema = z.enum(["time-off", "medical-leave"]);
const customerNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[\p{L}\s.'-]+$/u);

export const availabilityQuerySchema = z.object({
  barberId: barberIdSchema,
  serviceId: publicServiceIdSchema.optional(),
  serviceIds: z.array(publicServiceIdSchema).optional(),
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
  serviceId: publicServiceIdSchema.optional(),
  serviceIds: z.array(publicServiceIdSchema).min(1).max(3).optional(),
  addOnIds: z.array(addOnIdSchema).max(1).optional().default([]),
  barberId: barberIdSchema,
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: customerNameSchema,
  lastName: customerNameSchema,
  phoneNumber: z.string().trim().min(1).max(32),
  website: z.string().trim().max(120).optional().default(""),
  visitCity: z.enum(OFF_SITE_CITIES).optional(),
  visitAddress: z.string().trim().min(5).max(200).optional(),
}).superRefine((value, context) => {
  const offSite = getSelectedServiceIds(value).includes("off-site-haircut");
  if (offSite ? !value.visitCity || !value.visitAddress : Boolean(value.visitCity || value.visitAddress)) {
    context.addIssue({ code: "custom", path: ["visitAddress"], message: "Invalid visit location" });
  }
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

export const barberClosureSchema = z.object({
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: closureReasonSchema,
});

export const barberClosureDeleteSchema = z.object({
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
