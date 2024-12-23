import type { AnySound } from "#app/battle-scene";
import type { SpeciesFormEvolution } from "#app/data/balance/pokemon-evolutions";
import { FusionSpeciesFormEvolution } from "#app/data/balance/pokemon-evolutions";
import { EVOLVE_MOVE } from "#app/data/balance/pokemon-level-moves";
import type { PlayerPokemon, Pokemon } from "#app/field/pokemon";
import { LearnMoveSituation } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { EndEvolutionPhase } from "#app/phases/end-evolution-phase";
import { LearnMovePhase } from "#app/phases/learn-move-phase";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
import { FormChangeBasePhase } from "./abstract-form-change-base-phase";
// tsdoc imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type FormChangePhase } from "#app/phases/form-change-phase";

/**
 * A phase for handling Pokemon evolution
 * @see {@linkcode FormChangePhase} for general form changes
 * @extends FormChangeBasePhase
 */
export class EvolutionPhase extends FormChangeBasePhase {
  protected readonly lastLevel: number;

  private preEvolvedPokemonName: string;

  private readonly evolution: SpeciesFormEvolution | null;
  private evolutionBgm: AnySound;
  /** `true` if the secondary species of a fused pokemon is evolving */
  private readonly fusionSpeciesEvolved: boolean;

  constructor(pokemon: PlayerPokemon, evolution: SpeciesFormEvolution | null, lastLevel: number) {
    super(pokemon);

    this.pokemon = pokemon;
    this.evolution = evolution;
    this.lastLevel = lastLevel;
    this.fusionSpeciesEvolved = evolution instanceof FusionSpeciesFormEvolution;
  }

  public override validate(): boolean {
    return !!this.evolution;
  }

  public override start(): void {
    super.start();
    this.preEvolvedPokemonName = getPokemonNameWithAffix(this.pokemon);
  }

  public override doFormChange(): void {
    const { time, tweens, ui } = globalScene;

    ui.showText(
      i18next.t("menu:evolving", { pokemonName: this.preEvolvedPokemonName }),
      null,
      () => {
        this.pokemon.cry();

        this.pokemon.getPossibleEvolution(this.evolution).then((evolvedPokemon) => {
          [this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].map((sprite) => {
            const spriteKey = evolvedPokemon.getSpriteKey(true);
            try {
              sprite.play(spriteKey);
            } catch (err: unknown) {
              console.error(`Failed to play animation for ${spriteKey}`, err);
            }

            sprite.setPipelineData("ignoreTimeTint", true);
            sprite.setPipelineData("spriteKey", evolvedPokemon.getSpriteKey());
            sprite.setPipelineData("shiny", evolvedPokemon.shiny);
            sprite.setPipelineData("variant", evolvedPokemon.variant);
            ["spriteColors", "fusionSpriteColors"].map((k) => {
              if (evolvedPokemon.summonData?.speciesForm) {
                k += "Base";
              }
              sprite.pipelineData[k] = evolvedPokemon.getSprite().pipelineData[k];
            });
          });

          time.delayedCall(1000, () => {
            this.evolutionBgm = globalScene.playSoundWithoutBgm("evolution");
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
                globalScene.playSound("se/charge");
                this.doSpiralUpward();
                tweens.addCounter({
                  from: 0,
                  to: 1,
                  duration: 2000,
                  onUpdate: (t) => {
                    this.pokemonTintSprite.setAlpha(t.getValue());
                  },
                  onComplete: () => {
                    this.pokemonSprite.setVisible(false);
                    time.delayedCall(1100, () => {
                      globalScene.playSound("se/beam");
                      this.doArcDownward();
                      time.delayedCall(1500, () => {
                        this.pokemonNewFormTintSprite.setScale(0.25);
                        this.pokemonNewFormTintSprite.setVisible(true);
                        this.handler.canCancel = true;
                        this.doCycle(1).then((success) => {
                          if (success) {
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

    globalScene.unshiftPhase(new EndEvolutionPhase());

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
              globalScene.playBgm();
              evolvedPokemon.destroy();
              this.end();
            };
            ui.setOverlayMode(
              Mode.CONFIRM,
              () => {
                ui.revertMode();
                this.pokemon.pauseEvolutions = true;
                ui.showText(
                  i18next.t("menu:evolutionsPaused", { pokemonName: this.preEvolvedPokemonName }),
                  null,
                  end,
                  3000,
                );
              },
              () => {
                ui.revertMode();
                time.delayedCall(3000, end);
              },
            );
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
    const { time, tweens, ui } = globalScene;

    globalScene.playSound("se/sparkle");
    this.pokemonNewFormSprite.setVisible(true);
    this.doCircleInward();

    const onEvolutionComplete = (): void => {
      SoundFade.fadeOut(globalScene, this.evolutionBgm, 100);
      time.delayedCall(250, () => {
        this.pokemon.cry();
        time.delayedCall(1250, () => {
          globalScene.playSoundWithoutBgm("evolution_fanfare");

          evolvedPokemon.destroy();
          ui.showText(
            i18next.t("menu:evolutionDone", {
              pokemonName: this.preEvolvedPokemonName,
              evolvedPokemonName: this.pokemon.name,
            }),
            null,
            () => this.end(),
            null,
            true,
            4000,
          );
          time.delayedCall(4250, () => globalScene.playBgm());
        });
      });
    };

    time.delayedCall(900, () => {
      this.handler.canCancel = false;

      this.pokemon.evolve(this.evolution, this.pokemon.species).then(() => {
        const learnSituation: LearnMoveSituation = this.fusionSpeciesEvolved
          ? LearnMoveSituation.EVOLUTION_FUSED
          : this.pokemon.fusionSpecies
            ? LearnMoveSituation.EVOLUTION_FUSED_BASE
            : LearnMoveSituation.EVOLUTION;
        const levelMoves = this.pokemon
          .getLevelMoves(this.lastLevel + 1, true, false, false, learnSituation)
          .filter((lm) => lm[0] === EVOLVE_MOVE);
        for (const lm of levelMoves) {
          globalScene.unshiftPhase(new LearnMovePhase(globalScene.getPlayerParty().indexOf(this.pokemon), lm[1]));
        }
        globalScene.unshiftPhase(new EndEvolutionPhase());

        globalScene.playSound("se/shine");
        this.doSpray();
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
                  onComplete: onEvolutionComplete,
                });
              },
            });
          },
        });
      });
    });
  }
}
