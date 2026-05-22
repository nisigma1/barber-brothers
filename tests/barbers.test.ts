import { describe, expect, it } from "vitest";

import {
  ACTIVE_BARBERS,
  ACTIVE_BARBER_IDS,
  BARBERS,
  getBarberDisplayName,
  getBarberProfile,
  isActiveBarberId,
} from "@/lib/barbers";

describe("barbers central config", () => {
  it("exposes exactly 5 barbers in active order", () => {
    expect(ACTIVE_BARBERS).toHaveLength(5);
    expect(ACTIVE_BARBERS.map((b) => b.displayName)).toEqual([
      "Uraniku",
      "Hysi",
      "Ylli",
      "Edi",
      "Arti",
    ]);
  });

  it("keeps every barber active and ordered uniquely", () => {
    const orders = ACTIVE_BARBERS.map((b) => b.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect(ACTIVE_BARBERS.every((b) => b.active)).toBe(true);
  });

  it("uses stable barber-N ids and matching pin env keys", () => {
    expect(ACTIVE_BARBER_IDS).toEqual(["barber-1", "barber-2", "barber-3", "barber-4", "barber-5"]);
    for (const barber of ACTIVE_BARBERS) {
      expect(barber.staffPinEnvKey).toBe(`STAFF_PIN_${barber.id.toUpperCase().replace("-", "_")}`);
    }
  });

  it("isActiveBarberId accepts only known ids", () => {
    expect(isActiveBarberId("barber-1")).toBe(true);
    expect(isActiveBarberId("barber-5")).toBe(true);
    expect(isActiveBarberId("barber-99")).toBe(false);
    expect(isActiveBarberId("")).toBe(false);
    expect(isActiveBarberId(null)).toBe(false);
    expect(isActiveBarberId(undefined)).toBe(false);
    expect(isActiveBarberId(1)).toBe(false);
  });

  it("getBarberProfile returns the right record or undefined", () => {
    expect(getBarberProfile("barber-3")?.displayName).toBe("Ylli");
    expect(getBarberProfile("barber-99")).toBeUndefined();
  });

  it("getBarberDisplayName falls back gracefully", () => {
    expect(getBarberDisplayName("barber-2")).toBe("Hysi");
    expect(getBarberDisplayName("ghost", "Staff")).toBe("Staff");
  });

  it("BARBERS source array matches active ids when all active", () => {
    expect(BARBERS.map((b) => b.id)).toEqual(ACTIVE_BARBER_IDS);
  });
});
