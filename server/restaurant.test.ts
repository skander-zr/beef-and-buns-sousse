import { describe, expect, it } from "vitest";
import { SERVICE_TIMES, calculateOrderTotal, isClosedDay, isServiceTime } from "./restaurant";

describe("Per Voi restaurant rules", () => {
  it("exposes the complete service window in 30-minute increments", () => {
    expect(SERVICE_TIMES[0]).toBe("12:00");
    expect(SERVICE_TIMES.at(-1)).toBe("22:30");
    expect(SERVICE_TIMES).toHaveLength(22);
    expect(isServiceTime("19:30")).toBe(true);
    expect(isServiceTime("23:00")).toBe(false);
  });

  it("is open 7 days a week", () => {
    expect(isClosedDay("2026-09-07")).toBe(false);
    expect(isClosedDay("2026-09-08")).toBe(false);
  });

  it("calculates the order total from persisted menu prices and quantities", () => {
    expect(calculateOrderTotal([{ priceDt: 22, quantity: 2 }, { priceDt: 41, quantity: 1 }])).toBe(85);
    expect(calculateOrderTotal([])).toBe(0);
  });
});
