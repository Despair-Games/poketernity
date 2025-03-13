import BattleScene from "#app/battle-scene";
import { MoveAnim } from "#app/data/animations/move-anim";
import { Pokemon } from "#app/field/pokemon";
import { MockClock } from "#test/test-utils/mocks/mockClock";
import { MockGameObjectCreator } from "#test/test-utils/mocks/mockGameObjectCreator";
import { MockLoader } from "#test/test-utils/mocks/mockLoader";
import { MockTextureManager } from "#test/test-utils/mocks/mockTextureManager";
import fs from "fs";
import Phaser from "phaser";
import { vi } from "vitest";
import { version } from "../../package.json";
import * as constants from "#app/constants";
import InputManager = Phaser.Input.InputManager;
import KeyboardManager = Phaser.Input.Keyboard.KeyboardManager;
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import GamepadPlugin = Phaser.Input.Gamepad.GamepadPlugin;
import EventEmitter = Phaser.Events.EventEmitter;
import UpdateList = Phaser.GameObjects.UpdateList;
import { MockConsole } from "#test/test-utils/mocks/mockConsole";
import { globalScene } from "#app/global-scene";
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";

export class GameWrapper {
  public game: Phaser.Game;
  public scene: BattleScene;

  private static originalDamage = Pokemon.prototype.damage;

  constructor(phaserGame: Phaser.Game, bypassLoginMockTrue: boolean) {
    Phaser.Math.RND.sow(["test"]);
    // vi.spyOn(Utils, "apiFetch", "get").mockReturnValue(fetch);
    if (bypassLoginMockTrue) {
      vi.spyOn(constants, "bypassLogin", "get").mockReturnValue(true);
    }
    this.game = phaserGame;
    MoveAnim.prototype.getAnim = () =>
      ({
        frames: {} as any,
      }) as any;
    Pokemon.prototype.enableMask = () => null;
    Pokemon.prototype.cry = () => null as any;
    Pokemon.prototype.faintCry = (cb) => {
      if (cb) cb();
    };

    Pokemon.prototype.damage = function (...args) {
      const pokemon: Pokemon = this;
      const ret = GameWrapper.originalDamage.apply(pokemon, args);

      const side = pokemon.isPlayer() ? "Player" : "Enemy";
      const lowHpMoves = [MoveId.FALSE_SWIPE, MoveId.HARD_PRESS];
      const currentPhase = globalScene.getCurrentPhase();
      let moveName = "N/A";
      let moveId = MoveId.NONE;
      if (currentPhase?.is<MoveEffectPhase>(PhaseId.MOVE_EFFECT)) {
        const move = currentPhase.move;
        moveName = move.getName();
        moveId = move.moveId;
      }
      const isLowHpMove = lowHpMoves.includes(moveId);
      /**
       * Warn about Pokemon reaching low HP, as a measure to prevent flaky tests from Pokemon randomly fainting.
       *
       * The list of conditions required for the warning to show up are:
       * - The Pokemon actually took damage (`ret > 0`)
       * - The Pokemon is under 20% HP
       * - The Pokemon is not fainted
       * - The Pokemon is not using Endure
       * - The Pokemon was not damaged by a move that intentionally involves low HP (False Swipe, Hard Press, etc.)
       */
      if (
        ret > 0
        && pokemon.getHpRatio() < 0.2
        && !pokemon.isFainted()
        && !pokemon.getTag(BattlerTagType.ENDURING)
        && !isLowHpMove
      ) {
        const line1 = `Caution: ${side} ${pokemon.name} was damaged to low HP (${pokemon.hp}/${pokemon.getMaxHp()}) by the move ${moveName}!\n`;
        const line2 = `Make sure that the test cannot break from the Pokemon accidentally fainting!`;
        MockConsole.queuePostTestWarning(line1 + line2);
        console.warn(line1 + line2);
      }
      return ret;
    };

    BattleScene.prototype.addPokemonIcon = () => new Phaser.GameObjects.Container(this.scene);
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
      get: () =>
        ({
          ...this.scene.sound,
          totalDuration: 0,
        }) as any,
      getAllPlaying: () => [],
      manager: {
        game: this.game,
      },
      destroy: () => null,
      setVolume: () => null,
      stop: () => null,
      stopByKey: () => null as any,
      on: (_evt, callback) => callback(),
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
    this.scene.cachedFetch = (url, _init) => {
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

    Pokemon.prototype.updateInfo = async () => {};
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
