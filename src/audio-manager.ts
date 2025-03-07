import type BattleScene from "#app/battle-scene";
import { PRSFX_SOUND_ADJUSTMENT_RATIO } from "#app/constants";
import { bgmLoopPoint } from "#app/data/bgm-loop-point";
import { settings } from "#app/system/settings/settings-manager";
import { fixedNumber } from "#app/utils";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";

export type AnySound = Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

/**
 * Manages audio playback in the game.
 */
export class AudioManager {
  private bgm: AnySound;
  private bgmResumeTimer: Phaser.Time.TimerEvent | null;
  private bgmCache: Set<string> = new Set();

  private scene: BattleScene;

  constructor(scene: BattleScene) {
    this.scene = scene;
  }

  /**
   * Updates the volume of a sound based on its key.
   */
  public updateSoundVolume(): void {
    if (this.scene.sound) {
      for (const sound of this.scene.sound.getAllPlaying() as AnySound[]) {
        if (this.bgmCache.has(sound.key)) {
          sound.setVolume(settings.effectiveBgmVolume);
        } else {
          const soundDetails = sound.key.split("/");
          switch (soundDetails[0]) {
            case "battle_anims":
            case "cry":
              if (soundDetails[1].startsWith("PRSFX- ")) {
                sound.setVolume(settings.effectiveFieldVolume * PRSFX_SOUND_ADJUSTMENT_RATIO);
              } else {
                sound.setVolume(settings.effectiveFieldVolume);
              }
              break;
            case "se":
            case "ui":
              sound.setVolume(settings.effectiveSoundEffectsVolume);
          }
        }
      }
    }
  }

  /**
   * Plays a sound effect with the given key.
   * @param sound - The sound effect to play.
   * @param config - Configuration options for the sound effect.
   * @returns The sound effect that was played.
   */
  public playSound(sound: string | AnySound, config: object = {}): AnySound {
    const key = typeof sound === "string" ? sound : sound.key;
    try {
      const keyDetails = key.split("/");
      config["volume"] = config["volume"] ?? 1;
      switch (keyDetails[0]) {
        case "level_up_fanfare":
        case "item_fanfare":
        case "minor_fanfare":
        case "heal":
        case "evolution":
        case "evolution_fanfare":
          // These sounds are loaded in as BGM, but played as sound effects
          // When these sounds are updated in updateVolume(), they are treated as BGM however because they are placed in the BGM Cache through being called by playSoundWithoutBGM()
          config["volume"] *= settings.effectiveBgmVolume;
          break;
        case "battle_anims":
        case "cry":
          config["volume"] *= settings.effectiveFieldVolume;
          //PRSFX sound files are unusually loud
          if (keyDetails[1].startsWith("PRSFX- ")) {
            config["volume"] *= PRSFX_SOUND_ADJUSTMENT_RATIO;
          }
          break;
        case "ui":
          //As of, right now this applies to the "select", "menu_open", "error" sound effects
          config["volume"] *= settings.effectiveUiVolume;
          break;
        case "se":
          config["volume"] *= settings.effectiveSoundEffectsVolume;
          break;
      }
      this.scene.sound.play(key, config);
      return this.scene.sound.get(key) as AnySound;
    } catch {
      console.log(`${key} not found`);
      return sound as AnySound;
    }
  }

  /**
   * Plays a sound effect with the given key, without affecting the current BGM.
   * @param soundName - The name of the sound effect to play.
   * @param pauseDuration - The duration to pause the BGM for, in milliseconds.
   * @returns The sound effect that was played.
   */
  public playSoundWithoutBgm(soundName: string, pauseDuration?: number): AnySound {
    this.bgmCache.add(soundName);
    const isBgmPaused = this.pauseBgm();
    this.playSound(soundName);
    const sound = this.scene.sound.get(soundName) as AnySound;
    if (this.bgmResumeTimer) {
      this.bgmResumeTimer.destroy();
    }
    if (isBgmPaused) {
      this.bgmResumeTimer = this.scene.time.delayedCall(
        pauseDuration || fixedNumber(sound.totalDuration * 1000),
        () => {
          this.resumeBgm();
          this.bgmResumeTimer = null;
        },
      );
    }
    return sound;
  }

  /**
   * Fades out the current BGM track.
   * @param duration - The duration of the fade out, in milliseconds.
   * @param destroy - If `true`, the BGM will be destroyed after fading out.
   * @returns `true` if the BGM was faded out, `false` otherwise.
   */
  public fadeOutBgm(duration: number = 500, destroy: boolean = true): boolean {
    if (!this.bgm) {
      return false;
    }
    const bgm = this.scene.sound.getAllPlaying().find((bgm) => bgm.key === this.bgm.key);
    if (bgm) {
      SoundFade.fadeOut(this.scene, this.bgm, duration, destroy);
      return true;
    }

    return false;
  }

  /**
   * Fades out current track for `delay` ms, then fades in new track.
   * @param newBgmKey - The key of the new BGM track to play.
   * @param destroy - If `true`, the current BGM will be destroyed after fading out.
   * @param delay - The delay in milliseconds before the new BGM starts playing.
   */
  public fadeAndSwitchBgm(newBgmKey: string, destroy: boolean = false, delay: number = 2000) {
    this.fadeOutBgm(delay, destroy);
    this.scene.time.delayedCall(delay, () => {
      this.playBgm(newBgmKey);
    });
  }

  /**
   * Plays a BGM track.
   * @param bgmName - The name of the BGM track to play. If not provided, the default BGM track for the current scene will be played.
   * @param fadeOut - If true, the current BGM track will fade out before the new track starts playing.
   */
  public playBgm(bgmName?: string, fadeOut?: boolean): void {
    if (bgmName === undefined) {
      bgmName = this.scene.currentBattle?.getBgmOverride() || this.scene.arena?.bgm;
    }
    if (this.bgm && bgmName === this.bgm.key) {
      if (!this.bgm.isPlaying) {
        this.bgm.play({
          volume: settings.effectiveBgmVolume,
        });
      }
      return;
    }
    if (fadeOut && !this.bgm) {
      fadeOut = false;
    }
    this.bgmCache.add(bgmName);
    this.scene.loadBgm(bgmName);
    let loopPoint = 0;
    loopPoint = bgmName === this.scene.arena.bgm ? this.scene.arena.getBgmLoopPoint() : this.getBgmLoopPoint(bgmName);
    let loaded = false;
    const playNewBgm = () => {
      this.scene.ui.bgmBar.setBgmToBgmBar(bgmName);
      if (bgmName === null && this.bgm && !this.bgm.pendingRemove) {
        this.bgm.play({
          volume: settings.effectiveBgmVolume,
        });
        return;
      }
      if (this.bgm && !this.bgm.pendingRemove && this.bgm.isPlaying) {
        this.bgm.stop();
      }
      this.bgm = this.scene.sound.add(bgmName, { loop: true });
      this.bgm.play({
        volume: settings.effectiveBgmVolume,
      });
      if (loopPoint) {
        this.bgm.on("looped", () => this.bgm.play({ seek: loopPoint }));
      }
    };
    this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      loaded = true;
      if (!fadeOut || !this.bgm.isPlaying) {
        playNewBgm();
      }
    });
    if (fadeOut) {
      const onBgmFaded = () => {
        if (loaded && (!this.bgm.isPlaying || this.bgm.pendingRemove)) {
          playNewBgm();
        }
      };
      this.scene.time.delayedCall(this.fadeOutBgm(500, true) ? 750 : 250, onBgmFaded);
    }
    if (!this.scene.load.isLoading()) {
      this.scene.load.start();
    }
  }

  /**
   * Checks if a BGM track is currently playing.
   * @returns `true` if a BGM track is playing, `false` otherwise.
   */
  public isBgmPlaying(): boolean {
    return !!this.bgm?.isPlaying;
  }

  /**
   * Gets the {@linkcode bgmLoopPoint | loop point} of a BGM track.
   * @param bgmName - The name of the BGM track to get the loop point for.
   * @returns The loop point of the BGM track, or 0 if no loop point is set.
   */
  private getBgmLoopPoint(bgmName: string): number {
    return bgmLoopPoint[bgmName] ?? 0;
  }

  /**
   * Pauses the current BGM track.
   * @returns `true` if the BGM was paused, `false` otherwise.
   */
  private pauseBgm(): boolean {
    if (this.bgm && !this.bgm.pendingRemove && this.bgm.isPlaying) {
      this.bgm.pause();
      return true;
    }
    return false;
  }

  /**
   * Resumes the current BGM track.
   * @returns `true` if the BGM was resumed, `false` otherwise.
   */
  private resumeBgm(): boolean {
    if (this.bgm && !this.bgm.pendingRemove && this.bgm.isPaused) {
      this.bgm.resume();
      return true;
    }
    return false;
  }
}
