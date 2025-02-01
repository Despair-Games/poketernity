import Phaser from "phaser";
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin";
import TransitionImagePackPlugin from "phaser3-rex-plugins/templates/transitionimagepack/transitionimagepack-plugin";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import pkg from "../package.json";
import InvertPostFX from "./pipelines/invert";
import { LoadingScene } from "./loading-scene";
import BattleScene from "./battle-scene";
import { CANVAS_SCALE, GAME_HEIGHT, GAME_WIDTH } from "./ui-constants";

export const game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: "app",
  scale: {
    width: GAME_WIDTH * CANVAS_SCALE,
    height: GAME_HEIGHT * CANVAS_SCALE,
    mode: Phaser.Scale.FIT,
  },
  plugins: {
    global: [
      {
        key: "rexInputTextPlugin",
        plugin: InputTextPlugin,
        start: true,
      },
      {
        key: "rexBBCodeTextPlugin",
        plugin: BBCodeTextPlugin,
        start: true,
      },
      {
        key: "rexTransitionImagePackPlugin",
        plugin: TransitionImagePackPlugin,
        start: true,
      },
    ],
    scene: [
      {
        key: "rexUI",
        plugin: UIPlugin,
        mapping: "rexUI",
      },
    ],
  },
  input: {
    mouse: {
      target: "app",
    },
    touch: {
      target: "app",
    },
    gamepad: true,
  },
  dom: {
    createContainer: true,
  },
  pixelArt: true,
  pipeline: [InvertPostFX] as unknown as Phaser.Types.Core.PipelineConfig,
  scene: [LoadingScene, BattleScene],
  version: pkg.version,
});
