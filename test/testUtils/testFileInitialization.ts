import { SESSION_ID_COOKIE } from "#app/constants";
import { setCookie } from "#app/utils";
import { blobToString } from "#test/testUtils/gameManagerUtils";
import { MockConsoleLog } from "#test/testUtils/mocks/mockConsoleLog";
import { mockContext } from "#test/testUtils/mocks/mockContext";
import { mockLocalStorage } from "#test/testUtils/mocks/mockLocalStorage";
import { MockImage } from "#test/testUtils/mocks/mocksContainer/mockImage";
import Phaser from "phaser";
import { manageListeners } from "./listenersManager";

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
    value: new MockConsoleLog(false),
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
