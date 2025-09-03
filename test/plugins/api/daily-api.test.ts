import { DailyApi } from "#api/daily-api";
import { initServerForApiTests } from "#test/test-utils/test-file-initialization";
import { getApiBaseUrl } from "#test/test-utils/test-utils";
import { HttpResponse, http } from "msw";
import type { SetupServerApi } from "msw/node";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const apiBase = getApiBaseUrl();
const dailyApi = new DailyApi(apiBase);

let server: SetupServerApi;
beforeAll(async () => {
  server = await initServerForApiTests();
});

afterEach(() => {
  server.resetHandlers();
});

describe("Daily API", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn");
  });

  describe("Get Seed", () => {
    it("should return seed string on SUCCESS", async () => {
      server.use(http.get(`${apiBase}/daily/seed`, () => HttpResponse.text("this-is-a-test-seed")));

      const seed = await dailyApi.getSeed();

      expect(seed).toBe("this-is-a-test-seed");
    });

    it("should return null and report a warning on ERROR", async () => {
      server.use(http.get(`${apiBase}/daily/seed`, () => HttpResponse.error()));

      const seed = await dailyApi.getSeed();

      expect(seed).toBeNull();
      expect(console.warn).toHaveBeenCalledWith("Could not get daily-run seed!", expect.any(Error));
    });
  });
});
