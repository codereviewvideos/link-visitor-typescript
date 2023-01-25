export type VisitedURL = {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  redirected: boolean;
  headers: Record<string, string>;
};

export type FetcherResponse = {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  headers: Record<string, string>;
  nextLocation: string | null;
};
