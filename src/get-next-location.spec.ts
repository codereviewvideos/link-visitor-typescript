import { getNextLocation } from "./get-next-location";
import * as IsValidUrl from "./is-valid-url";

const validUrl = "https://some.valid.url";

describe("getNextLocation", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return null if headers['location'] is undefined", () => {
    expect(getNextLocation("", {})).toEqual(null);
  });

  test("should return null if headers['location'] is an empty string", () => {
    expect(getNextLocation("", { location: "" })).toEqual(null);
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
      jest.spyOn(IsValidUrl, "isValidUrl").mockReturnValueOnce(false);

      expect(
        getNextLocation(validUrl, {
          location: "",
        })
      ).toEqual(null);
    });

    test("should return null if current url is the same as the guessedNextLocation", () => {
      jest.spyOn(IsValidUrl, "isValidUrl").mockReturnValueOnce(false);

      expect(
        getNextLocation(`${validUrl}/`, {
          location: `/`,
        })
      ).toEqual(null);
    });

    test("should return the guessedNextLocation", () => {
      jest.spyOn(IsValidUrl, "isValidUrl").mockReturnValueOnce(false);

      expect(
        getNextLocation(`${validUrl}/`, {
          location: `/123`,
        })
      ).toEqual(`${validUrl}/123`);
    });
  });
});
