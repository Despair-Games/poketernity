import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
import type { AnySound } from "#app/battle-scene";
import { globalScene } from "#app/global-scene";
import type { SpeciesFormEvolution } from "#app/data/balance/pokemon-evolutions";
import { FusionSpeciesFormEvolution } from "#app/data/balance/pokemon-evolutions";
import { fixedInt } from "#app/utils";
import { Mode } from "#app/ui/ui";
import type { PlayerPokemon } from "#app/field/pokemon";
import type Pokemon from "#app/field/pokemon";
import { LearnMoveSituation } from "#app/field/pokemon";
import i18next from "i18next";
import { LearnMovePhase } from "#app/phases/learn-move-phase";
import { EndEvolutionPhase } from "#app/phases/end-evolution-phase";
import { EVOLVE_MOVE } from "#app/data/balance/pokemon-level-moves";
import { FormChangeBasePhase } from "./form-change-base-phase";
import { getPokemonNameWithAffix } from "#app/messages";

/**
 * A phase for handling Pokemon evolution
 * @extends FormChangeBasePhase
 */
export class EvolutionPhase extends FormChangeBasePhase {
  protected lastLevel: number;

  private preEvolvedPokemonName: string;

  private evolution: SpeciesFormEvolution | null;
  private evolutionBgm: AnySound;
  private fusionSpeciesEvolved: boolean; // Whether the evolution is of the fused species

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

  public override start() {
    super.start();
    this.preEvolvedPokemonName = getPokemonNameWithAffix(this.pokemon);
  }

  public override doFormChange(): void {
    globalScene.ui.showText(
      i18next.t("menu:evolving", { pokemonName: this.preEvolvedPokemonName }),
      null,
      () => {
        this.pokemon.cry();

        this.pokemon.getPossibleEvolution(this.evolution).then((evolvedPokemon) => {
          [this.pokemonFormChangeSprite, this.pokemonFormChangeTintSprite].map((sprite) => {
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

          globalScene.time.delayedCall(1000, () => {
            this.evolutionBgm = globalScene.playSoundWithoutBgm("evolution");
            globalScene.tweens.add({
              targets: this.bgOverlay,
              alpha: 1,
              delay: 500,
              duration: 1500,
              ease: "Sine.easeOut",
              onComplete: () => {
                globalScene.time.delayedCall(1000, () => {
                  globalScene.tweens.add({
                    targets: this.bgOverlay,
                    alpha: 0,
                    duration: 250,
                  });
                  this.bgVideo.setVisible(true);
                  this.bgVideo.play();
                });
                globalScene.playSound("se/charge");
                this.doSpiralUpward();
                globalScene.tweens.addCounter({
                  from: 0,
                  to: 1,
                  duration: 2000,
                  onUpdate: (t) => {
                    this.pokemonTintSprite.setAlpha(t.getValue());
                  },
                  onComplete: () => {
                    this.pokemonSprite.setVisible(false);
                    globalScene.time.delayedCall(1100, () => {
                      globalScene.playSound("se/beam");
                      this.doArcDownward();
                      globalScene.time.delayedCall(1500, () => {
                        this.pokemonFormChangeTintSprite.setScale(0.25);
                        this.pokemonFormChangeTintSprite.setVisible(true);
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
    this.pokemonSprite.setVisible(true);
    this.pokemonTintSprite.setScale(1);
    globalScene.tweens.add({
      targets: [this.bgVideo, this.pokemonTintSprite, this.pokemonFormChangeSprite, this.pokemonFormChangeTintSprite],
      alpha: 0,
      duration: 250,
      onComplete: () => {
        this.bgVideo.setVisible(false);
      },
    });

    SoundFade.fadeOut(globalScene, this.evolutionBgm, 100);

    globalScene.unshiftPhase(new EndEvolutionPhase());

    globalScene.ui.showText(
      i18next.t("menu:stoppedEvolving", { pokemonName: this.preEvolvedPokemonName }),
      null,
      () => {
        globalScene.ui.showText(
          i18next.t("menu:pauseEvolutionsQuestion", { pokemonName: this.preEvolvedPokemonName }),
          null,
          () => {
            const end = () => {
              globalScene.ui.showText("", 0);
              globalScene.playBgm();
              evolvedPokemon.destroy();
              this.end();
            };
            globalScene.ui.setOverlayMode(
              Mode.CONFIRM,
              () => {
                globalScene.ui.revertMode();
                this.pokemon.pauseEvolutions = true;
                globalScene.ui.showText(
                  i18next.t("menu:evolutionsPaused", { pokemonName: this.preEvolvedPokemonName }),
                  null,
                  end,
                  3000,
                );
              },
              () => {
                globalScene.ui.revertMode();
                globalScene.time.delayedCall(3000, end);
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
    globalScene.playSound("se/sparkle");
    this.pokemonFormChangeSprite.setVisible(true);
    this.doCircleInward();

    const onEvolutionComplete = () => {
      SoundFade.fadeOut(globalScene, this.evolutionBgm, 100);
      globalScene.time.delayedCall(250, () => {
        this.pokemon.cry();
        globalScene.time.delayedCall(1250, () => {
          globalScene.playSoundWithoutBgm("evolution_fanfare");

          evolvedPokemon.destroy();
          globalScene.ui.showText(
            i18next.t("menu:evolutionDone", {
              pokemonName: this.preEvolvedPokemonName,
              evolvedPokemonName: this.pokemon.name,
            }),
            null,
            () => this.end(),
            null,
            true,
            fixedInt(4000),
          );
          globalScene.time.delayedCall(fixedInt(4250), () => globalScene.playBgm());
        });
      });
    };

    globalScene.time.delayedCall(900, () => {
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
        globalScene.tweens.add({
          targets: this.overlay,
          alpha: 1,
          duration: 250,
          easing: "Sine.easeIn",
          onComplete: () => {
            this.bgOverlay.setAlpha(1);
            this.bgVideo.setVisible(false);
            globalScene.tweens.add({
              targets: [this.overlay, this.pokemonFormChangeTintSprite],
              alpha: 0,
              duration: 2000,
              delay: 150,
              easing: "Sine.easeIn",
              onComplete: () => {
                globalScene.tweens.add({
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
