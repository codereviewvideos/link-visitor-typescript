import { fetcher } from "./fetcher";
import * as AbortController from "../abort-controller";

const fakeUrl = "http://some.fake.url";

describe("fetcher", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      description: "empty headers",
      givenHeaders: new Headers(),
      expectedHeaders: {},
    },
    {
      description: "with headers",
      givenHeaders: new Headers({ some: "data" }),
      expectedHeaders: { some: "data" },
    },
  ].forEach(({ description, givenHeaders, expectedHeaders }) => {
    test(`should call the native fetch function in the expected manner: ${description}`, async () => {
      const mockAbortFn = jest.fn();
      const fakeAbortSignal = "pretend abort signal code";

      jest
        .spyOn(AbortController, "createAbortController")
        .mockImplementationOnce(
          () =>
            ({
              signal: fakeAbortSignal,
              abort: mockAbortFn,
            } as unknown as AbortController)
        );

      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
        url: fakeUrl,
        status: 200,
        statusText: "something",
        ok: true,
        headers: givenHeaders,
      } as unknown as Response);

      const result = await fetcher(fakeUrl);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(fakeUrl, {
        redirect: "manual",
        signal: fakeAbortSignal,
      });

      expect(result).toEqual({
        ok: true,
        status: 200,
        statusText: "something",
        url: "http://some.fake.url",
        headers: expectedHeaders,
        nextLocation: null,
      });

      expect(mockAbortFn).toHaveBeenCalledTimes(1);
    });
  });

  test("should guess the next location if applicable", async () => {
    const mockAbortFn = jest.fn();
    const fakeAbortSignal = "pretend abort signal code";

    const fakeLocationPath = "/a/b/c";

    jest.spyOn(AbortController, "createAbortController").mockImplementationOnce(
      () =>
        ({
          signal: fakeAbortSignal,
          abort: mockAbortFn,
        } as unknown as AbortController)
    );

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      url: fakeUrl,
      status: 200,
      statusText: "something",
      ok: true,
      headers: new Headers({ location: fakeLocationPath }),
    } as unknown as Response);

    const result = await fetcher(fakeUrl);

    expect(result).toEqual({
      ok: true,
      status: 200,
      statusText: "something",
      url: "http://some.fake.url",
      headers: { location: fakeLocationPath },
      nextLocation: `${fakeUrl}${fakeLocationPath}`,
    });

    expect(mockAbortFn).toHaveBeenCalledTimes(1);
  });
});
