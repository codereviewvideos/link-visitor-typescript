import { getNextLocation } from "./get-next-location";
import { createAbortController } from "../abort-controller";

export const fetcher = async (href: string) => {
  const controller = createAbortController();

  const { url, status, statusText, ok, headers } = await fetch(href, {
    redirect: "manual",
    signal: controller.signal,
  });

  controller.abort();

  const headersObject = Object.fromEntries(headers);
  const nextLocation = getNextLocation(url, headersObject);

  return { url, status, statusText, ok, headers: headersObject, nextLocation };
};
