import { getNextLocation } from "./get-next-location";
import * as IsValidUrl from "./is-valid-url";

const validUrl = "https://example.com";

describe("getNextLocation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return null if headers['location'] is undefined", () => {
    expect(getNextLocation("", {})).toEqual(null);
  });

  test("should return null if headers['location'] is an empty string", () => {
    expect(getNextLocation("", { location: "" })).toEqual(null);
  });

  test("should return null if the headers['location'] value if not a valid URL", () => {
    expect(
      getNextLocation("", {
        location: "burger burger",
      })
    ).toEqual(null);
  });

  test("should return the headers['location'] value if available", () => {
    expect(
      getNextLocation("", {
        location: validUrl,
      })
    ).toEqual(validUrl);
  });

  test("should return the headers['location'] value if isValidUrl", () => {
    jest.spyOn(IsValidUrl, "isValidUrl").mockReturnValueOnce(true);

    expect(
      getNextLocation("https://some.valid.url", {
        location: validUrl,
      })
    ).toEqual(validUrl);
  });

  describe("isValidUrl(location) === false", () => {
    test("should return null if unable to create a valid new URL(currentUrl)", () => {
      expect(
        getNextLocation("tel:+333-333-333", {
          location: "",
        })
      ).toEqual(null);
    });

    test("should return null if current url is the same as the guessedNextLocation", () => {
      expect(
        getNextLocation(`${validUrl}/`, {
          location: `/`,
        })
      ).toEqual(null);
    });

    test("should return the guessedNextLocation", () => {
      expect(
        getNextLocation(validUrl, {
          location: `/123`,
        })
      ).toEqual(`${validUrl}/123`);
    });
  });
});
