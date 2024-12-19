import type { SpeciesFormChange } from "#app/data/pokemon-forms";
import { getSpeciesFormChangeMessage } from "#app/data/pokemon-forms";
import type { PlayerPokemon, Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { achvs } from "#app/system/achv";
import type PartyUiHandler from "#app/ui/party-ui-handler";
import { Mode } from "#app/ui/ui";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { EndEvolutionPhase } from "./end-evolution-phase";
import { FormChangeBasePhase } from "./form-change-base-phase";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type EvolutionPhase } from "#app/phases/evolution-phase";

/**
 * A phase for handling Pokemon form changes, this does not cover evolutions
 * @see {@linkcode EvolutionPhase} for evolutions
 * @extends FormChangeBasePhase
 */
export class FormChangePhase extends FormChangeBasePhase {
  private readonly formChange: SpeciesFormChange;
  private readonly modal: boolean;

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
    const { time, tweens } = globalScene;

    this.pokemon.getPossibleForm(this.formChange).then((formChangedPokemon) => {
      [this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].map((sprite) => {
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

      time.delayedCall(250, () => {
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
                  time.delayedCall(1000, () => {
                    this.pokemonNewFormTintSprite.setScale(0.25);
                    this.pokemonNewFormTintSprite.setVisible(true);
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
    const { time, tweens, ui } = globalScene;
    const onFormChangeComplete = (): void => {
      const preName = getPokemonNameWithAffix(this.pokemon);

      tweens.add({
        targets: this.bgOverlay,
        alpha: 0,
        duration: 250,
        onComplete: () => {
          time.delayedCall(250, () => {
            this.pokemon.cry();
            time.delayedCall(1250, () => {
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
    };

    globalScene.playSound("se/sparkle");
    this.pokemonNewFormSprite.setVisible(true);
    this.doCircleInward();
    time.delayedCall(900, () => {
      this.pokemon.changeForm(this.formChange).then(() => {
        if (!this.modal) {
          globalScene.unshiftPhase(new EndEvolutionPhase());
        }

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
              onComplete: onFormChangeComplete,
            });
          },
        });
      });
    });
  }

  public override end(): void {
    const { ui } = globalScene;

    this.pokemon.findAndRemoveTags((t) => t.tagType === BattlerTagType.AUTOTOMIZED);
    if (this.modal) {
      ui.revertMode().then(() => {
        if (ui.getMode() === Mode.PARTY) {
          const partyUiHandler = ui.getHandler() as PartyUiHandler;
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
