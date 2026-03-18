import { describe, it, expect } from "vitest";
import { Terraforecast } from "../src/core.js";
describe("Terraforecast", () => {
  it("init", () => { expect(new Terraforecast().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Terraforecast(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Terraforecast(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
