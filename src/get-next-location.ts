import { isValidUrl } from "./is-valid-url";

export const getNextLocation = (
  currentUrl: string,
  headers: { [key: string]: string }
) => {
  const location = headers["location"];

  if (!location) {
    return null;
  }

  if (isValidUrl(location)) {
    return location;
  }

  const { origin: currentOrigin, pathname: currentPathname } = new URL(
    currentUrl
  );

  const guessedNextLocation = `${currentOrigin}${location}`;

  if (guessedNextLocation === `${currentOrigin}${currentPathname}`) {
    return null;
  }

  return guessedNextLocation;
};
