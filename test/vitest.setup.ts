import "vitest-canvas-mock";

import { initLoggedInUser } from "#app/account";
import { initAbilities } from "#app/data/all-abilities";
import { allMoves, initMoves } from "#app/data/all-moves";
import { initBiomes } from "#app/data/balance/biomes";
import { initEggMoves } from "#app/data/balance/egg-moves";
import { initPokemonPrevolutions } from "#app/data/balance/pokemon-evolutions";
import { initSpecies } from "#app/data/init-species";
import { initMysteryEncounters } from "#app/data/mystery-encounters/mystery-encounters";
import { initPokemonForms } from "#app/data/pokemon-forms";
import { initAchievements } from "#app/system/achv";
import { initVouchers } from "#app/system/init-vouchers";
import { initStatsKeys } from "#app/ui/game-stats-ui-handler";
import { initTestFile } from "#test/testUtils/testFileInitialization";
import { afterAll, beforeAll, vi } from "vitest";

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

function initData() {
  // Initialize all of these things if and only if they have not been initialized yet
  if (Object.values(allMoves).length === 0) {
    initMoves();
    initVouchers();
    initAchievements();
    initStatsKeys();
    initPokemonPrevolutions();
    initBiomes();
    initEggMoves();
    initPokemonForms();
    initSpecies();
    initAbilities();
    initLoggedInUser();
    initMysteryEncounters();
  }
}

global.testFailed = false;
initData();

beforeAll(() => {
  initTestFile();
});

afterAll(() => {
  global.server.close();
  console.log("Closing i18n MSW server!");
});
