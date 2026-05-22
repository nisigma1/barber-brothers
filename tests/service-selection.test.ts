import { describe, expect, it } from "vitest";

import {
  ADD_ONS,
  ALL_IN_ONE_SERVICE_ID,
  DEFAULT_SERVICE_ID,
  FACE_TREATMENT_SERVICE_ID,
  SERVICES,
  getBookingService,
  isValidServiceSelection,
} from "@/lib/constants";

describe("service catalogue", () => {
  it("has the expected four bookable services", () => {
    expect(SERVICES.map((s) => s.id).sort()).toEqual(
      ["all-in-one", "beard-trim", "face-treatment", "haircut"].sort(),
    );
  });

  it("haircut and beard-trim are 30 min main services", () => {
    const haircut = SERVICES.find((s) => s.id === "haircut")!;
    const beard = SERVICES.find((s) => s.id === "beard-trim")!;
    expect(haircut.durationMinutes).toBe(30);
    expect(haircut.price).toBe(5);
    expect(beard.durationMinutes).toBe(30);
    expect(beard.price).toBe(2);
  });

  it("face-treatment and all-in-one are 60 min", () => {
    const face = SERVICES.find((s) => s.id === "face-treatment")!;
    const allInOne = SERVICES.find((s) => s.id === "all-in-one")!;
    expect(face.durationMinutes).toBe(60);
    expect(face.price).toBe(15);
    expect(allInOne.durationMinutes).toBe(60);
    expect(allInOne.price).toBe(15);
  });

  it("premium product add-on is 0 min / 6 EUR", () => {
    const premium = ADD_ONS.find((a) => a.id === "premium-product")!;
    expect(premium.durationMinutes).toBe(0);
    expect(premium.price).toBe(6);
  });
});

describe("isValidServiceSelection", () => {
  it("empty selection falls back to default haircut and stays valid", () => {
    expect(isValidServiceSelection({ serviceIds: [] })).toBe(true);
  });

  it("rejects selection composed only of unknown ids", () => {
    expect(
      isValidServiceSelection({ serviceIds: ["pedicure", "manicure"] as never }),
    ).toBe(false);
  });

  it("accepts single main service", () => {
    expect(isValidServiceSelection({ serviceIds: ["haircut"] })).toBe(true);
    expect(isValidServiceSelection({ serviceIds: ["beard-trim"] })).toBe(true);
  });

  it("accepts haircut + beard-trim combo", () => {
    expect(isValidServiceSelection({ serviceIds: ["haircut", "beard-trim"] })).toBe(true);
  });

  it("accepts haircut + beard-trim + premium product", () => {
    expect(
      isValidServiceSelection({
        serviceIds: ["haircut", "beard-trim"],
        addOnIds: ["premium-product"],
      }),
    ).toBe(true);
  });

  it("all-in-one must be alone (no extra services, no add-ons)", () => {
    expect(isValidServiceSelection({ serviceIds: [ALL_IN_ONE_SERVICE_ID] })).toBe(true);
    expect(
      isValidServiceSelection({ serviceIds: [ALL_IN_ONE_SERVICE_ID, "haircut"] }),
    ).toBe(false);
    expect(
      isValidServiceSelection({
        serviceIds: [ALL_IN_ONE_SERVICE_ID],
        addOnIds: ["premium-product"],
      }),
    ).toBe(false);
  });

  it("face-treatment may combine with haircut but not beard-trim", () => {
    expect(
      isValidServiceSelection({
        serviceIds: [FACE_TREATMENT_SERVICE_ID, "haircut"],
      }),
    ).toBe(true);
    expect(
      isValidServiceSelection({
        serviceIds: [FACE_TREATMENT_SERVICE_ID, "beard-trim"],
      }),
    ).toBe(false);
  });

  it("face-treatment add-ons are blocked", () => {
    expect(
      isValidServiceSelection({
        serviceIds: [FACE_TREATMENT_SERVICE_ID],
        addOnIds: ["premium-product"],
      }),
    ).toBe(false);
  });
});

describe("getBookingService duration and pricing", () => {
  it("haircut alone is 30 min / 5 EUR", () => {
    const service = getBookingService({ serviceIds: ["haircut"] });
    expect(service.durationMinutes).toBe(30);
    expect(service.price).toBe(5);
  });

  it("haircut + beard-trim stays 30 min / 7 EUR", () => {
    const service = getBookingService({ serviceIds: ["haircut", "beard-trim"] });
    expect(service.durationMinutes).toBe(30);
    expect(service.price).toBe(7);
  });

  it("haircut + premium product stays 30 min / 11 EUR", () => {
    const service = getBookingService({ serviceIds: ["haircut"], addOnIds: ["premium-product"] });
    expect(service.durationMinutes).toBe(30);
    expect(service.price).toBe(11);
  });

  it("beard-trim + premium product stays 30 min / 8 EUR", () => {
    const service = getBookingService({
      serviceIds: ["beard-trim"],
      addOnIds: ["premium-product"],
    });
    expect(service.durationMinutes).toBe(30);
    expect(service.price).toBe(8);
  });

  it("haircut + beard-trim + premium product stays 30 min / 13 EUR", () => {
    const service = getBookingService({
      serviceIds: ["haircut", "beard-trim"],
      addOnIds: ["premium-product"],
    });
    expect(service.durationMinutes).toBe(30);
    expect(service.price).toBe(13);
  });

  it("all-in-one is 60 min / 15 EUR", () => {
    const service = getBookingService({ serviceIds: [ALL_IN_ONE_SERVICE_ID] });
    expect(service.durationMinutes).toBe(60);
    expect(service.price).toBe(15);
  });

  it("face-treatment + haircut is 60 min / 20 EUR", () => {
    const service = getBookingService({
      serviceIds: [FACE_TREATMENT_SERVICE_ID, "haircut"],
    });
    expect(service.durationMinutes).toBe(60);
    expect(service.price).toBe(20);
  });

  it("default selection falls back to haircut", () => {
    const service = getBookingService(DEFAULT_SERVICE_ID);
    expect(service.id).toBe("haircut");
  });

  it("throws on invalid combo (all-in-one + haircut)", () => {
    expect(() =>
      getBookingService({ serviceIds: [ALL_IN_ONE_SERVICE_ID, "haircut"] }),
    ).toThrow();
  });
});
