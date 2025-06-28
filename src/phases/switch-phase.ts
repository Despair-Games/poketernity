// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type BattleScene from "#app/battle-scene";
import type { RecallPhase } from "#phases/recall-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import { globalScene } from "#app/global-scene";
import type { SubstituteTag } from "#battler-tags/substitute-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PartyOption } from "#enums/party-option";
import { PartyUiMode } from "#enums/party-ui-mode";
import { SwitchType } from "#enums/switch-type";
import { TrainerSlot } from "#enums/trainer-slot";
import { UiMode } from "#enums/ui-mode";
import type { Pokemon } from "#field/pokemon";
import type { SwitchEffectTransferModifier } from "#modifier/modifier";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import type { PartyUiHandler } from "#ui/party-ui-handler";

/**
 * Phase to handle all logical elements of switching a Pokemon.
 * @extends PokemonPhase
 */
export class SwitchPhase extends PokemonPhase {
  public override readonly phaseName = "SwitchPhase";

  private switchType: SwitchType;
  private switchInIndex: number;
  /**
   * If `true`, this phase schedules a {@linkcode SummonPhase}
   * to run immediately after it ends
   */
  private readonly withSummon: boolean;

  constructor(battlerIndex: number, switchType: SwitchType, switchInIndex: number = -1, withSummon: boolean = true) {
    super(battlerIndex);

    this.switchType = switchType;
    this.switchInIndex = switchInIndex;
    this.withSummon = withSummon;
  }

  public override start(): void {
    if (this.switchInIndex !== -1) {
      this.updatePokemonData();
      this.end();
      return;
    }

    if (this.isPlayer) {
      this.resolvePlayerSwitchInIndex();
    } else {
      this.resolveEnemySwitchInIndex();
    }
  }

  public override end(): void {
    if (this.withSummon) {
      globalScene.phaseManager.createAndUnshiftPhase("SummonPhase", this.battlerIndex);
    }
    super.end();
  }

  private resolvePlayerSwitchInIndex(): void {
    globalScene.ui.setMode<PartyUiHandler>(
      UiMode.PARTY,
      PartyUiMode.FAINT_SWITCH,
      this.fieldIndex,
      (cursor: number, option: PartyOption) => this.onPartyModeSelection(cursor, option),
    );
  }

  private onPartyModeSelection(cursor: number, option: PartyOption): void {
    this.switchInIndex = cursor;
    if (option === PartyOption.PASS_BATON) {
      this.switchType = SwitchType.BATON_PASS;
    }
    this.updatePokemonData();
    this.end();
  }

  private resolveEnemySwitchInIndex(): void {
    const { trainer } = globalScene.currentBattle;

    if (!trainer) {
      throw new Error("SwitchPhase: Enemy Pokemon does not have a trainer!");
    }

    this.switchInIndex = trainer.getNextSummonIndex(
      !this.fieldIndex ? TrainerSlot.TRAINER : TrainerSlot.TRAINER_PARTNER,
    );

    this.updatePokemonData();
    this.end();
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

    // Remove all tags applied to the active Pokemon's opponents by the active Pokemon
    // (e.g. the "binding" effect from Bind, Fire Spin, etc.)
    activePokemon.getOpponents().forEach((opp) => opp.removeTagsBySourceId(activePokemon.id));

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

    // If a Substitute was transferred, update the switched in Pokemon's sprite
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

    // Reset the switched out Pokemon's summon and turn data
    activePokemon.resetSummonData();
    activePokemon.resetTurnData();
    // Mark the switched in Pokemon as having switched in this turn
    if (this.switchType !== SwitchType.INITIAL_SWITCH) {
      switchedInPokemon.turnData.switchedInThisTurn = true;
    }
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
