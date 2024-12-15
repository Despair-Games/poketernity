import { globalScene } from "#app/global-scene";
import { fixedInt } from "#app/utils";
import { achvs } from "../system/achv";
import type { SpeciesFormChange } from "../data/pokemon-forms";
import { getSpeciesFormChangeMessage } from "../data/pokemon-forms";
import type { PlayerPokemon, Pokemon } from "../field/pokemon";
import { Mode } from "../ui/ui";
import type PartyUiHandler from "../ui/party-ui-handler";
import { getPokemonNameWithAffix } from "../messages";
import { EndEvolutionPhase } from "./end-evolution-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { FormChangeBasePhase } from "./form-change-base-phase";

/**
 * A phase for handling Pokemon form changes
 * @extends FormChangeBasePhase
 */
export class FormChangePhase extends FormChangeBasePhase {
  private formChange: SpeciesFormChange;
  private modal: boolean;

  constructor(pokemon: PlayerPokemon, formChange: SpeciesFormChange, modal: boolean) {
    super(pokemon);

    this.formChange = formChange;
    this.modal = modal;
  }

  public override validate(): boolean {
    return !!this.formChange;
  }

  public override setMode(): Promise<void> {
    if (!this.modal) {
      return super.setMode();
    }
    return globalScene.ui.setOverlayMode(Mode.FORM_CHANGE_SCENE);
  }

  public override doFormChange(): void {
    this.pokemon.getPossibleForm(this.formChange).then((formChangedPokemon) => {
      [this.pokemonFormChangeSprite, this.pokemonFormChangeTintSprite].map((sprite) => {
        const spriteKey = formChangedPokemon.getSpriteKey(true);
        try {
          sprite.play(spriteKey);
        } catch (err: unknown) {
          console.error(`Failed to play animation for ${spriteKey}`, err);
        }

        sprite.setPipelineData("ignoreTimeTint", true);
        sprite.setPipelineData("spriteKey", formChangedPokemon.getSpriteKey());
        sprite.setPipelineData("shiny", formChangedPokemon.shiny);
        sprite.setPipelineData("variant", formChangedPokemon.variant);
        ["spriteColors", "fusionSpriteColors"].map((k) => {
          if (formChangedPokemon.summonData?.speciesForm) {
            k += "Base";
          }
          sprite.pipelineData[k] = formChangedPokemon.getSprite().pipelineData[k];
        });
      });

      globalScene.time.delayedCall(250, () => {
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
                  globalScene.time.delayedCall(1000, () => {
                    this.pokemonFormChangeTintSprite.setScale(0.25);
                    this.pokemonFormChangeTintSprite.setVisible(true);
                    this.doCycle(1, 1).then((_success) => {
                      this.handleFormChangeComplete(formChangedPokemon);
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

  /**
   * Handles the completion of the form change
   * @param formChangedPokemon - The {@linkcode Pokemon} that has changed form
   */
  private handleFormChangeComplete(formChangedPokemon: Pokemon): void {
    const onFormChangeComplete = () => {
      const preName = getPokemonNameWithAffix(this.pokemon);

      globalScene.tweens.add({
        targets: this.bgOverlay,
        alpha: 0,
        duration: 250,
        onComplete: () => {
          globalScene.time.delayedCall(250, () => {
            this.pokemon.cry();
            globalScene.time.delayedCall(1250, () => {
              let playEvolutionFanfare = false;
              if (this.formChange.formKey.includes(SpeciesFormKey.MEGA)) {
                globalScene.validateAchv(achvs.MEGA_EVOLVE);
                playEvolutionFanfare = true;
              } else if (
                this.formChange.formKey.includes(SpeciesFormKey.GIGANTAMAX)
                || this.formChange.formKey.includes(SpeciesFormKey.ETERNAMAX)
              ) {
                globalScene.validateAchv(achvs.GIGANTAMAX);
                playEvolutionFanfare = true;
              }

              const delay = playEvolutionFanfare ? 4000 : 1750;
              globalScene.playSoundWithoutBgm(playEvolutionFanfare ? "evolution_fanfare" : "minor_fanfare");

              formChangedPokemon.destroy();
              globalScene.ui.showText(
                getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName),
                null,
                () => this.end(),
                null,
                true,
                fixedInt(delay),
              );
              globalScene.time.delayedCall(fixedInt(delay + 250), () => globalScene.playBgm());
            });
          });
        },
      });
    };

    globalScene.playSound("se/sparkle");
    this.pokemonFormChangeSprite.setVisible(true);
    this.doCircleInward();
    globalScene.time.delayedCall(900, () => {
      this.pokemon.changeForm(this.formChange).then(() => {
        if (!this.modal) {
          globalScene.unshiftPhase(new EndEvolutionPhase());
        }

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
              onComplete: onFormChangeComplete,
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
