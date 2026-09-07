import { describe, expect, it } from "vitest";
import { fleetClasses, routes } from "./routes";

describe("routes data", () => {
  it("is not empty", () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  it("has a name, distance, and all three price fields for every route", () => {
    for (const route of routes) {
      expect(route.name.trim()).not.toBe("");
      expect(route.distance.trim()).not.toBe("");
      expect(route.p4.trim()).not.toBe("");
      expect(route.p7.trim()).not.toBe("");
      expect(route.p16.trim()).not.toBe("");
    }
  });

  it("has no duplicate route names", () => {
    const names = routes.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("fleetClasses data", () => {
  it("covers exactly the 4/7/16-seat classes", () => {
    expect(fleetClasses.map((f) => f.seats)).toEqual(["4 Chỗ", "7 Chỗ", "16 Chỗ"]);
  });

  it("has a non-empty note for every class", () => {
    for (const fleet of fleetClasses) {
      expect(fleet.note.trim()).not.toBe("");
    }
  });
});
