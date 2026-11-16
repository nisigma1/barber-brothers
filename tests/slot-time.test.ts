import { describe, expect, it } from "vitest";

import {
  buildSlotKey,
  generateDailySlotTimes,
  getAvailabilitySlots,
  getEndLocalTime,
  getRequiredSlotKeys,
  getRequiredSlotTimes,
  isShopClosedOnDate,
  isValidSlotTime,
  minutesToTime,
  timeToMinutes,
} from "@/lib/booking/time";
import { ALL_IN_ONE_SERVICE_ID } from "@/lib/constants";

describe("time utilities", () => {
  it("minutesToTime/timeToMinutes round-trip", () => {
    expect(minutesToTime(570)).toBe("09:30");
    expect(timeToMinutes("09:30")).toBe(570);
    expect(minutesToTime(timeToMinutes("20:00"))).toBe("20:00");
  });
});

describe("daily slot generation", () => {
  it("offers after-hours haircuts only after regular hours, finishing by 23:00", () => {
    const slots = generateDailySlotTimes("after-hours-haircut");
    expect(slots).toEqual(["20:30", "21:00", "21:30", "22:00", "22:30"]);
    expect(getEndLocalTime("22:30", "after-hours-haircut")).toBe("23:00");
  });

  it("reserves travel on both sides of an off-site haircut and respects existing locks", () => {
    const barberId = "barber-1";
    const date = "2026-06-01";
    const service = "off-site-haircut";
    expect(getRequiredSlotTimes("14:00", service)).toEqual(["13:30", "14:00", "14:30"]);
    expect(getEndLocalTime("14:00", service)).toBe("14:30");
    const bookedSlots = new Set([buildSlotKey(barberId, date, "13:30")]);
    const slots = getAvailabilitySlots(barberId, date, bookedSlots, service, new Date("2026-06-01T07:00:00Z"));
    expect(slots.find((slot) => slot.localTime === "14:00")?.available).toBe(false);
    expect(slots.find((slot) => slot.localTime === "14:30")?.available).toBe(true);
    expect(slots.map((slot) => slot.localTime)).not.toEqual(expect.arrayContaining(["12:00", "20:00"]));
  });

  it("offers 15-min beard trims on the existing grid without reopening booked slots", () => {
    const barberId = "barber-1";
    const date = "2026-06-01";
    const bookedSlots = new Set([buildSlotKey(barberId, date, "14:00")]);
    const slots = getAvailabilitySlots(barberId, date, bookedSlots, "beard-trim", new Date("2026-06-01T07:00:00Z"));

    expect(slots.find((slot) => slot.localTime === "14:00")).toMatchObject({ available: false });
    expect(slots.find((slot) => slot.localTime === "14:30")).toMatchObject({ available: true, endLocalTime: "14:45" });
    expect(slots.some((slot) => slot.localTime === "14:15")).toBe(false);
  });

  it("default 30-min service produces slots in 09:30-20:30 window with 12:30 break removed", () => {
    const slots = generateDailySlotTimes({ serviceId: "haircut" });
    expect(slots[0]).toBe("09:30");
    expect(slots).toContain("12:00");
    expect(slots).not.toContain("12:30");
    expect(slots).toContain("13:00");
    expect(slots).toContain("20:00");
    expect(slots).not.toContain("20:30");
  });

  it("all-in-one (60 min) drops 20:00 because it would run past 21:00", () => {
    const slots = generateDailySlotTimes({ serviceIds: [ALL_IN_ONE_SERVICE_ID] });
    expect(slots).not.toContain("20:00");
    expect(slots).not.toContain("20:30");
    expect(slots[0]).toBe("09:30");
  });
});

describe("isValidSlotTime", () => {
  it("accepts a normal 30-min slot at 14:00", () => {
    expect(isValidSlotTime("14:00", { serviceId: "haircut" })).toBe(true);
  });

  it("rejects 12:30 (lunch break)", () => {
    expect(isValidSlotTime("12:30", { serviceId: "haircut" })).toBe(false);
  });

  it("rejects all-in-one at 20:00 (would end past 21:00)", () => {
    expect(isValidSlotTime("20:00", { serviceIds: [ALL_IN_ONE_SERVICE_ID] })).toBe(false);
  });

  it("accepts all-in-one at 19:00", () => {
    expect(isValidSlotTime("19:00", { serviceIds: [ALL_IN_ONE_SERVICE_ID] })).toBe(true);
  });

  it("rejects garbage time strings", () => {
    expect(isValidSlotTime("25:99", { serviceId: "haircut" })).toBe(false);
    expect(isValidSlotTime("not-a-time", { serviceId: "haircut" })).toBe(false);
  });
});

describe("getEndLocalTime", () => {
  it("haircut at 14:00 ends at 14:30", () => {
    expect(getEndLocalTime("14:00", { serviceId: "haircut" })).toBe("14:30");
  });

  it("all-in-one at 14:00 ends at 15:00", () => {
    expect(getEndLocalTime("14:00", { serviceIds: [ALL_IN_ONE_SERVICE_ID] })).toBe("15:00");
  });
});

describe("getRequiredSlotTimes / getRequiredSlotKeys", () => {
  it("normal 30-min service locks a single slot", () => {
    expect(getRequiredSlotTimes("14:00", { serviceId: "haircut" })).toEqual(["14:00"]);
  });

  it("all-in-one locks two consecutive 30-min slots", () => {
    expect(getRequiredSlotTimes("14:00", { serviceIds: [ALL_IN_ONE_SERVICE_ID] })).toEqual([
      "14:00",
      "14:30",
    ]);
  });

  it("slot keys are scoped to a single barber id", () => {
    const keys = getRequiredSlotKeys(
      "barber-5",
      "2026-06-01",
      "14:00",
      { serviceIds: [ALL_IN_ONE_SERVICE_ID] },
    );
    expect(keys).toEqual([
      "barber-5__2026-06-01__14-00",
      "barber-5__2026-06-01__14-30",
    ]);
  });

  it("buildSlotKey replaces colons with hyphens", () => {
    expect(buildSlotKey("barber-1", "2026-06-01", "09:30")).toBe(
      "barber-1__2026-06-01__09-30",
    );
  });
});

describe("isShopClosedOnDate", () => {
  it("marks Sunday as closed (ISO weekday 7 → JS getDay 0)", () => {
    // 2026-05-24 is a Sunday in the Europe/Tirane calendar
    expect(isShopClosedOnDate("2026-05-24")).toBe(true);
  });

  it("monday-saturday are open", () => {
    expect(isShopClosedOnDate("2026-05-25")).toBe(false); // Mon
    expect(isShopClosedOnDate("2026-05-30")).toBe(false); // Sat
  });
});
