import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
import type FadeIn from "phaser3-rex-plugins/plugins/audio/fade/FadeIn";
import type FadeOut from "phaser3-rex-plugins/plugins/audio/fade/FadeOut";
import { globalScene } from "#app/global-scene";
import { FixedNumber } from "#app/utils";
import { settings } from "#app/system/settings/settings-manager";

//#region Types

type FadeIn = typeof FadeIn;
type FadeOut = typeof FadeOut;

//#endregion

export function initGameSpeed() {
  /**
   * Adjusts the given value based on the game speed or returns it as is.
   * @param num - The value to be evaluated. Can be either a `number` or an instance of {@linkcode FixedNumber}.
   * @returns The original numeric value if `value` is an instance of {@linkcode FixedNumber} or if {@linkcode BattleScene.gameSpeed | gameSpeed} is `1`;
   * otherwise, the value adjusted for the game speed.
   */
  const transformValue = (num: number | FixedNumber): number => {
    if (num instanceof FixedNumber) {
      return num.value;
    }
    return settings.general.gameSpeed === 1 ? num : Math.ceil((num /= settings.general.gameSpeed));
  };

  const originalAddEvent = this.time.addEvent;
  this.time.addEvent = function (config: Phaser.Time.TimerEvent | Phaser.Types.Time.TimerEventConfig) {
    if (!(config instanceof Phaser.Time.TimerEvent) && config.delay) {
      config.delay = transformValue(config.delay);
    }
    return originalAddEvent.apply(this, [config]);
  };
  const originalTweensAdd = this.tweens.add;
  this.tweens.add = function (
    config:
      | Phaser.Types.Tweens.TweenBuilderConfig
      | Phaser.Types.Tweens.TweenChainBuilderConfig
      | Phaser.Tweens.Tween
      | Phaser.Tweens.TweenChain,
  ) {
    if (config.loopDelay) {
      config.loopDelay = transformValue(config.loopDelay as number);
    }

    if (!(config instanceof Phaser.Tweens.TweenChain)) {
      if (config.duration) {
        config.duration = transformValue(config.duration);
      }

      if (!(config instanceof Phaser.Tweens.Tween)) {
        if (config.delay) {
          config.delay = transformValue(config.delay as number);
        }
        if (config.repeatDelay) {
          config.repeatDelay = transformValue(config.repeatDelay);
        }
        if (config.hold) {
          config.hold = transformValue(config.hold);
        }
      }
    }
    return originalTweensAdd.apply(this, [config]);
  };
  const originalTweensChain = this.tweens.chain;
  this.tweens.chain = function (config: Phaser.Types.Tweens.TweenChainBuilderConfig): Phaser.Tweens.TweenChain {
    if (config.tweens) {
      config.tweens.forEach((t) => {
        if (t.duration) {
          t.duration = transformValue(t.duration);
        }
        if (t.delay) {
          t.delay = transformValue(t.delay as number);
        }
        if (t.repeatDelay) {
          t.repeatDelay = transformValue(t.repeatDelay);
        }
        if (t.loopDelay) {
          t.loopDelay = transformValue(t.loopDelay as number);
        }
        if (t.hold) {
          t.hold = transformValue(t.hold);
        }
      });
    }
    return originalTweensChain.apply(this, [config]);
  };
  const originalAddCounter = this.tweens.addCounter;
  this.tweens.addCounter = function (config: Phaser.Types.Tweens.NumberTweenBuilderConfig) {
    if (config.duration) {
      config.duration = transformValue(config.duration);
    }
    if (config.delay) {
      config.delay = transformValue(config.delay);
    }
    if (config.repeatDelay) {
      config.repeatDelay = transformValue(config.repeatDelay);
    }
    if (config.loopDelay) {
      config.loopDelay = transformValue(config.loopDelay as number);
    }
    if (config.hold) {
      config.hold = transformValue(config.hold);
    }
    return originalAddCounter.apply(this, [config]);
  };

  const originalFadeOut = SoundFade.fadeOut;
  SoundFade.fadeOut = ((_scene: Phaser.Scene, sound: Phaser.Sound.BaseSound, duration: number, destroy?: boolean) =>
    originalFadeOut(globalScene, sound, transformValue(duration), destroy)) as FadeOut;

  const originalFadeIn = SoundFade.fadeIn;
  SoundFade.fadeIn = ((
    _scene: Phaser.Scene,
    sound: string | Phaser.Sound.BaseSound,
    duration: number,
    endVolume?: number,
    startVolume?: number,
  ) => originalFadeIn(globalScene, sound, transformValue(duration), endVolume, startVolume)) as FadeIn;
}
