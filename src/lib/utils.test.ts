import { describe, expect, it } from "vitest";
import { cn, currency, initials } from "./utils";

describe("planning utilities", () => {
  it("formats whole-dollar wedding amounts", () => {
    expect(currency(85000)).toBe("$85,000");
  });

  it("creates couple initials from joined names", () => {
    expect(initials("Olivia & Marcus")).toBe("OM");
  });

  it("resolves conflicting Tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
