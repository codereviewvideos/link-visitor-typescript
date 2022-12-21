type VisitedURL = {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  redirected: boolean;
  headers: Record<string, string>;
};

const badRequest = {
  status: -1,
  ok: false,
  redirected: false,
  headers: {},
};

const isValidUrl = (url: string | null) => {
  if (url === null) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

let previousController: AbortController | undefined = undefined;

const fetcher = async (href: string) => {
  console.log(`fetcher`, href);
  const currentController = new AbortController();

  if (previousController) {
    previousController.abort();
  }

  previousController = currentController;

  const { url, status, statusText, ok, headers } = await fetch(href, {
    method: "head",
    redirect: "manual",
    signal: currentController.signal,
  });

  if (ok) {
    currentController.abort();
    previousController = undefined;
  }

  console.log(`headers`, headers);

  const location = headers.get("location");
  // const redirected = null !== location;

  let nextLocation = null;
  if (isValidUrl(location)) {
    nextLocation = location;
  } else if (isValidUrl(`${new URL(url).origin}${location}`)) {
    nextLocation = `${new URL(url).origin}${location}`;
  }

  return { url, status, statusText, ok, headers, nextLocation };
};

const visit = async (
  href: string,
  requests: VisitedURL[] = []
): Promise<VisitedURL[]> => {
  console.log(`href`, href);
  const hrefToUrl = new URL(href);
  console.log(`hrefToUrl`, hrefToUrl);

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
    const { url, status, statusText, ok, headers, nextLocation } =
      await fetcher(href);
    console.log(`nextLocation`, nextLocation);

    // const newLocation = headers.get("location");
    // const redirected = null !== newLocation;

    // if (nextLocation) {
    //   const hrefToUrl = new URL(newLocation);
    //   console.log(`hr1`, hrefToUrl);
    // }

    const updated = [
      ...requests,
      {
        url,
        status,
        statusText,
        ok,
        redirected: nextLocation === null,
        headers: Object.fromEntries(headers),
      },
    ];

    if (ok) {
      return updated;
    }

    if (!nextLocation) {
      return updated;
    }

    // console.log(`newLocation`, newLocation);

    return await visit(nextLocation, updated);
  } catch (e) {
    console.error(e);

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

// const href = "https://a.bad.url";
const href = "https://aka.ms/new-console-template";
// const href = "https://codereviewvideos.com";
// const href = "http://codereviewvideos.com";
// const href = "http://codereviewvideos.com/444444";
// const href = "https://codereviewvideos.com/typescript-tuple";
// const href = "tel:+1-303-499-7111";
// const href = "mailto:someone@example.com";

(async () => {
  try {
    const journey = await visit(href);
    console.log(journey);
  } catch (e) {
    console.error(e);
  }
})();
