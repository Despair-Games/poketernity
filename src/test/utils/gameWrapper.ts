import BattleScene, * as battleScene from "#app/battle-scene";
import { MoveAnim } from "#app/data/battle-anims";
import Pokemon from "#app/field/pokemon";
import { setCookie, sessionIdKey } from "#app/utils";
import { blobToString } from "#test/utils/gameManagerUtils";
import { MockClock } from "#test/utils/mocks/mockClock";
import mockConsoleLog from "#test/utils/mocks/mockConsoleLog";
import { MockFetch } from "#test/utils/mocks/mockFetch";
import MockLoader from "#test/utils/mocks/mockLoader";
import mockLocalStorage from "#test/utils/mocks/mockLocalStorage";
import MockImage from "#test/utils/mocks/mocksContainer/mockImage";
import MockTextureManager from "#test/utils/mocks/mockTextureManager";
import fs from "fs";
import Phaser from "phaser";
import InputText from "phaser3-rex-plugins/plugins/inputtext";
import { vi } from "vitest";
import { MockGameObjectCreator } from "./mocks/mockGameObjectCreator";
import { version } from "../../../package.json";
import { MockTimedEventManager } from "./mocks/mockTimedEventManager";
import InputManager = Phaser.Input.InputManager;
import KeyboardManager = Phaser.Input.Keyboard.KeyboardManager;
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import GamepadPlugin = Phaser.Input.Gamepad.GamepadPlugin;
import EventEmitter = Phaser.Events.EventEmitter;
import UpdateList = Phaser.GameObjects.UpdateList;
import { SESSION_ID_COOKIE } from "#app/constants";

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage(),
});
Object.defineProperty(window, "console", {
  value: mockConsoleLog(false),
});

InputText.prototype.setElement = () => null as any;
InputText.prototype.resize = () => null as any;
Phaser.GameObjects.Image = MockImage as any;
window.URL.createObjectURL = (blob: Blob) => {
  blobToString(blob).then((data: string) => {
    localStorage.setItem("toExport", data);
  });
  return null as any;
};
navigator.getGamepads = () => [];
global.fetch = vi.fn(MockFetch) as any;
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

export default class GameWrapper {
  public game: Phaser.Game;
  public scene: BattleScene;

  constructor(phaserGame: Phaser.Game, bypassLogin: boolean) {
    Phaser.Math.RND.sow(["test"]);
    // vi.spyOn(Utils, "apiFetch", "get").mockReturnValue(fetch);
    if (bypassLogin) {
      vi.spyOn(battleScene, "bypassLogin", "get").mockReturnValue(true);
    }
    this.game = phaserGame;
    MoveAnim.prototype.getAnim = () =>
      ({
        frames: {} as any,
      }) as any;
    Pokemon.prototype.enableMask = () => null;
    Pokemon.prototype.updateFusionPalette = () => null;
    Pokemon.prototype.cry = () => null as any;
    Pokemon.prototype.faintCry = (cb) => {
      if (cb) cb();
    };
  }

  setScene(scene: BattleScene) {
    this.scene = scene;
    this.injectMandatory();
    this.scene.preload && this.scene.preload();
    this.scene.create();
  }

  injectMandatory() {
    // @ts-ignore
    this.game.config = {
      seed: ["test"],
      gameVersion: version,
    };
    this.scene.game = this.game;
    this.game.renderer = {
      maxTextures: -1,
      gl: {},
      deleteTexture: () => null as any,
      canvasToTexture: () => ({}) as any,
      createCanvasTexture: () => ({}) as any,
      pipelines: {
        add: () => null,
      },
    } as any;
    this.scene.renderer = this.game.renderer;
    this.scene.children = {
      removeAll: () => null as any,
    } as any;

    this.scene.sound = {
      play: () => null as any,
      // @ts-ignore
      pause: () => null,
      setRate: () => null as any,
      add: () => this.scene.sound as any,
      get: () => ({ ...this.scene.sound, totalDuration: 0 }) as any,
      getAllPlaying: () => [],
      manager: {
        game: this.game,
      },
      destroy: () => null,
      setVolume: () => null,
      stop: () => null,
      stopByKey: () => null as any,
      on: (evt, callback) => callback(),
      key: "",
    };

    this.scene.cameras = {
      main: {
        setPostPipeline: () => null as any,
        removePostPipeline: () => null as any,
      },
    } as any;

    this.scene.tweens = {
      add: (data: any) => {
        if (data.onComplete) {
          data.onComplete();
        }
      },
      getTweensOf: () => [],
      killTweensOf: () => [] as any,
      chain: () => null as any,
      addCounter: (data: any) => {
        if (data.onComplete) {
          data.onComplete();
        }
      },
      stop: () => null as any,
    } as any;

    this.scene.anims = this.game.anims;
    this.scene.cache = this.game.cache;
    this.scene.plugins = this.game.plugins;
    this.scene.registry = this.game.registry;
    this.scene.scale = this.game.scale;
    this.scene.textures = this.game.textures;
    this.scene.events = this.game.events;
    // @ts-ignore
    this.scene.manager = new InputManager(this.game, {});
    // @ts-ignore
    this.scene.manager.keyboard = new KeyboardManager(this.scene);
    // @ts-ignore
    this.scene.pluginEvents = new EventEmitter();
    // @ts-ignore
    this.scene.domContainer = {} as HTMLDivElement;
    // @ts-ignore
    this.scene.spritePipeline = {};
    this.scene.fieldSpritePipeline = {} as any;
    this.scene.load = new MockLoader(this.scene) as any;
    this.scene.sys = {
      queueDepthSort: () => null,
      anims: this.game.anims,
      game: this.game,
      textures: {
        addCanvas: () => ({
          get: () => ({
            // this.frame in Text.js
            source: {} as any,
            setSize: () => null as any,
            // @ts-ignore
            glTexture: () => ({
              spectorMetadata: {},
            }),
          }),
        }),
      },
      cache: this.scene.load.cacheManager,
      scale: this.game.scale,
      // _scene.sys.scale = new ScaleManager(_scene);
      // events: {
      //   on: () => null,
      // },
      events: new EventEmitter(),
      settings: {
        loader: {
          key: "battle",
        },
      },
      input: this.game.input,
    } as any;
    const mockTextureManager = new MockTextureManager(this.scene);
    this.scene.add = mockTextureManager.add;
    this.scene.textures = mockTextureManager as any;
    // @ts-ignore
    this.scene.sys.displayList = this.scene.add.displayList;
    this.scene.sys.updateList = new UpdateList(this.scene);
    // @ts-ignore
    this.scene.systems = this.scene.sys;
    this.scene.input = this.game.input as any;
    this.scene.scene = this.scene as any;
    this.scene.input.keyboard = new KeyboardPlugin(this.scene as any);
    this.scene.input.gamepad = new GamepadPlugin(this.scene as any);
    this.scene.cachedFetch = (url, init) => {
      return new Promise((resolve) => {
        // need to remove that if later we want to test battle-anims
        const newUrl = url.includes("./battle-anims/") ? prependPath("./battle-anims/tackle.json") : prependPath(url);
        let raw;
        try {
          raw = fs.readFileSync(newUrl, { encoding: "utf8", flag: "r" });
        } catch (e) {
          console.error("Error reading file", e);
          return resolve(createFetchBadResponse({}) as any);
        }
        const data = JSON.parse(raw);
        const response = createFetchResponse(data);
        return resolve(response as any);
      });
    };
    this.scene.make = new MockGameObjectCreator(mockTextureManager) as any;
    this.scene.time = new MockClock(this.scene);
    // @ts-ignore
    this.scene.remove = vi.fn();
    this.scene.eventManager = new MockTimedEventManager(); // Disable Timed Events
  }
}

function prependPath(originalPath) {
  const prefix = "public";
  if (originalPath.startsWith("./")) {
    return originalPath.replace("./", `${prefix}/`);
  }
  return originalPath;
}
// Simulate fetch response
function createFetchResponse(data) {
  return {
    ok: true,
    status: 200,
    headers: new Headers(),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}
// Simulate fetch response
function createFetchBadResponse(data) {
  return {
    ok: false,
    status: 404,
    headers: new Headers(),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}
