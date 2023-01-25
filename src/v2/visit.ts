import { VisitedURL } from "./types";
import { badRequest } from "./bad-request";
import { isValidUrl } from "./is-valid-url";
import { fetcher } from "./fetcher";

export const visit = async (
  href: string,
  requests: VisitedURL[] = []
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

  try {
    const { nextLocation, ...result } = await fetcher(href);

    if (nextLocation) {
      const updatedRequests = [...requests, { ...result, redirected: true }];

      return await visit(nextLocation, updatedRequests);
    }

    return [
      ...requests,
      {
        ...result,
        redirected: false,
      },
    ];
  } catch (e) {
    return [
      ...requests,
      {
        ...badRequest,
        url: href,
        statusText: `An unhandled error occurred: ${(e as Error).toString()}`,
      },
    ];
  }
};
