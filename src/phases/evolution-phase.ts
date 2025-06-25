// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { FormChangePhase } from "#phases/form-change-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import type { AnySound } from "#app/audio-manager";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { SpeciesFormEvolution } from "#data/pokemon-evolutions";
import { EVOLVE_MOVE } from "#data/pokemon-level-moves";
import type { SpeciesId } from "#enums/species-id";
import { UiMode } from "#enums/ui-mode";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { FormChangeBasePhase } from "#phases/base/form-change-base-phase";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import { BooleanHolder, fixedNumber } from "#utils/common-utils";
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
   * A {@linkcode BooleanHolder} whose value indicates whether or not the player has cancelled the evolution.
   */
  private cancelled: BooleanHolder = new BooleanHolder(false);

  constructor(pokemon: PlayerPokemon, evolution: SpeciesFormEvolution | null, lastLevel: number) {
    super(pokemon);

    this.pokemon = pokemon;
    this.evolution = evolution;
    this.lastLevel = lastLevel;
  }

  public override validate(): boolean {
    return !!this.evolution;
  }

  public override start(): void {
    super.start();
    this.preEvolvedPokemonName = getPokemonNameWithAffix(this.pokemon);
  }

  public override doFormChange(): void {
    const { time, tweens, ui, animations } = globalScene;

    ui.showText(
      i18next.t("menu:evolving", { pokemonName: this.preEvolvedPokemonName }),
      null,
      () => {
        this.pokemon.cry();

        this.pokemon.getPossibleEvolution(this.evolution).then((evolvedPokemon) => {
          [this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].map((sprite) => {
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

          time.delayedCall(1000, () => {
            this.evolutionBgm = globalScene.audioManager.playSoundWithoutBgm("evolution");
            tweens.add({
              targets: this.bgOverlay,
              alpha: 1,
              delay: 500,
              duration: 1500,
              ease: "Sine.easeOut",
              onComplete: () => {
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
                tweens.addCounter({
                  from: 0,
                  to: 1,
                  duration: 2000,
                  onUpdate: (t) => {
                    this.pokemonTintSprite.setAlpha(t.getValue() ?? 1);
                  },
                  onComplete: () => {
                    this.pokemonSprite.setVisible(false);
                    time.delayedCall(1100, () => {
                      globalScene.audioManager.playSound("se/beam");
                      animations.doArcDownward(this.baseBgImg, this.container);
                      time.delayedCall(1500, () => {
                        this.pokemonNewFormTintSprite.setScale(0.25);
                        this.pokemonNewFormTintSprite.setVisible(true);
                        this.handler.canCancel = true;
                        animations
                          .doCycle(1, 15, this.pokemonTintSprite, this.pokemonNewFormTintSprite, this.cancelled)
                          .then(() => {
                            if (!this.cancelled.value) {
                              this.handleSuccessEvolution(evolvedPokemon);
                            } else {
                              this.handleFailedEvolution(evolvedPokemon);
                            }
                          });
                      });
                    });
                  },
                });
              },
            });
          });
        });
      },
      1000,
    );
  }

  /**
   * Cancels the evolution and its animation.
   */
  public cancelEvolution(): void {
    this.cancelled.value = true;
  }

  /**
   * Handles a failed/stopped evolution
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

    ui.showText(
      i18next.t("menu:stoppedEvolving", { pokemonName: this.preEvolvedPokemonName }),
      null,
      () => {
        ui.showText(
          i18next.t("menu:pauseEvolutionsQuestion", { pokemonName: this.preEvolvedPokemonName }),
          null,
          () => {
            const end = (): void => {
              ui.showText("", 0);
              globalScene.audioManager.playBgm();
              evolvedPokemon.destroy();
              this.end();
            };
            const options: ConfirmModeConfig = {
              yesHandler: () => {
                ui.revertMode();
                this.pokemon.pauseEvolutions = true;
                ui.showText(
                  i18next.t("menu:evolutionsPaused", { pokemonName: this.preEvolvedPokemonName }),
                  null,
                  end,
                  3000,
                );
              },
              noHandler: () => {
                ui.revertMode();
                time.delayedCall(3000, end);
              },
            };
            ui.setOverlayMode<ConfirmUiHandler>(UiMode.CONFIRM, options);
          },
        );
      },
      null,
      true,
    );
  }

  /**
   * Handles a successful evolution
   * @param evolvedPokemon - The evolved Pokemon
   */
  private handleSuccessEvolution(evolvedPokemon: Pokemon): void {
    const { time, tweens, ui, animations } = globalScene;

    globalScene.audioManager.playSound("se/sparkle");
    this.pokemonNewFormSprite.setVisible(true);
    animations.doCircleInward(this.baseBgImg, this.container);

    async function showStarterUnlockText(unlockedStarters: SpeciesId[]): Promise<void> {
      for (const speciesId of unlockedStarters) {
        globalScene.audioManager.playSound("level_up_fanfare");
        await new Promise<void>((resolve) => {
          ui.showText(
            i18next.t("battle:addedAsAStarter", { pokemonName: getPokemonSpecies(speciesId).getName() }),
            null,
            () => resolve(),
            null,
            true,
          );
        });
      }
    }

    const onEvolutionComplete = (unlockedStarters: SpeciesId[]): void => {
      SoundFade.fadeOut(globalScene, this.evolutionBgm, 100);
      time.delayedCall(250, () => {
        this.pokemon.cry();
        time.delayedCall(1250, () => {
          globalScene.audioManager.playSoundWithoutBgm("evolution_fanfare");

          evolvedPokemon.destroy();
          ui.showText(
            i18next.t("menu:evolutionDone", {
              pokemonName: this.preEvolvedPokemonName,
              evolvedPokemonName: this.pokemon.name,
            }),
            null,
            () => {
              showStarterUnlockText(unlockedStarters).then(() => this.end());
            },
            null,
            true,
            fixedNumber(4000),
          );
          time.delayedCall(fixedNumber(4250), () => globalScene.audioManager.playBgm());
        });
      });
    };

    time.delayedCall(900, () => {
      this.handler.canCancel = false;

      this.pokemon.evolve(this.evolution).then((unlockedStarters: SpeciesId[]) => {
        const levelMoves = this.pokemon
          .getLevelMoves(this.lastLevel + 1, true, false, false)
          .filter((lm) => lm[0] === EVOLVE_MOVE);
        for (const lm of levelMoves) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "LearnMovePhase",
            globalScene.getPlayerParty().indexOf(this.pokemon),
            lm[1],
          );
        }
        globalScene.phaseManager.createAndUnshiftPhase("EndEvolutionPhase");

        globalScene.audioManager.playSound("se/shine");
        animations.doSpray(this.baseBgImg, this.container);
        tweens.add({
          targets: this.overlay,
          alpha: 1,
          duration: 250,
          easing: "Sine.easeIn",
          onComplete: () => {
            this.bgOverlay.setAlpha(1);
            this.bgVideo.setVisible(false);
            tweens.add({
              targets: [this.overlay, this.pokemonNewFormTintSprite],
              alpha: 0,
              duration: 2000,
              delay: 150,
              easing: "Sine.easeIn",
              onComplete: () => {
                tweens.add({
                  targets: this.bgOverlay,
                  alpha: 0,
                  duration: 250,
                  onComplete: () => onEvolutionComplete(unlockedStarters),
                });
              },
            });
          },
        });
      });
    });
  }
}
