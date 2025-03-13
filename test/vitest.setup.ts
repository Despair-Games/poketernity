import "vitest-canvas-mock";

import { afterAll, beforeAll, vi } from "vitest";
import { initDataForTests, initTestFile } from "#test/test-utils/testFileInitialization";
import { MockConsole } from "#test/test-utils/mocks/mockConsole";

//#region Mocking

/** Mock the override import to always return default values, ignoring any custom overrides. */
vi.mock("#app/overrides", async (importOriginal) => {
  // eslint-disable-next-line
  const { defaultOverrides } = await importOriginal<typeof import("#app/overrides")>();

  return {
    default: defaultOverrides,
    // Export `defaultOverrides` as a *copy*.
    // This ensures we can easily reset `overrides` back to its default values after modifying it.
    defaultOverrides: { ...defaultOverrides },
  } satisfies typeof import("#app/overrides"); // eslint-disable-line
});

/**
 * This is a hacky way to mock the i18n backend requests (with the help of {@link https://mswjs.io/ | msw}).
 * The reason to put it inside of a mock is to elevate it.
 * This is necessary because how our code is structured.
 * Do NOT try to put any of this code into external functions, it won't work as it's elevated during runtime.
 */
vi.mock("i18next", async (importOriginal) => {
  console.log("Mocking i18next");
  const { setupServer } = await import("msw/node");
  const { http, HttpResponse } = await import("msw");

  global.server = setupServer(
    http.get("/locales/en/*", async (req) => {
      const filename = req.params[0];

      try {
        const json = await import(`../public/locales/en/${req.params[0]}`);
        console.log("Loaded locale", filename);
        return HttpResponse.json(json);
      } catch (err) {
        console.log(`Failed to load locale ${filename}!`, err);
        return HttpResponse.json({});
      }
    }),
    http.get("https://fonts.googleapis.com/*", () => {
      return HttpResponse.text("");
    }),
  );
  global.server.listen({ onUnhandledRequest: "error" });
  console.log("i18n MSW server listening!");

  return await importOriginal();
});

/** Making sure that i18n is initialized on all calls. */
vi.mock("#app/plugins/i18n", async (importOriginal) => {
  const importedStuff: any = await importOriginal();
  const { initI18n } = importedStuff;
  await initI18n();
  return importedStuff;
});

//#region

global.testFailed = false;
initDataForTests();

beforeAll(() => {
  initTestFile();
});

afterAll(() => {
  global.server.close();
  MockConsole.printPostTestWarnings();
  console.log("Closing i18n MSW server!");
});
