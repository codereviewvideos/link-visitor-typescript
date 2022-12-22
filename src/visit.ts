import { VisitedURL } from "./types";
import { fetcher } from "./fetcher";
import { badRequest } from "./bad-request";
import { isValidUrl } from "./is-valid-url";

export const visit = async (
  href: string,
  requests: VisitedURL[] = [],
  { maxRedirects } = { maxRedirects: 50 }
): Promise<VisitedURL[]> => {
  if (!isValidUrl(href)) {
    return [
      ...requests,
      {
        ...badRequest,
        url: href,
        statusText: `Invalid URL`,
      },
    ];
  }

  const hrefToUrl = new URL(href);

  if (!["http:", "https:"].includes(hrefToUrl.protocol)) {
    return [
      ...requests,
      {
        ...badRequest,
        url: href,
        statusText: `Unsupported protocol: "${hrefToUrl.protocol}"`,
      },
    ];
  }

  if (requests.length >= maxRedirects) {
    return [
      ...requests,
      {
        ...badRequest,
        url: href,
        statusText: `Too many redirects.`,
      },
    ];
  }

  try {
    const { url, status, statusText, ok, headers, nextLocation } =
      await fetcher(href);

    const updated = [
      ...requests,
      {
        url,
        status,
        statusText,
        ok,
        redirected: nextLocation !== null,
        headers,
      },
    ];

    if (ok) {
      return updated;
    }

    if (!nextLocation) {
      return updated;
    }

    return await visit(nextLocation, updated);
  } catch (e) {
    return [
      ...requests,
      {
        ...badRequest,
        url: href,
        statusText: `An unhandled error occurred: ${e}`,
      },
    ];
  }
};
