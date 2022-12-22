import { badRequest } from "./bad-request";

describe("bad request object", () => {
  test("should define a base bad request object", () => {
    expect(badRequest).toEqual({
      status: -1,
      ok: false,
      redirected: false,
      headers: {},
    });
  });
});
