import { fetcher } from "./fetcher";
import * as AbortController from "./abort-controller";

const fakeUrl = "http://some.fake.url";
const fakeAbortSignal = "pretend abort signal code";

describe("fetcher", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should call the native fetch function in the expected manner", async () => {
    const mockAbortFn = jest.fn();

    jest.spyOn(AbortController, "createAbortController").mockImplementationOnce(
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
      headers: new Map(),
    } as unknown as Response);

    const result = await fetcher(fakeUrl);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(fakeUrl, {
      redirect: "manual",
      signal: fakeAbortSignal,
    });

    expect(result).toEqual({
      headers: {},
      nextLocation: null,
      ok: true,
      status: 200,
      statusText: "something",
      url: "http://some.fake.url",
    });

    expect(mockAbortFn).toHaveBeenCalledTimes(1);
  });

  test("should return headers as an object", async () => {
    const mockAbortFn = jest.fn();

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
      headers: new Map([
        ["a", "b"],
        ["c", "d"],
      ]),
    } as unknown as Response);

    const result = await fetcher(fakeUrl);

    expect(result.headers).toEqual({
      a: "b",
      c: "d",
    });

    expect(mockAbortFn).toHaveBeenCalledTimes(1);
  });
});
