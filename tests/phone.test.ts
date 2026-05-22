import { describe, expect, it } from "vitest";

import { normalizeKosovoPhone } from "@/lib/booking/phone";

describe("normalizeKosovoPhone", () => {
  it("accepts +383 followed by 8 digits", () => {
    expect(normalizeKosovoPhone("+38345990079")).toBe("+38345990079");
  });

  it("normalizes leading 0 to +383", () => {
    expect(normalizeKosovoPhone("045990079")).toBe("+38345990079");
  });

  it("strips spaces, parens, dashes", () => {
    expect(normalizeKosovoPhone("+383 (45) 990-079")).toBe("+38345990079");
    expect(normalizeKosovoPhone("045 990 079")).toBe("+38345990079");
  });

  it("rejects short or long numbers", () => {
    expect(normalizeKosovoPhone("04599")).toBeNull();
    expect(normalizeKosovoPhone("0459900790000")).toBeNull();
  });

  it("rejects non-Kosovo country codes", () => {
    expect(normalizeKosovoPhone("+44712345678")).toBeNull();
    expect(normalizeKosovoPhone("+12025551234")).toBeNull();
  });

  it("rejects empty / nullish inputs", () => {
    expect(normalizeKosovoPhone("")).toBeNull();
    expect(normalizeKosovoPhone("not a number")).toBeNull();
  });
});
