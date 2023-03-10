import { isValidUrl } from "./is-valid-url";

describe("isValidUrl", () => {
  [
    [true, false],
    [null, false],
    ["", false],
    ["null", false],
    ["http://", false],
    ["https://", false],
    ["https://example.com", true],
    ["https://www.example.com", true],
    [
      "https://learn.microsoft.com/dotnet/core/tutorials/top-level-templates",
      true,
    ],
  ].forEach(([given, expected]) => {
    test(`given: ${given}, expected: ${expected}`, () => {
      expect(isValidUrl(given as string | null)).toEqual(expected);
    });
  });
});
