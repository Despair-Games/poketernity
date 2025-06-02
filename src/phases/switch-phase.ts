// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RecallPhase } from "#phases/recall-phase";
import type BattleScene from "#app/battle-scene";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import { PartyOption } from "#enums/party-option";
import { PartyUiMode } from "#enums/party-ui-mode";
import { PhaseId } from "#enums/phase-id";
import { SwitchType } from "#enums/switch-type";
import { TrainerSlot } from "#enums/trainer-slot";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";
import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { SwitchEffectTransferModifier } from "#modifier/modifier";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { SubstituteTag } from "#battler-tags/substitute-tag";
import { SummonPhase } from "#phases/summon-phase";

export class SwitchPhase extends PokemonPhase {
  override readonly id = PhaseId.SWITCH;

  private switchType: SwitchType;
  private switchInIndex: number;

  constructor(battlerIndex: number, switchType: SwitchType, switchInIndex: number = -1) {
    super(battlerIndex);

    this.switchType = switchType;
    this.switchInIndex = switchInIndex;
  }

  public override start(): void {
    // prettier-ignore - Prettier makes this 1 line
    this.resolveSwitchInIndex().then(this.updatePokemonData).then(this.playEnemyTrainerAnim).then(this.end);
  }

  /**
   * Finalizes the party slot to switch in if it isn't already defined.
   * - If a Player Pokemon is switching, this prompts the Player to select a Pokemon
   * from the {@linkcode BattleScene.promptSelectPlayerPokemon | Party UI} to switch in.
   * - If an Enemy (Trainer) Pokemon is switching, this directs the Trainer AI to select
   * a Pokemon to switch in.
   * @async
   */
  private async resolveSwitchInIndex(): Promise<void> {
    if (this.switchInIndex !== -1) {
      return;
    }

    if (this.isPlayer) {
      await globalScene
        .promptSelectPlayerPokemon(PartyUiMode.FAINT_SWITCH, this.fieldIndex)
        .then(([cursor, option]) => {
          this.switchInIndex = cursor;
          if (option === PartyOption.PASS_BATON) {
            this.switchType = SwitchType.BATON_PASS;
          }
        });
    } else {
      const { trainer } = globalScene.currentBattle;

      if (!trainer) {
        throw new Error("SwitchPhase: Enemy Pokemon does not have a trainer!");
      }

      this.switchInIndex = trainer.getNextSummonIndex(
        !this.fieldIndex ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER,
      );
    }
  }

  public override end(): void {
    globalScene.phaseManager.unshiftPhase(new SummonPhase(this.fieldIndex, this.isPlayer, false));
    super.end();
  }

  /**
   * If the switched Pokemon is an enemy, shows an animation where
   * the Pokemon's trainer enters the field
   * @async
   */
  private async playEnemyTrainerAnim(): Promise<void> {
    if (this.isPlayer) {
      return;
    }

    await this.showEnemyTrainer(this.getTrainerSlot());
    await globalScene.pbTrayEnemy.showPbTray(globalScene.getEnemyParty());
  }

  /**
   * Updates *all* data that needs to be changed as a direct result of this
   * phase's switch action.
   *
   * Note that the affected Pokemon are visually off the field when this is
   * called. Any pre-switch effects that require the Pokemon to be visible
   * should be applied when or before the Pokemon is {@linkcode RecallPhase | recalled}.
   */
  private updatePokemonData(): void {
    const party = this.getAlliedParty();
    const activePokemon = this.getPokemon();
    const switchedInPokemon = party[this.switchInIndex];

    // Apply pre-switch effects from abilities (e.g. Regenerator)
    applyAbAttrs<PreSwitchOutAbAttr>(AbAttrFlag.PRE_SWITCH_OUT, activePokemon, false);

    // If this switch is the result of Baton, Baton Pass, or Shed Tail, transfer all
    // relevant effects from the active Pokemon to the switched in Pokemon
    if (this.switchType === SwitchType.BATON_PASS) {
      this.transferBatonPassableEffects(activePokemon, switchedInPokemon);
    } else if (this.switchType === SwitchType.SHED_TAIL) {
      const subTag = activePokemon.getTag(BattlerTagType.SUBSTITUTE);
      if (subTag) {
        switchedInPokemon.summonData.tags.push(subTag);
      }
    }

    // If a Substitute was transferred, update the switched in Pokemon's position
    // to a "behind Substitute" state
    const transferredSubTag = switchedInPokemon.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);
    if (transferredSubTag) {
      switchedInPokemon.x += switchedInPokemon.getSubstituteOffset()[0];
      switchedInPokemon.y += switchedInPokemon.getSubstituteOffset()[1];
      switchedInPokemon.setAlpha(0.5);
    }

    // Swap the party positions of the switching Pokemon
    party[this.switchInIndex] = activePokemon;
    party[this.fieldIndex] = switchedInPokemon;

    // Reset the switched out Pokemon's summon data
    activePokemon.resetSummonData();
  }

  /**
   * Transfers all effects that can be passed from the active Pokemon to the
   * Pokemon about to switch in via {@linkcode SwitchType.BATON_PASS | Baton or Baton Pass}
   * @param activePokemon - The {@linkcode Pokemon} switching out
   * @param switchedInPokemon - The {@linkcode Pokemon} switching in
   */
  private transferBatonPassableEffects(activePokemon: Pokemon, switchedInPokemon: Pokemon): void {
    this.getOpposingField().forEach((opposingPokemon: Pokemon) =>
      opposingPokemon.transferTagsBySourceId(activePokemon.id, switchedInPokemon.id),
    );

    const switchedInPokemonHeldBaton = globalScene.findModifier(
      (m) => m.isSwitchEffectTransferModifier() && m.pokemonId === switchedInPokemon.id,
    );

    if (!switchedInPokemonHeldBaton) {
      const lastPokemonHeldBaton = globalScene.findModifier(
        (m) => m.isSwitchEffectTransferModifier() && m.pokemonId === activePokemon.id,
      ) as SwitchEffectTransferModifier;

      if (lastPokemonHeldBaton) {
        globalScene.tryTransferHeldItemModifier(
          lastPokemonHeldBaton,
          switchedInPokemon,
          false,
          undefined,
          undefined,
          undefined,
          false,
        );
      }
    }

    switchedInPokemon.transferSummon(activePokemon);
  }
}
