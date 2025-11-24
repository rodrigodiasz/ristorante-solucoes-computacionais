import { cn } from "../utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("foo", "bar");
    expect(result).toContain("foo");
    expect(result).toContain("bar");
  });

  it("should handle conditional classes", () => {
    const result = cn("foo", false && "bar", "baz");
    expect(result).toContain("foo");
    expect(result).toContain("baz");
    expect(result).not.toContain("bar");
  });

  it("should merge Tailwind classes correctly", () => {
    // Tailwind merge should resolve conflicts
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4"); // px-4 should override px-2
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle undefined and null values", () => {
    const result = cn("foo", undefined, null, "bar");
    expect(result).toContain("foo");
    expect(result).toContain("bar");
  });

  it("should handle arrays", () => {
    const result = cn(["foo", "bar"], "baz");
    expect(result).toContain("foo");
    expect(result).toContain("bar");
    expect(result).toContain("baz");
  });

  it("should handle objects", () => {
    const result = cn({ foo: true, bar: false, baz: true });
    expect(result).toContain("foo");
    expect(result).toContain("baz");
    expect(result).not.toContain("bar");
  });
});
