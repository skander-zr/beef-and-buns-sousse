import { describe, expect, it } from "vitest";
import { templateParameters } from "./whatsapp";

describe("WhatsApp notification templates", () => {
  it("formats a reservation notification in the approved positional order", () => {
    expect(templateParameters({ kind: "reservation", id: 17, name: "Amira Ben Ali", phone: "20 217 090", date: "2026-09-12", time: "19:30", guests: 4 })).toEqual(["17", "Amira Ben Ali", "2026-09-12 à 19:30", "4 personnes", "20 217 090"]);
  });

  it("formats a pickup order notification with its total", () => {
    expect(templateParameters({ kind: "order", id: 21, customerName: "Yassine", phone: "22 000 111", orderType: "pickup", totalDt: 86 })).toEqual(["21", "Yassine", "86 DT", "À emporter", "22 000 111"]);
  });
});
