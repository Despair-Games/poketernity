import type { SpeciesFormChange } from "#app/data/pokemon-forms";
import { getSpeciesFormChangeMessage } from "#app/data/pokemon-forms";
import type { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { achvs } from "#app/system/achv";
import type PartyUiHandler from "#app/ui/party-ui-handler";
import { Mode } from "#app/ui/ui";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { EndEvolutionPhase } from "./end-evolution-phase";
import { EvolutionPhase } from "./evolution-phase";

export class FormChangePhase extends EvolutionPhase {
  private formChange: SpeciesFormChange;
  private modal: boolean;

  constructor(pokemon: PlayerPokemon, formChange: SpeciesFormChange, modal: boolean) {
    super(pokemon, null, 0);

    this.formChange = formChange;
    this.modal = modal;
  }

  public override setMode(): Promise<void> {
    if (!this.modal) {
      return super.setMode();
    }
    return globalScene.ui.setOverlayMode(Mode.EVOLUTION_SCENE);
  }

  public override doEvolution(): void {
    const { time, tweens, ui } = globalScene;
    const preName = getPokemonNameWithAffix(this.pokemon);

    this.pokemon.getPossibleForm(this.formChange).then((transformedPokemon) => {
      [this.pokemonEvoSprite, this.pokemonEvoTintSprite].map((sprite) => {
        const spriteKey = transformedPokemon.getSpriteKey(true);
        try {
          sprite.play(spriteKey);
        } catch (err: unknown) {
          console.error(`Failed to play animation for ${spriteKey}`, err);
        }

        sprite.setPipelineData("ignoreTimeTint", true);
        sprite.setPipelineData("spriteKey", transformedPokemon.getSpriteKey());
        sprite.setPipelineData("shiny", transformedPokemon.shiny);
        sprite.setPipelineData("variant", transformedPokemon.variant);
        ["spriteColors", "fusionSpriteColors"].map((k) => {
          if (transformedPokemon.summonData?.speciesForm) {
            k += "Base";
          }
          sprite.pipelineData[k] = transformedPokemon.getSprite().pipelineData[k];
        });
      });

      time.delayedCall(250, () => {
        tweens.add({
          targets: this.evolutionBgOverlay,
          alpha: 1,
          delay: 500,
          duration: 1500,
          ease: "Sine.easeOut",
          onComplete: () => {
            time.delayedCall(1000, () => {
              tweens.add({
                targets: this.evolutionBgOverlay,
                alpha: 0,
                duration: 250,
              });
              this.evolutionBg.setVisible(true);
              this.evolutionBg.play();
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
                  time.delayedCall(1000, () => {
                    this.pokemonEvoTintSprite.setScale(0.25);
                    this.pokemonEvoTintSprite.setVisible(true);
                    this.doCycle(1, 1).then((_success) => {
                      globalScene.playSound("se/sparkle");
                      this.pokemonEvoSprite.setVisible(true);
                      this.doCircleInward();
                      time.delayedCall(900, () => {
                        this.pokemon.changeForm(this.formChange).then(() => {
                          if (!this.modal) {
                            globalScene.unshiftPhase(new EndEvolutionPhase());
                          }

                          globalScene.playSound("se/shine");
                          this.doSpray();
                          tweens.add({
                            targets: this.evolutionOverlay,
                            alpha: 1,
                            duration: 250,
                            easing: "Sine.easeIn",
                            onComplete: () => {
                              this.evolutionBgOverlay.setAlpha(1);
                              this.evolutionBg.setVisible(false);
                              tweens.add({
                                targets: [this.evolutionOverlay, this.pokemonEvoTintSprite],
                                alpha: 0,
                                duration: 2000,
                                delay: 150,
                                easing: "Sine.easeIn",
                                onComplete: () => {
                                  tweens.add({
                                    targets: this.evolutionBgOverlay,
                                    alpha: 0,
                                    duration: 250,
                                    onComplete: () => {
                                      time.delayedCall(250, () => {
                                        this.pokemon.cry();
                                        time.delayedCall(1250, () => {
                                          let playEvolutionFanfare = false;
                                          if (this.formChange.formKey.indexOf(SpeciesFormKey.MEGA) > -1) {
                                            globalScene.validateAchv(achvs.MEGA_EVOLVE);
                                            playEvolutionFanfare = true;
                                          } else if (
                                            this.formChange.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) > -1
                                            || this.formChange.formKey.indexOf(SpeciesFormKey.ETERNAMAX) > -1
                                          ) {
                                            globalScene.validateAchv(achvs.GIGANTAMAX);
                                            playEvolutionFanfare = true;
                                          }

                                          const delay = playEvolutionFanfare ? 4000 : 1750;
                                          globalScene.playSoundWithoutBgm(
                                            playEvolutionFanfare ? "evolution_fanfare" : "minor_fanfare",
                                          );

                                          transformedPokemon.destroy();
                                          ui.showText(
                                            getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName),
                                            null,
                                            () => this.end(),
                                            null,
                                            true,
                                            delay,
                                          );
                                          time.delayedCall(delay + 250, () => globalScene.playBgm());
                                        });
                                      });
                                    },
                                  });
                                },
                              });
                            },
                          });
                        });
                      });
                    });
                  });
                });
              },
            });
          },
        });
      });
    });
  }

  public override end(): void {
    this.pokemon.findAndRemoveTags((t) => t.tagType === BattlerTagType.AUTOTOMIZED);
    if (this.modal) {
      globalScene.ui.revertMode().then(() => {
        if (globalScene.ui.getMode() === Mode.PARTY) {
          const partyUiHandler = globalScene.ui.getHandler() as PartyUiHandler;
          partyUiHandler.clearPartySlots();
          partyUiHandler.populatePartySlots();
        }

        super.end();
      });
    } else {
      super.end();
    }
  }
}
