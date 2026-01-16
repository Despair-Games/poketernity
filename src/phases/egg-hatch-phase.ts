import type { AnySound } from "#app/audio-manager";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { Phase } from "#app/phase";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import type { Egg } from "#data/egg";
import type { EggHatchData } from "#data/egg-hatch-data";
import { UiMode } from "#enums/ui-mode";
import { EggCountChangedEvent } from "#events/egg";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { EggLapsePhase } from "#phases/egg-lapse-phase";
import { EggCounterContainer } from "#ui/egg-counter-container";
import type { EggHatchSceneUiHandler } from "#ui/egg-hatch-scene-ui-handler";
import { PokemonInfoContainer } from "#ui/pokemon-info-container";
import { fixedNumber, getFrameMs } from "#utils/common-utils";
import { randInt } from "#utils/random-utils";
import i18next from "i18next";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";

/**
 * Class that represents egg hatching
 */
export class EggHatchPhase extends Phase {
  public override readonly phaseName = "EggHatchPhase";

  /** The egg that is hatching */
  private readonly egg: Egg;
  /** The new EggHatchData for the egg/pokemon that hatches */
  private eggHatchData: EggHatchData;

  /** The number of eggs that are hatching */
  private eggsToHatchCount: number;
  /** The container that lists how many eggs are hatching */
  private eggCounterContainer: EggCounterContainer;

  /** The scene handler for egg hatching */
  private eggHatchHandler: EggHatchSceneUiHandler;
  /** The phaser gameobject container that holds everything */
  private eggHatchContainer: Phaser.GameObjects.Container;
  /** The phaser image that is the background */
  private eggHatchBg: Phaser.GameObjects.Image;
  /** The phaser rectangle that overlays during the scene */
  private eggHatchOverlay: Phaser.GameObjects.Rectangle;
  /** The phaser container that holds the egg */
  private eggContainer: Phaser.GameObjects.Container;
  /** The phaser sprite of the egg */
  private eggSprite: Phaser.GameObjects.Sprite;
  /** The phaser sprite of the cracks in an egg */
  private eggCrackSprite: Phaser.GameObjects.Sprite;
  /** The phaser sprite that represents the overlaid light rays */
  private eggLightraysOverlay: Phaser.GameObjects.Sprite;
  /** The phaser sprite of the hatched Pokemon */
  private pokemonSprite: Phaser.GameObjects.Sprite;
  /** The phaser sprite for shiny sparkles */
  private pokemonShinySparkle: Phaser.GameObjects.Sprite;

  /** The {@link PokemonInfoContainer} of the newly hatched Pokemon */
  private infoContainer: PokemonInfoContainer;

  /** The newly hatched {@link PlayerPokemon} */
  private pokemon: PlayerPokemon;
  /** The index of which egg move is unlocked. 0-2 is common, 3 is rare */
  private eggMoveIndex: number;

  // Internal booleans representing if the egg is hatched, able to be skipped, or skipped
  private hatched: boolean;
  private canSkip: boolean;
  private skipped: boolean;

  /** The sound effect being played when the egg is hatched */
  private evolutionBgm: AnySound;
  private readonly eggLapsePhase: EggLapsePhase;

  constructor(hatchScene: EggLapsePhase, egg: Egg, eggsToHatchCount: number) {
    super();

    this.eggLapsePhase = hatchScene;
    this.egg = egg;
    this.eggsToHatchCount = eggsToHatchCount;
  }

  public override async start(): Promise<void> {
    const { add, audioManager, fieldUI, gameData, spritePipeline, time, ui } = globalScene;

    await ui.setModeForceTransition<EggHatchSceneUiHandler>(UiMode.EGG_HATCH_SCENE);

    if (!this.egg) {
      return this.end();
    }

    const eggIndex = gameData.eggs.findIndex((e) => e.id === this.egg.id);
    if (eggIndex === -1) {
      return this.end();
    }

    gameData.eggs.splice(eggIndex, 1);

    audioManager.fadeOutBgm(undefined, false);

    // TODO: the hatch phase and ui handler should not be intertwined in this way;
    // the phase also should not be the one creating the graphical objects
    this.eggHatchHandler = ui.getCurrentHandler<EggHatchSceneUiHandler>();

    this.eggHatchContainer = this.eggHatchHandler.eggHatchContainer;

    this.eggHatchBg = add //
      .image(0, 0, "default_bg")
      .setOrigin(0);
    this.eggHatchContainer.add(this.eggHatchBg);

    this.eggContainer = add.container(this.eggHatchBg.displayWidth / 2, this.eggHatchBg.displayHeight / 2);

    this.eggSprite = add.sprite(0, 0, "egg", `egg_${this.egg.getKey()}`);
    this.eggCrackSprite = add //
      .sprite(0, 0, "egg_crack", "0")
      .setVisible(false);

    this.eggLightraysOverlay = add
      .sprite(-this.eggHatchBg.displayWidth / 2 + 4, -this.eggHatchBg.displayHeight / 2, "egg_lightrays", "3")
      .setOrigin(0)
      .setVisible(false);

    this.eggContainer.add([this.eggSprite, this.eggCrackSprite, this.eggLightraysOverlay]);
    this.eggHatchContainer.add(this.eggContainer);

    this.eggCounterContainer = new EggCounterContainer(this.eggsToHatchCount);
    this.eggHatchContainer.add(this.eggCounterContainer);

    const getPokemonSprite = (): Phaser.GameObjects.Sprite => {
      const ret = add
        .sprite(this.eggHatchBg.displayWidth / 2, this.eggHatchBg.displayHeight / 2, "pkmn__sub")
        .setPipeline(spritePipeline, { tone: [0.0, 0.0, 0.0, 0.0], ignoreTimeTint: true });
      return ret;
    };

    this.pokemonSprite = getPokemonSprite();
    this.eggHatchContainer.add(this.pokemonSprite);

    this.pokemonShinySparkle = add //
      .sprite(this.pokemonSprite.x, this.pokemonSprite.y, "shiny")
      .setVisible(false);

    this.eggHatchContainer.add(this.pokemonShinySparkle);

    this.eggHatchOverlay = add //
      .rectangle(0, -GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT, 0xffffff)
      .setOrigin(0)
      .setAlpha(0);
    fieldUI.add(this.eggHatchOverlay);

    this.infoContainer = new PokemonInfoContainer();
    this.infoContainer.setup();

    this.eggHatchContainer.add(this.infoContainer);

    const pokemon = this.generatePokemon();

    this.pokemonSprite.setVisible(false);

    this.pokemon = pokemon;

    await pokemon.loadAssets();
    this.canSkip = true;

    time.delayedCall(1000, () => {
      if (!this.hatched) {
        this.evolutionBgm = audioManager.playSoundWithoutBgm("evolution");
      }
    });

    // TODO: Is there a better way to handle these `if (hatched)` checks?
    time.delayedCall(2000, async () => {
      if (this.hatched) {
        return;
      }
      this.eggCrackSprite.setVisible(true);
      this.doSpray(1, this.eggSprite.displayHeight / -2);
      await this.doEggShake(2);
      if (this.hatched) {
        return;
      }
      time.delayedCall(1000, async () => {
        if (this.hatched) {
          return;
        }
        this.doSpray(2, this.eggSprite.displayHeight / -4);
        this.eggCrackSprite.setFrame("1");
        time.delayedCall(125, () => this.eggCrackSprite.setFrame("2"));
        await this.doEggShake(4);
        if (this.hatched) {
          return;
        }
        time.delayedCall(1000, async () => {
          if (this.hatched) {
            return;
          }
          audioManager.playSound("se/egg_crack");
          this.doSpray(4);
          this.eggCrackSprite.setFrame("3");
          time.delayedCall(125, () => this.eggCrackSprite.setFrame("4"));
          await this.doEggShake(8, 2);
          if (!this.hatched) {
            this.doHatch();
          }
        });
      });
    });
  }

  public override end(): void {
    const { time, phaseManager } = globalScene;

    if (phaseManager.findPhaseOfType("EggHatchPhase")) {
      // There are more eggs about to hatch, clear up the handler
      this.eggHatchHandler.prepareForNextEgg();
    } else {
      // There are no more hatching eggs, re enable the modifiers
      time.delayedCall(250, () => globalScene.setModifiersVisible(true));
    }

    this.pokemon?.destroy();

    super.end();
  }

  /**
   * Function that animates egg shaking
   * @param intensity - The intensity of the horizontal shaking. Doubled on the first call (where count is `0`)
   * @param repeatCount - The number of times this function should be called (asynchronous recursion?!?)
   * @param count - The current number of times this function has been called.
   */
  // TODO: use `playTween`
  protected async doEggShake(intensity: number, repeatCount: number = 0, count: number = 0): Promise<void> {
    const { audioManager, tweens } = globalScene;

    return new Promise((resolve) => {
      audioManager.playSound("se/pb_move");
      tweens.add({
        targets: this.eggContainer,
        x: `-=${intensity / (count ? 1 : 2)}`,
        ease: "Sine.easeInOut",
        duration: 125,
        onComplete: () => {
          tweens.add({
            targets: this.eggContainer,
            x: `+=${intensity}`,
            ease: "Sine.easeInOut",
            duration: 250,
            onComplete: async () => {
              count++;
              if (count < repeatCount) {
                await this.doEggShake(intensity, repeatCount, count);
                return resolve();
              }
              tweens.add({
                targets: this.eggContainer,
                x: `-=${intensity / 2}`,
                ease: "Sine.easeInOut",
                duration: 125,
                onComplete: () => resolve(),
              });
            },
          });
        },
      });
    });
  }

  /**
   * Tries to skip the hatching animation
   * @returns false if cannot be skipped or already skipped. True otherwise
   */
  public trySkip(): boolean {
    if (!this.canSkip || this.skipped) {
      return false;
    }
    if (this.eggCounterContainer.eggCountText?.data === undefined) {
      return false;
    }
    this.skipped = true;
    if (this.hatched) {
      this.doReveal();
    } else {
      this.doHatch();
    }
    return true;
  }

  /**
   * Plays the animation of an egg hatch
   */
  protected doHatch(): void {
    const { audioManager, time, tweens } = globalScene;

    this.canSkip = false;
    this.hatched = true;
    if (this.evolutionBgm) {
      SoundFade.fadeOut(globalScene, this.evolutionBgm, fixedNumber(100));
    }
    for (let e = 0; e < 5; e++) {
      time.delayedCall(fixedNumber(375 * e), () => audioManager.playSound("se/egg_hatch", { volume: 1 - e * 0.2 }));
    }
    this.eggLightraysOverlay //
      .setVisible(true)
      .play("egg_lightrays");
    tweens.add({
      duration: fixedNumber(125),
      targets: this.eggHatchOverlay,
      alpha: 1,
      ease: "Cubic.easeIn",
      onComplete: () => {
        this.skipped = false;
        this.canSkip = true;
      },
    });
    time.delayedCall(fixedNumber(1500), () => {
      this.canSkip = false;
      if (!this.skipped) {
        this.doReveal();
      }
    });
  }

  /**
   * Function to do the logic and animation of completing a hatch and revealing the Pokemon
   */
  protected doReveal(): void {
    const { animations, audioManager, gameData, time, tweens, ui } = globalScene;
    // set the previous dex data so info container can show new unlocks in egg summary
    const isShiny = this.pokemon.isShiny();
    this.eggContainer.setVisible(false);

    const spriteKey = this.pokemon.getSpriteKey(true);
    this.pokemonSprite.play(spriteKey);

    this.pokemonSprite
      .setPipelineData("ignoreTimeTint", true)
      .setPipelineData("spriteKey", this.pokemon.getSpriteKey())
      .setVisible(true);

    time.delayedCall(fixedNumber(250), () => {
      this.eggsToHatchCount--;
      this.eggHatchHandler.eventTarget.dispatchEvent(new EggCountChangedEvent(this.eggsToHatchCount));
      this.pokemon.cry();
      if (isShiny) {
        time.delayedCall(fixedNumber(500), () => {
          animations.doShinySparkleAnim(this.pokemonShinySparkle, this.pokemon.variant);
        });
      }
      time.delayedCall(fixedNumber((isShiny ? 750 : 250) + (this.skipped ? 0 : 1000)), async () => {
        await this.infoContainer.show(this.pokemon, false, this.skipped ? 2 : 1);

        audioManager.playSoundWithoutBgm("evolution_fanfare");

        ui.showText(i18next.t("egg:hatchFromTheEgg", { pokemonName: getPokemonNameWithAffix(this.pokemon) }), {
          callback: async () => {
            gameData.updateSpeciesDexIvs(this.pokemon.species.speciesId, this.pokemon.ivs);
            await gameData.setPokemonCaught(this.pokemon, true, true);
            const value = await gameData.setEggMoveUnlocked(this.pokemon.species, this.eggMoveIndex);
            this.eggHatchData.setEggMoveUnlocked(value);
            ui.showText("", { delay: 0 });
            this.end();
          },
          prompt: true,
          promptDelay: 3000,
        });
      });
    });
    tweens.add({
      duration: fixedNumber(this.skipped ? 500 : 3000),
      targets: this.eggHatchOverlay,
      alpha: 0,
      ease: "Cubic.easeOut",
    });
  }

  /**
   * Animates spraying
   * @param repeats number of times this is repeated
   * @param offsetY how much to offset the Y coordinates
   */
  protected doSpray(repeats: number, offsetY: number = 0): void {
    globalScene.tweens.addCounter({
      repeat: repeats,
      duration: getFrameMs(1),
      onRepeat: () => {
        this.doSprayParticle(randInt(8), offsetY);
      },
    });
  }

  /**
   * Animates a particle used in the spray animation
   * @param trigIndex Used to modify the particle's vertical speed
   * @param offsetY how much to offset the Y coordinate
   */
  protected doSprayParticle(trigIndex: number, offsetY: number): void {
    const { add, animations, tweens } = globalScene;

    const initialX = this.eggHatchBg.displayWidth / 2;
    const initialY = this.eggHatchBg.displayHeight / 2 + offsetY;
    const shardKey = this.egg.isManaphyEgg() ? "1" : this.egg.tier.toString();
    const particle = add.image(initialX, initialY, "egg_shard", `${shardKey}_${Math.floor(trigIndex / 2)}`);
    this.eggHatchContainer.add(particle);

    let f = 0;
    let yOffset = 0;
    const speed = 3 - randInt(8);
    const amp = 24 + randInt(32);

    const particleTimer = tweens.addCounter({
      repeat: -1,
      duration: getFrameMs(1),
      onRepeat: () => {
        updateParticle();
      },
    });

    const updateParticle = (): void => {
      const speedMultiplier = this.skipped ? 6 : 1;
      yOffset += speedMultiplier;
      if (trigIndex < 160) {
        particle.setPosition(initialX + (speed * f) / 3, initialY + yOffset);
        particle.y += -animations.sin(trigIndex, amp);
        if (f > 108) {
          particle.setScale(1 - (f - 108) / 20);
        }
        trigIndex += 2 * speedMultiplier;
        f += speedMultiplier;
      } else {
        particle.destroy();
        particleTimer.remove();
      }
    };

    updateParticle();
  }

  /**
   * Generates a Pokemon to be hatched by the egg
   * Also stores the generated pokemon in this.eggHatchData
   * @returns the hatched PlayerPokemon
   */
  protected generatePokemon(): PlayerPokemon {
    this.eggHatchData = this.eggLapsePhase.generatePokemon(this.egg);
    this.eggMoveIndex = this.eggHatchData.eggMoveIndex;
    return this.eggHatchData.pokemon;
  }
}
