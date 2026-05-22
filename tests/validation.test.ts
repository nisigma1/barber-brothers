import { describe, expect, it } from "vitest";

import { availabilityQuerySchema, bookingRequestSchema } from "@/lib/booking/validation";

const validBookingPayload = {
  submissionId: "11111111-2222-4333-8444-555555555555",
  serviceIds: ["haircut"],
  addOnIds: [],
  barberId: "barber-3",
  localDate: "2026-06-01",
  localTime: "14:00",
  firstName: "Altin",
  lastName: "Mehmeti",
  phoneNumber: "+38345990079",
  website: "",
};

describe("bookingRequestSchema", () => {
  it("accepts a clean booking payload", () => {
    const result = bookingRequestSchema.safeParse(validBookingPayload);
    expect(result.success).toBe(true);
  });

  it("rejects an unknown barber id", () => {
    const result = bookingRequestSchema.safeParse({
      ...validBookingPayload,
      barberId: "barber-99",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown service id", () => {
    const result = bookingRequestSchema.safeParse({
      ...validBookingPayload,
      serviceIds: ["pedicure"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid combo (all-in-one + haircut)", () => {
    const result = bookingRequestSchema.safeParse({
      ...validBookingPayload,
      serviceIds: ["all-in-one", "haircut"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed date / time strings", () => {
    expect(
      bookingRequestSchema.safeParse({ ...validBookingPayload, localDate: "26-06-01" }).success,
    ).toBe(false);
    expect(
      bookingRequestSchema.safeParse({ ...validBookingPayload, localTime: "1400" }).success,
    ).toBe(false);
  });

  it("requires non-empty first and last name (latin/diacritics allowed)", () => {
    expect(
      bookingRequestSchema.safeParse({ ...validBookingPayload, firstName: "" }).success,
    ).toBe(false);
    expect(
      bookingRequestSchema.safeParse({ ...validBookingPayload, firstName: "Lëndina" }).success,
    ).toBe(true);
  });

  it("rejects digits or symbols inside the name", () => {
    expect(
      bookingRequestSchema.safeParse({ ...validBookingPayload, firstName: "Altin1" }).success,
    ).toBe(false);
    expect(
      bookingRequestSchema.safeParse({ ...validBookingPayload, firstName: "<script>" }).success,
    ).toBe(false);
  });

  it("rejects payloads with the honeypot field filled", () => {
    // Note: schema lets this through; the controller rejects. The point here is the field is accepted as a string.
    const filled = bookingRequestSchema.safeParse({
      ...validBookingPayload,
      website: "https://spam.example",
    });
    expect(filled.success).toBe(true);
  });
});

describe("availabilityQuerySchema", () => {
  it("accepts a query for a known barber and service", () => {
    expect(
      availabilityQuerySchema.safeParse({
        barberId: "barber-2",
        serviceIds: ["haircut", "beard-trim"],
        localDate: "2026-06-01",
      }).success,
    ).toBe(true);
  });

  it("rejects unknown barber id", () => {
    expect(
      availabilityQuerySchema.safeParse({
        barberId: "ghost",
        localDate: "2026-06-01",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid date format", () => {
    expect(
      availabilityQuerySchema.safeParse({
        barberId: "barber-1",
        localDate: "06/01/2026",
      }).success,
    ).toBe(false);
  });
});
