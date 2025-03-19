// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type EvolutionPhase } from "#app/phases/evolution-phase";
// -- end tsdoc imports --

import type { SpeciesFormChange } from "#app/data/pokemon-forms";
import { getSpeciesFormChangeMessage } from "#app/data/pokemon-forms";
import type { PlayerPokemon, Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { achvs } from "#app/system/achievements";
import type { PartyUiHandler } from "#app/ui/handlers/party-ui-handler";
import { UiMode } from "#enums/ui-mode";
import { fixedNumber } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { FormChangeBasePhase } from "./abstract-form-change-base-phase";
import { EndEvolutionPhase } from "./end-evolution-phase";
import { LearnMovePhase } from "./learn-move-phase";
import { PhaseId } from "#enums/phase-id";

/**
 * A phase for handling certain form changes for player Pokemon.
 * This does not cover evolutions, and this does not cover form changes for enemy Pokemon.
 * @see {@linkcode EvolutionPhase} for evolutions
 * @extends FormChangeBasePhase
 */
export class FormChangePhase extends FormChangeBasePhase {
  override readonly id = PhaseId.FORM_CHANGE;

  /**
   * The form change that occurs during this phase.
   */
  private readonly formChange: SpeciesFormChange;

  /**
   * If `true`, this indicates that the form change was triggered via the "Check Team" UI.
   * In particular, this disables learning new moves linked to the form change.
   */
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
    return globalScene.ui.setOverlayMode(UiMode.FORM_CHANGE_SCENE);
  }

  public override doFormChange(): void {
    const { time, tweens, animations } = globalScene;

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
        let key = "spriteColors";
        if (formChangedPokemon.summonData?.speciesForm) {
          key += "Base";
        }
        sprite.pipelineData[key] = formChangedPokemon.getSprite().pipelineData[key];
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
            globalScene.audioManager.playSound("se/charge");
            animations.doSpiralUpward(this.baseBgImg, this.container);
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
                  globalScene.audioManager.playSound("se/beam");
                  animations.doArcDownward(this.baseBgImg, this.container);
                  time.delayedCall(1000, () => {
                    this.pokemonNewFormTintSprite.setScale(0.25);
                    this.pokemonNewFormTintSprite.setVisible(true);
                    animations.doCycle(1, 1, this.pokemonTintSprite, this.pokemonNewFormTintSprite).then((_success) => {
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
    const { time, tweens, ui, animations } = globalScene;
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
              globalScene.audioManager.playSoundWithoutBgm(
                playEvolutionFanfare ? "evolution_fanfare" : "minor_fanfare",
              );

              formChangedPokemon.destroy();
              ui.showText(
                getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName),
                null,
                () => this.end(),
                null,
                true,
                fixedNumber(delay),
              );
              time.delayedCall(fixedNumber(delay + 250), () => globalScene.audioManager.playBgm());
            });
          });
        },
      });
    };

    globalScene.audioManager.playSound("se/sparkle");
    this.pokemonNewFormSprite.setVisible(true);
    animations.doCircleInward(this.baseBgImg, this.container);
    time.delayedCall(900, () => {
      this.pokemon.changeForm(this.formChange).then(() => {
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
      // If the form change was triggered via the "Check Team" UI, go back to the "Check Team" UI without learning new moves.
      ui.revertMode().then(() => {
        if (ui.getMode() === UiMode.PARTY) {
          const partyUiHandler = ui.getHandler() as PartyUiHandler;
          partyUiHandler.clearPartySlots();
          partyUiHandler.populatePartySlots();
        }

        super.end();
      });
    } else {
      // Otherwise, learn new moves if applicable and at a high enough level,
      // then end the form change cutscene via `EndEvolutionPhase`.
      for (const [, learnMoveId] of this.pokemon.getLevelMoves(1, true)) {
        if (this.formChange.movesToLearn.includes(learnMoveId)) {
          globalScene.unshiftPhase(new LearnMovePhase(globalScene.getPlayerParty().indexOf(this.pokemon), learnMoveId));
        }
      }
      globalScene.unshiftPhase(new EndEvolutionPhase());

      super.end();
    }
  }
}
