import { initLoggedInUser } from "#app/account";
import { SESSION_ID_COOKIE } from "#app/constants";
import { allMoves } from "#app/data/data-lists";
import { initBiomes } from "#app/data/balance/biomes";
import { initEggMoves } from "#app/data/balance/egg-moves";
import { initPokemonPreEvolutions } from "#app/data/pokemon-pre-evolutions";
import { initMysteryEncounters } from "#app/data/mystery-encounters/mystery-encounters";
import { initPokemonForms } from "#app/data/pokemon-forms";
import { initSpecies } from "#app/data/init/init-species";
import { initAchievements } from "#app/system/achievements";
import { setCookie } from "#app/utils";
import { blobToString } from "#test/test-utils/gameManagerUtils";
import { MockConsole } from "#test/test-utils/mocks/mockConsole";
import { mockContext } from "#test/test-utils/mocks/mockContext";
import { mockLocalStorage } from "#test/test-utils/mocks/mockLocalStorage";
import { MockImage } from "#test/test-utils/mocks/mocksContainer/mockImage";
import Phaser from "phaser";
import { manageListeners } from "./listenersManager";
import { initVouchers } from "#app/system/init-vouchers";
import { initAbilities } from "#app/data/init/init-abilities";
import { initMoves } from "#app/data/init/init-moves";
import { initModifierTypes } from "#app/modifier/init-modifier-types";
import { initModifierPools } from "#app/modifier/init-modifier-pools";

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

  /**
   * Sets this object's position relative to another object with a given offset
   * @param guideObject {@linkcode Phaser.GameObjects.GameObject} to base the position off of
   * @param x The relative x position
   * @param y The relative y position
   */
  const setPositionRelative = function (guideObject: any, x: number, y: number) {
    const offsetX = guideObject.width * (-0.5 + (0.5 - guideObject.originX));
    const offsetY = guideObject.height * (-0.5 + (0.5 - guideObject.originY));
    this.setPosition(guideObject.x + offsetX + x, guideObject.y + offsetY + y);
  };

  Phaser.GameObjects.Container.prototype.setPositionRelative = setPositionRelative;
  Phaser.GameObjects.Sprite.prototype.setPositionRelative = setPositionRelative;
  Phaser.GameObjects.Image.prototype.setPositionRelative = setPositionRelative;
  Phaser.GameObjects.NineSlice.prototype.setPositionRelative = setPositionRelative;
  Phaser.GameObjects.Text.prototype.setPositionRelative = setPositionRelative;
  Phaser.GameObjects.Rectangle.prototype.setPositionRelative = setPositionRelative;
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
