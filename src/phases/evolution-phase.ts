import type { AnySound } from "#app/audio-manager";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { EVOLVE_MOVE } from "#constants/move-constants";
import type { SpeciesFormEvolution } from "#data/pokemon-evolutions";
import type { SpeciesId } from "#enums/species-id";
import { UiMode } from "#enums/ui-mode";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { FormChangeBasePhase } from "#phases/base/form-change-base-phase";
import type { FormChangePhase } from "#phases/form-change-phase";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import { delay, playNumberTween, playTween } from "#utils/anim-utils";
import { fixedNumber, ValueHolder } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import i18next from "i18next";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";

/**
 * A phase for handling Pokemon evolution
 * @see {@linkcode FormChangePhase} for general form changes
 */
export class EvolutionPhase extends FormChangeBasePhase {
  public override readonly phaseName = "EvolutionPhase";

  protected readonly lastLevel: number;

  private preEvolvedPokemonName: string;

  /** @todo why is this able to be `null`? */
  private readonly evolution: SpeciesFormEvolution | null;
  private evolutionBgm: AnySound;

  /**
   * A {@linkcode ValueHolder} whose value indicates whether or not the player has cancelled the evolution.
   */
  private readonly cancelled: ValueHolder<boolean> = new ValueHolder(false);

  constructor(pokemon: PlayerPokemon, evolution: SpeciesFormEvolution | null, lastLevel: number) {
    super(pokemon);

    this.pokemon = pokemon;
    this.evolution = evolution;
    this.lastLevel = lastLevel;
  }

  public override async start(): Promise<void> {
    if (this.evolution == null) {
      super.end();
      return;
    }

    this.preEvolvedPokemonName = getPokemonNameWithAffix(this.pokemon);
    await super.start();
  }

  public override async applyFormChange(): Promise<void> {
    const { ui } = globalScene;

    ui.showText(i18next.t("menu:evolving", { pokemonName: this.preEvolvedPokemonName }), {
      callback: async () => {
        const evolvedPokemon = await this.playEvolutionAnim();
        if (this.cancelled.value) {
          this.handleFailedEvolution(evolvedPokemon);
        } else {
          await this.handleSuccessEvolution(evolvedPokemon);
        }
      },
    });
  }

  /**
   * Plays an animation for the target Pokemon's evolution.
   * @returns The target {@linkcode Pokemon} after attempting to evolve it
   */
  private async playEvolutionAnim(): Promise<Pokemon> {
    const { animations, time, tweens } = globalScene;
    this.pokemon.cry();

    const evolvedPokemon = await this.pokemon.getPossibleEvolution(this.evolution);
    [this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].forEach((sprite) => {
      const spriteKey = evolvedPokemon.getSpriteKey(true);
      sprite.play(spriteKey);

      sprite.setPipelineData("ignoreTimeTint", true);
      sprite.setPipelineData("spriteKey", evolvedPokemon.getSpriteKey());
      let key = "spriteColors";
      if (evolvedPokemon.summonData.speciesForm) {
        key += "Base";
      }
      sprite.pipelineData[key] = evolvedPokemon.getSprite().pipelineData[key];
    });

    await delay(1000);
    this.evolutionBgm = globalScene.audioManager.playSoundWithoutBgm("evolution");
    await playTween({
      targets: this.bgOverlay,
      alpha: 1,
      delay: 500,
      duration: 1500,
      ease: "Sine.easeOut",
    });

    time.delayedCall(1000, () => {
      tweens.add({
        targets: this.bgOverlay,
        alpha: 0,
        duration: 250,
      });
      this.bgVideo.setVisible(true);
      this.bgVideo.play();
    });

    globalScene.audioManager.playSound("se/charge");
    animations.doSpiralUpward(this.baseBgImg, this.container);
    await playNumberTween({
      from: 0,
      to: 1,
      duration: 2000,
      onUpdate: (t) => {
        this.pokemonTintSprite.setAlpha(t.getValue() ?? 1);
      },
    });

    this.pokemonSprite.setVisible(false);

    await delay(1100);
    globalScene.audioManager.playSound("se/beam");
    animations.doArcDownward(this.baseBgImg, this.container);

    await delay(1500);
    this.pokemonNewFormTintSprite.setScale(0.25);
    this.pokemonNewFormTintSprite.setVisible(true);
    this.handler.canCancel = true;
    await animations.doCycle(1, 15, this.pokemonTintSprite, this.pokemonNewFormTintSprite, this.cancelled);

    return evolvedPokemon;
  }

  /**
   * Cancels the evolution and its animation.
   */
  public cancelEvolution(): void {
    this.cancelled.value = true;
  }

  /**
   * Handles a failed or interrupted evolution attempt
   * @param evolvedPokemon - The evolved Pokemon
   */
  private handleFailedEvolution(evolvedPokemon: Pokemon): void {
    const { time, tweens, ui } = globalScene;

    this.pokemonSprite.setVisible(true);
    this.pokemonTintSprite.setScale(1);
    tweens.add({
      targets: [this.bgVideo, this.pokemonTintSprite, this.pokemonNewFormSprite, this.pokemonNewFormTintSprite],
      alpha: 0,
      duration: 250,
      onComplete: () => {
        this.bgVideo.setVisible(false);
      },
    });

    SoundFade.fadeOut(globalScene, this.evolutionBgm, 100);

    globalScene.phaseManager.createAndUnshiftPhase("EndEvolutionPhase");

    ui.showText(i18next.t("menu:stoppedEvolving", { pokemonName: this.preEvolvedPokemonName }), {
      callback: () => {
        ui.showText(i18next.t("menu:pauseEvolutionsQuestion", { pokemonName: this.preEvolvedPokemonName }), {
          callback: () => {
            const end = (): void => {
              ui.showText("", { delay: 0 });
              globalScene.audioManager.playBgm();
              evolvedPokemon.destroy();
              this.end();
            };
            const options: ConfirmModeConfig = {
              yesHandler: () => {
                ui.revertMode();
                this.pokemon.pauseEvolutions = true;
                ui.showText(i18next.t("menu:evolutionsPaused", { pokemonName: this.preEvolvedPokemonName }), {
                  callback: end,
                  callbackDelay: 3000,
                });
              },
              noHandler: () => {
                ui.revertMode();
                time.delayedCall(3000, end);
              },
            };
            ui.setOverlayMode<ConfirmUiHandler>(UiMode.CONFIRM, options);
          },
        });
      },
      prompt: true,
    });
  }

  /**
   * Handles a successful evolution attempt
   * @param evolvedPokemon - The evolved Pokemon
   */
  private async handleSuccessEvolution(evolvedPokemon: Pokemon): Promise<void> {
    const { animations, audioManager, ui, phaseManager } = globalScene;

    globalScene.audioManager.playSound("se/sparkle");
    this.pokemonNewFormSprite.setVisible(true);
    animations.doCircleInward(this.baseBgImg, this.container);

    await delay(900);
    this.handler.canCancel = false;
    const unlockedStarters = await this.pokemon.evolve(this.evolution);

    const levelMoves = this.pokemon
      .getLevelMoves(this.lastLevel + 1, true, false, false)
      .filter(([level]) => level === EVOLVE_MOVE);
    for (const [, moveId] of levelMoves) {
      phaseManager.createAndUnshiftPhase("LearnMovePhase", globalScene.getPlayerParty().indexOf(this.pokemon), moveId);
    }
    phaseManager.createAndUnshiftPhase("EndEvolutionPhase");

    audioManager.playSound("se/shine");
    animations.doSpray(this.baseBgImg, this.container);
    await playTween({
      targets: this.overlay,
      alpha: 1,
      duration: 250,
      ease: "Sine.easeIn",
    });

    this.bgOverlay.setAlpha(1);
    this.bgVideo.setVisible(false);

    await playTween({
      targets: [this.overlay, this.pokemonNewFormTintSprite],
      alpha: 0,
      duration: 2000,
      delay: 150,
      ease: "Sine.easeIn",
    });

    await playTween({
      targets: this.bgOverlay,
      alpha: 0,
      duration: 250,
    });

    SoundFade.fadeOut(globalScene, this.evolutionBgm, 100);
    await delay(250);

    this.pokemon.cry();
    await delay(1250);
    audioManager.playSoundWithoutBgm("evolution_fanfare");
    evolvedPokemon.destroy();

    ui.showText(
      i18next.t("menu:evolutionDone", {
        pokemonName: this.preEvolvedPokemonName,
        evolvedPokemonName: this.pokemon.name,
      }),
      {
        callback: async () => {
          await this.showStarterUnlockText(unlockedStarters);
          this.end();
        },
        prompt: true,
        promptDelay: fixedNumber(4000),
      },
    );
    await delay(fixedNumber(4250));
    audioManager.playBgm();
  }

  /**
   * Shows a message for each Starter Pokemon the Player unlocked via this evolution.
   * @param unlockedStarters - A list of {@linkcode SpeciesId} unlocked via this evolution
   */
  private async showStarterUnlockText(unlockedStarters: SpeciesId[]): Promise<void> {
    for (const speciesId of unlockedStarters) {
      globalScene.audioManager.playSound("level_up_fanfare");
      await new Promise<void>((resolve) => {
        globalScene.ui.showText(
          i18next.t("battle:addedAsAStarter", { pokemonName: getPokemonSpecies(speciesId).getName() }),
          {
            callback: () => resolve(),
            prompt: true,
          },
        );
      });
    }
  }
}
