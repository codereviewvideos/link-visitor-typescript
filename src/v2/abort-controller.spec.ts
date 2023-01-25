import { createAbortController } from "./abort-controller";

describe("abort controller", () => {
  test("should return an AbortController instance", () => {
    expect(createAbortController()).toBeInstanceOf(AbortController);
  });
});
