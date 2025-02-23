import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
import { bgmLoopPoint } from "./data/bgm-loop-point";
import { settings } from "./system/settings/settings-manager";
import { PRSFX_SOUND_ADJUSTMENT_RATIO } from "./constants";
import { fixedNumber } from "./utils";
import type BattleScene from "./battle-scene";

export type AnySound = Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

export class AudioManager {
  private bgm: AnySound;
  private bgmResumeTimer: Phaser.Time.TimerEvent | null;
  private bgmCache: Set<string> = new Set();

  private scene: BattleScene;

  constructor(scene: BattleScene) {
    this.scene = scene;
  }

  updateSoundVolume(): void {
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

  playSound(sound: string | AnySound, config?: object): AnySound {
    const key = typeof sound === "string" ? sound : sound.key;
    config = config ?? {};
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

  playSoundWithoutBgm(soundName: string, pauseDuration?: number): AnySound {
    this.bgmCache.add(soundName);
    const resumeBgm = this.pauseBgm();
    this.playSound(soundName);
    const sound = this.scene.sound.get(soundName) as AnySound;
    if (this.bgmResumeTimer) {
      this.bgmResumeTimer.destroy();
    }
    if (resumeBgm) {
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

  pauseBgm(): boolean {
    if (this.bgm && !this.bgm.pendingRemove && this.bgm.isPlaying) {
      this.bgm.pause();
      return true;
    }
    return false;
  }

  resumeBgm(): boolean {
    if (this.bgm && !this.bgm.pendingRemove && this.bgm.isPaused) {
      this.bgm.resume();
      return true;
    }
    return false;
  }

  fadeOutBgm(duration: number = 500, destroy: boolean = true): boolean {
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
   * @param newBgmKey
   * @param destroy
   * @param delay
   */
  fadeAndSwitchBgm(newBgmKey: string, destroy: boolean = false, delay: number = 2000) {
    this.fadeOutBgm(delay, destroy);
    this.scene.time.delayedCall(delay, () => {
      this.playBgm(newBgmKey);
    });
  }

  playBgm(bgmName?: string, fadeOut?: boolean): void {
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

  getBgmLoopPoint(bgmName: string): number {
    return bgmLoopPoint[bgmName] ?? 0;
  }

  isBgmPlaying(): boolean {
    return this.bgm && this.bgm.isPlaying;
  }
}
