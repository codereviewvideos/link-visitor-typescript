import { visit } from "./visit";
// import { VisitedURL } from "./types";
import * as Fetcher from "./fetcher";

const validUrl = "https://some.valid.url";

describe("visit", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return early if given an invalid URL", async () => {
    expect(await visit("")).toEqual([
      {
        status: -1,
        ok: false,
        redirected: false,
        headers: {},
        url: "",
        statusText: "Invalid URL",
      },
    ]);
  });

  test("should only proceed when working with http and https urls", async () => {
    expect(await visit("tel:+1-303-499-7111")).toEqual([
      {
        status: -1,
        ok: false,
        redirected: false,
        headers: {},
        url: "tel:+1-303-499-7111",
        statusText: `Unsupported protocol: "tel:"`,
      },
    ]);
  });

  // test("should not proceed beyond the maximum number of redirects", async () => {
  //   const fetcherSpy = jest.spyOn(Fetcher, "fetcher");
  //
  //   const priorRequests = [{}, {}] as VisitedURL[];
  //
  //   expect(await visit(validUrl, priorRequests, { maxRedirects: 2 })).toEqual([
  //     ...priorRequests,
  //     {
  //       status: -1,
  //       ok: false,
  //       redirected: false,
  //       headers: {},
  //       url: validUrl,
  //       statusText: `Too many redirects.`,
  //     },
  //   ]);
  //
  //   expect(fetcherSpy).not.toHaveBeenCalled();
  // });

  test("should return a bad request representation if the fetch process fails", async () => {
    const fetcherSpy = jest.spyOn(Fetcher, "fetcher");
    const badUrl = "http://something.bad";

    expect(await visit(badUrl)).toEqual([
      {
        status: -1,
        ok: false,
        redirected: false,
        headers: {},
        url: badUrl,
        statusText: "An unhandled error occurred: TypeError: fetch failed",
      },
    ]);

    expect(fetcherSpy).toHaveBeenCalledTimes(1);
    expect(fetcherSpy).toHaveBeenCalledWith(badUrl);
  });

  test("should return a good request representation if given a 2xx response", async () => {
    const fetcherSpy = jest.spyOn(Fetcher, "fetcher").mockResolvedValueOnce({
      ok: true,
      url: validUrl,
      status: 200,
      statusText: "OK",
      headers: { a: "b" },
      nextLocation: null,
    });

    expect(await visit(validUrl)).toEqual([
      {
        ok: true,
        url: validUrl,
        status: 200,
        statusText: "OK",
        headers: { a: "b" },
        redirected: false,
      },
    ]);

    expect(fetcherSpy).toHaveBeenCalledTimes(1);
    expect(fetcherSpy).toHaveBeenCalledWith(validUrl);
  });

  test("should return a request representation if not a 2xx response but doesn't have a valid nextLocation", async () => {
    const fetcherSpy = jest.spyOn(Fetcher, "fetcher").mockResolvedValueOnce({
      ok: false,
      url: validUrl,
      status: 400,
      statusText: "Bad request",
      headers: { x: "y" },
      nextLocation: null,
    });

    expect(await visit(validUrl)).toEqual([
      {
        ok: false,
        url: validUrl,
        status: 400,
        statusText: "Bad request",
        headers: { x: "y" },
        redirected: false,
      },
    ]);

    expect(fetcherSpy).toHaveBeenCalledTimes(1);
    expect(fetcherSpy).toHaveBeenCalledWith(validUrl);
  });

  test("should recursively call the visit function if a valid location header exists", async () => {
    const validUrl = "https://some.valid.url";
    const nextUrl = "https://next.url";

    const fetcherSpy = jest
      .spyOn(Fetcher, "fetcher")
      .mockResolvedValueOnce({
        ok: false,
        url: validUrl,
        status: 307,
        statusText: "Temporary Redirect",
        headers: { location: nextUrl, c: "d" },
        nextLocation: nextUrl,
      })
      .mockResolvedValueOnce({
        ok: true,
        url: nextUrl,
        status: 200,
        statusText: "OK",
        headers: { a: "b" },
        nextLocation: null,
      });

    expect(await visit(validUrl)).toEqual([
      {
        ok: false,
        url: validUrl,
        status: 307,
        statusText: "Temporary Redirect",
        headers: { location: nextUrl, c: "d" },
        redirected: true,
      },
      {
        ok: true,
        url: nextUrl,
        status: 200,
        statusText: "OK",
        headers: { a: "b" },
        redirected: false,
      },
    ]);

    expect(fetcherSpy).toHaveBeenCalledTimes(2);
    expect(fetcherSpy.mock.calls).toEqual([[validUrl], [nextUrl]]);
  });

  test("should recursively call the visit function if a valid nextLocation exists", async () => {
    const nextUrl = "https://next.url";

    const fetcherSpy = jest
      .spyOn(Fetcher, "fetcher")
      .mockResolvedValueOnce({
        ok: false,
        url: validUrl,
        status: 307,
        statusText: "Temporary Redirect",
        headers: { location: nextUrl, c: "d" },
        nextLocation: nextUrl,
      })
      .mockResolvedValueOnce({
        ok: true,
        url: nextUrl,
        status: 200,
        statusText: "OK",
        headers: { a: "b" },
        nextLocation: null,
      });

    expect(await visit(validUrl)).toEqual([
      {
        ok: false,
        url: validUrl,
        status: 307,
        statusText: "Temporary Redirect",
        headers: { location: nextUrl, c: "d" },
        redirected: true,
      },
      {
        ok: true,
        url: nextUrl,
        status: 200,
        statusText: "OK",
        headers: { a: "b" },
        redirected: false,
      },
    ]);

    expect(fetcherSpy).toHaveBeenCalledTimes(2);
    expect(fetcherSpy.mock.calls).toEqual([[validUrl], [nextUrl]]);
  });
});
