import { api } from "#api/api";
import { initServerForApiTests } from "#test/test-utils/test-file-initialization";
import { getApiBaseUrl } from "#test/test-utils/test-utils";
import type { TitleStatsResponse } from "#types/api";
import { HttpResponse, http } from "msw";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const baseUrl = getApiBaseUrl();

let server;
beforeAll(async () => {
  server = await initServerForApiTests();
});

afterEach(() => {
  server.resetHandlers();
});

describe("API", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn");
    vi.spyOn(api, "isConnected", "get").mockReturnValue(true);
  });

  describe("Game Title Stats", () => {
    const expectedTitleStats: TitleStatsResponse = {
      playerCount: 9999999,
      battleCount: 9999999,
    };

    it("should return the stats on SUCCESS", async () => {
      server.use(http.get(`${baseUrl}/game/titlestats`, () => HttpResponse.json(expectedTitleStats)));

      const titleStats = await api.getGameTitleStats();

      expect(titleStats).toEqual(expectedTitleStats);
    });

    it("should return null and report a warning on ERROR", async () => {
      server.use(http.get(`${baseUrl}/game/titlestats`, () => HttpResponse.error()));
      const titleStats = await api.getGameTitleStats();

      expect(titleStats).toBeNull();
      expect(console.warn).toHaveBeenCalledWith("Could not get game title stats!", expect.any(Error));
    });

    it("should return null when not connected", async () => {
      vi.spyOn(api, "isConnected", "get").mockReturnValue(false);
      const titleStats = await api.getGameTitleStats();

      expect(titleStats).toBeNull();
    });
  });

  describe("Unlink Discord", () => {
    it("should return true on SUCCESS", async () => {
      server.use(http.post(`${baseUrl}/auth/discord/logout`, () => new HttpResponse("", { status: 200 })));

      const success = await api.unlinkDiscord();

      expect(success).toBe(true);
    });

    it("should return false and report a warning on FAILURE", async () => {
      server.use(http.post(`${baseUrl}/auth/discord/logout`, () => new HttpResponse("", { status: 401 })));

      const success = await api.unlinkDiscord();

      expect(success).toBe(false);
      expect(console.warn).toHaveBeenCalledWith("Discord unlink failed (401: Unauthorized)");
    });

    it("should return false and report a warning on ERROR", async () => {
      server.use(http.post(`${baseUrl}/auth/discord/logout`, () => HttpResponse.error()));

      const success = await api.unlinkDiscord();

      expect(success).toBe(false);
      expect(console.warn).toHaveBeenCalledWith("Could not unlink Discord!", expect.any(Error));
    });

    it("should return false when not connected", async () => {
      vi.spyOn(api, "isConnected", "get").mockReturnValue(false);

      const success = await api.unlinkDiscord();

      expect(success).toBe(false);
    });
  });

  describe("Unlink Google", () => {
    it("should return true on SUCCESS", async () => {
      server.use(http.post(`${baseUrl}/auth/google/logout`, () => new HttpResponse("", { status: 200 })));

      const success = await api.unlinkGoogle();

      expect(success).toBe(true);
    });

    it("should return false and report a warning on FAILURE", async () => {
      server.use(http.post(`${baseUrl}/auth/google/logout`, () => new HttpResponse("", { status: 401 })));

      const success = await api.unlinkGoogle();

      expect(success).toBe(false);
      expect(console.warn).toHaveBeenCalledWith("Google unlink failed (401: Unauthorized)");
    });

    it("should return false and report a warning on ERROR", async () => {
      server.use(http.post(`${baseUrl}/auth/google/logout`, () => HttpResponse.error()));

      const success = await api.unlinkGoogle();

      expect(success).toBe(false);
      expect(console.warn).toHaveBeenCalledWith("Could not unlink Google!", expect.any(Error));
    });

    it("should return false when not connected", async () => {
      vi.spyOn(api, "isConnected", "get").mockReturnValue(false);

      const success = await api.unlinkGoogle();

      expect(success).toBe(false);
    });
  });
});
