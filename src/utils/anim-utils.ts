/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { initCommonAnims } from "#init/init-common-anims";
import type { initEncounterAnims } from "#init/init-encounter-anims";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { LegacyAnimConfig } from "#animations/anim-config";
import { commonAnims } from "#animations/common-anims";
import { encounterAnims } from "#animations/encounter-anims";
import { globalScene } from "#app/global-scene";
import type { SceneBase } from "#app/scene-base";
import { ImagesFolder } from "#enums/images-folder";

type TweenBuilderConfig = Phaser.Types.Tweens.TweenBuilderConfig;
type NumberTweenBuilderConfig = Phaser.Types.Tweens.NumberTweenBuilderConfig;

export function loadAnimAssets(anims: LegacyAnimConfig[], startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    const backgrounds = new Set<string>();
    const sounds = new Set<string>();
    for (const a of anims) {
      if (!a.frames?.length) {
        continue;
      }
      const animSounds = a.getSoundResourceNames();
      for (const ms of animSounds) {
        sounds.add(ms);
      }
      const animBackgrounds = a.getBackgroundResourceNames();
      for (const abg of animBackgrounds) {
        backgrounds.add(abg);
      }
      if (a.graphic) {
        globalScene.loadSpritesheet(a.graphic, ImagesFolder.BATTLE_ANIMS, 96);
      }
    }
    for (const bg of backgrounds) {
      globalScene.loadImage(bg, ImagesFolder.BATTLE_ANIMS);
    }
    for (const s of sounds) {
      globalScene.loadSe(s, "battle_anims", s);
    }
    if (startLoad) {
      globalScene.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
      if (!globalScene.load.isLoading()) {
        globalScene.load.start();
      }
    } else {
      resolve();
    }
  });
}

/**
 * Loads common animation assets to scene.
 *
 * **Must** be called after {@linkcode initCommonAnims} to load all required animations properly.
 */
export function loadCommonAnimAssets(startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    loadAnimAssets(Array.from(commonAnims.values()), startLoad).then(() => resolve());
  });
}

/**
 * Loads mystery encounter animation assets to scene.
 *
 * **MUST** be called after {@linkcode initEncounterAnims} to load all required animations properly.
 */
export async function loadEncounterAnimAssets(startLoad?: boolean): Promise<void> {
  await loadAnimAssets(Array.from(encounterAnims.values()), startLoad);
}

/**
 * If awaited, this delays execution for a set time using the given Scene's internal timer.
 * @param time - The time (ms) to delay execution. Use {@linkcode fixedNumber}
 *   on the value to prevent the game speed from affecting the duration of the delay.
 * @param scene - The {@linkcode SceneBase} whose timer is used to delay execution
 * (default {@linkcode globalScene})
 */
export async function delay(time: number, scene: SceneBase = globalScene): Promise<void> {
  await new Promise((resolve) => scene.time.delayedCall(time, resolve));
}

/**
 * Plays a Tween animation, resolving once the animation completes.
 * @param config - The config for a single Tween
 * @param scene - The {@linkcode SceneBase} on which the Tween plays (Default {@linkcode globalScene})
 *
 * @privateRemarks
 * The `config` input should not include an `onComplete` field as that callback is
 * used to resolve the Promise containing the Tween animation. However, `config`'s type
 * cannot be changed to something like `Omit<TweenBuilderConfig, "onComplete">` due to
 * how Phaser interprets `TweenBuilderConfig` inputs.
 */
export async function playTween(config: TweenBuilderConfig, scene: SceneBase = globalScene): Promise<void> {
  await new Promise((resolve) =>
    scene.tweens.add({
      ...config,
      onComplete: resolve,
    }),
  );
}

/**
 * Runs a NumberTween and resolves once the animation completes.
 * @param config - The config for a single NumberTween
 * @param scene - The {@linkcode SceneBase} on which the NumberTween plays (Default {@linkcode globalScene})
 *
 * @privateRemarks
 * The `config` input should not include an `onComplete` field as that callback is
 * used to resolve the Promise containing the Tween animation. However, `config`'s type
 * cannot be changed to something like `Omit<TweenBuilderConfig, "onComplete">` due to
 * how Phaser interprets `NumberTweenBuilderConfig` inputs.
 */
export async function playNumberTween(config: NumberTweenBuilderConfig, scene: SceneBase = globalScene): Promise<void> {
  await new Promise((resolve) =>
    scene.tweens.addCounter({
      ...config,
      onComplete: resolve,
    }),
  );
}
