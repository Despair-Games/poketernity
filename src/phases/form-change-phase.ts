/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { EvolutionPhase } from "#phases/evolution-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { SpeciesFormChange } from "#data/pokemon-forms";
import { getSpeciesFormChangeMessage } from "#data/pokemon-forms";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { UiMode } from "#enums/ui-mode";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { FormChangeBasePhase } from "#phases/base/form-change-base-phase";
import { achvs } from "#system/achievements";
import type { FormChangeSceneUiHandler } from "#ui/form-change-scene-ui-handler";
import type { PartyUiHandler } from "#ui/party-ui-handler";
import { delay, playNumberTween, playTween } from "#utils/anim-utils";
import { fixedNumber } from "#utils/common-utils";

/**
 * A phase for handling certain form changes for player Pokemon.
 * This does not cover evolutions, and this does not cover form changes for enemy Pokemon.
 * @see {@linkcode EvolutionPhase} for evolutions
 */
export class FormChangePhase extends FormChangeBasePhase {
  public override readonly phaseName = "FormChangePhase";

  /**
   * The form change that occurs during this phase.
   */
  private readonly formChange: SpeciesFormChange;

  /**
   * If `true`, this indicates that the form change was triggered by a toggle
   * via the "Check Team" UI (e.g. disabling or re-enabling a Mega Evolution).
   * In particular, this disables learning new moves linked to the form change.
   */
  private readonly isFromToggle: boolean;

  constructor(pokemon: PlayerPokemon, formChange: SpeciesFormChange, modal: boolean) {
    super(pokemon);

    this.formChange = formChange;
    this.isFromToggle = modal;
  }

  protected override async setMode(): Promise<void> {
    if (!this.isFromToggle) {
      return super.setMode();
    }

    const { ui } = globalScene;

    await ui.setOverlayMode<FormChangeSceneUiHandler>(UiMode.FORM_CHANGE_SCENE);

    this.handler = ui.getCurrentHandler<FormChangeSceneUiHandler>();
    this.container = this.handler.container;
  }

  public override async applyFormChange(): Promise<void> {
    const { tweens, animations } = globalScene;

    const formChangedPokemon = await this.pokemon.getPossibleForm(this.formChange);

    [this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].forEach((sprite) => {
      const spriteKey = formChangedPokemon.getSpriteKey(true);
      sprite.play(spriteKey);

      sprite.setPipelineData("ignoreTimeTint", true);
      sprite.setPipelineData("spriteKey", formChangedPokemon.getSpriteKey());
      let key = "spriteColors";
      if (formChangedPokemon.summonData.speciesForm) {
        key += "Base";
      }
      sprite.pipelineData[key] = formChangedPokemon.getSprite().pipelineData[key];
    });

    await playTween({
      targets: this.bgOverlay,
      alpha: 1,
      delay: 750,
      duration: 1500,
      ease: "Sine.easeOut",
    });

    await delay(1000);

    tweens.add({
      targets: this.bgOverlay,
      alpha: 0,
      duration: 250,
    });
    this.bgVideo.setVisible(true);
    this.bgVideo.play();

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

    this.pokemonNewFormTintSprite.setScale(0.25);
    this.pokemonNewFormTintSprite.setVisible(true);
    await animations.doCycle(1, 1, this.pokemonTintSprite, this.pokemonNewFormTintSprite);
    await this.handleFormChangeComplete(formChangedPokemon);
  }

  /**
   * Handles the completion of the form change
   * @param formChangedPokemon - The {@linkcode Pokemon} that has changed form
   */
  private async handleFormChangeComplete(formChangedPokemon: Pokemon): Promise<void> {
    const { animations, audioManager, ui } = globalScene;
    const preName = getPokemonNameWithAffix(this.pokemon);

    audioManager.playSound("se/sparkle");
    this.pokemonNewFormSprite.setVisible(true);
    animations.doCircleInward(this.baseBgImg, this.container);
    await delay(900);

    await this.pokemon.changeForm(this.formChange);
    audioManager.playSound("se/shine");
    animations.doSpray(this.baseBgImg, this.container);

    await playTween({
      targets: this.overlay,
      alpha: 1,
      duration: 250,
      ease: "Sine.easeIn",
    });

    this.bgOverlay.setAlpha(1);
    this.bgOverlay.setVisible(false);
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
    await delay(250);

    this.pokemon.cry();
    await delay(1250);

    let playEvolutionFanfare = false;
    if (this.formChange.formKey.includes(SpeciesFormKey.MEGA)) {
      globalScene.validateAchv(achvs.MEGA_EVOLVE);
      playEvolutionFanfare = true;
    } else if (
      [SpeciesFormKey.GIGANTAMAX, SpeciesFormKey.ETERNAMAX].some((key) => this.formChange.formKey.includes(key))
    ) {
      globalScene.validateAchv(achvs.GIGANTAMAX);
      playEvolutionFanfare = true;
    }

    const fanfareDelay = playEvolutionFanfare ? 4000 : 1750;
    audioManager.playSoundWithoutBgm(playEvolutionFanfare ? "evolution_fanfare" : "minor_fanfare");

    formChangedPokemon.destroy();
    ui.showText(getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName), {
      callback: async () => await this.end(),
      prompt: true,
      promptDelay: fixedNumber(fanfareDelay),
    });

    await delay(fixedNumber(fanfareDelay + 250));
    audioManager.playBgm();
  }

  public override async end(): Promise<void> {
    const { ui } = globalScene;

    this.pokemon.findAndRemoveTags((t) => t.tagType === BattlerTagType.AUTOTOMIZED);
    if (this.isFromToggle) {
      // If the form change was triggered via the "Check Team" UI, go back to the "Check Team" UI without learning new moves.
      await ui.revertMode();
      if (ui.getMode() === UiMode.PARTY) {
        const partyUiHandler = ui.getCurrentHandler<PartyUiHandler>();
        partyUiHandler.clearPartySlots();
        partyUiHandler.populatePartySlots();
      }

      super.end();
    } else {
      // Otherwise, learn new moves if applicable and at a high enough level,
      // then end the form change cutscene via `EndEvolutionPhase`.
      for (const [, learnMoveId] of this.pokemon.getLevelMoves(1, true)) {
        if (this.formChange.movesToLearn.includes(learnMoveId)) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "LearnMovePhase",
            globalScene.getPlayerParty().indexOf(this.pokemon),
            learnMoveId,
          );
        }
      }
      globalScene.phaseManager.createAndUnshiftPhase("EndEvolutionPhase");

      super.end();
    }
  }
}
