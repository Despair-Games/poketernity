import { initLoggedInUser } from "#app/account";
import "#app/phaser-extensions";
import { SESSION_ID_COOKIE } from "#constants/app-constants";
import { allMoves } from "#data/data-lists";
import { initEggMoves } from "#data/egg-moves";
import { initPokemonForms } from "#data/pokemon-forms";
import { initPokemonPreEvolutions } from "#data/pokemon-pre-evolutions";
import { initAbilities } from "#init/init-abilities";
import { initBiomes } from "#init/init-biomes";
import { initMoves } from "#init/init-moves";
import { initSpecies } from "#init/init-species";
import { initModifierPools } from "#modifier/init-modifier-pools";
import { initModifierTypes } from "#modifier/init-modifier-types";
import { initMysteryEncounters } from "#mystery-encounters/mystery-encounters";
import { initAchievements } from "#system/achievements";
import { initVouchers } from "#system/init-vouchers";
import { blobToString } from "#test/test-utils/game-manager-utils";
import { manageListeners } from "#test/test-utils/listeners-manager";
import { MockConsole } from "#test/test-utils/mocks/mock-console";
import { mockContext } from "#test/test-utils/mocks/mock-context";
import { mockLocalStorage } from "#test/test-utils/mocks/mock-local-storage";
import { MockImage } from "#test/test-utils/mocks/mocks-container/mock-image";
import { setCookie } from "#utils/app-utils";
import Phaser from "phaser";

/**
 * A function to initialize game data before running any other test-related code.
 */
export function initDataForTests() {
  // Initialize all of these things if and only if they have not been initialized yet
  if (allMoves.size === 0) {
    initModifierTypes();
    initModifierPools();
    initMoves();
    initVouchers();
    initAchievements();
    initPokemonPreEvolutions();
    initBiomes();
    initEggMoves();
    initPokemonForms();
    initSpecies();
    initAbilities();
    initLoggedInUser();
    initMysteryEncounters();
  }
}

/**
 * An initialization function that is run at the beginning of every test file (via `beforeAll()`).
 */
export function initTestFile() {
  // Set the timezone to UTC for tests.
  process.env.TZ = "UTC";

  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage(),
  });
  Object.defineProperty(window, "console", {
    value: new MockConsole(),
  });
  Object.defineProperty(document, "fonts", {
    writable: true,
    value: {
      add: () => {},
    },
  });

  Phaser.GameObjects.Image = MockImage as any;
  window.URL.createObjectURL = (blob: Blob) => {
    blobToString(blob).then((data: string) => {
      localStorage.setItem("toExport", data);
    });
    return null as any;
  };
  navigator.getGamepads = () => [];
  setCookie(SESSION_ID_COOKIE, "fake_token");

  window.matchMedia = () =>
    ({
      matches: false,
    }) as any;

  HTMLCanvasElement.prototype.getContext = () => mockContext;

  manageListeners();
}

/**
 * Closes the current mock server and initializes a new mock server.
 * This is run at the beginning of every API test file.
 */
export async function initServerForApiTests() {
  global.server?.close();
  const { setupServer } = await import("msw/node");
  global.server = setupServer();
  global.server.listen({ onUnhandledRequest: "error" });
  return global.server;
}
