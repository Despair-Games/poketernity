import type { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import type { AbilityFilterOptions } from "#types/ability-types";

//#region ApplyAbAttrsResult

/** The result of applying an ability attribute, whether simulated or actual. */
interface ApplyAbAttrResult<TAttr extends AbAttr> {
  /** The ability attribute that was processed */
  attr: TAttr;
  /** Whether the ability was applied (or would have been applied, if the check wasn't simulated) */
  applied: boolean;
  /** (Optional) Message to display when the attribute is applied */
  message: string | null;
}

//#endregion
//#region Exports

/**
 * Apply abilities with the {@linkcode AbilityApplyMode.DEFAULT | DEFAULT} ability mode.
 * @typeParam TAttr - The specific ability attribute type.
 * @param abAttrFlag - The {@linkcode AbAttrFlag} to apply
 * @param params - The parameters for the given attribute's `apply` function
 * @returns An array of {@linkcode ApplyAbAttrResult | applied ability attributes}
 *
 * @see {@linkcode applyAbAttrsInternal}
 */
export function applyAbAttrs<TAttr extends AbAttr = never>(
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): ApplyAbAttrResult<TAttr>[] {
  return applyAbAttrsInternal<TAttr>({ canApplyOnly: true }, abAttrFlag, ...params);
}

/**
 * Obtains the function to apply abilities corresponding to the given mode
 * @param mode - The {@linkcode AbilityApplyMode} determining how abilities are applied
 * @returns The function to apply abilities based on the mode:
 * - {@linkcode AbilityApplyMode.DEFAULT | DEFAULT} - Applies abilities without restriction
 *     (as long as they meet conditions to apply).
 * - {@linkcode AbilityApplyMode.REVEALED | REVEALED} - Only applies abilities that have
 *     previously applied in the current battle.
 * - {@linkcode AbilityApplyMode.IGNORE | IGNORE} - Does nothing and returns an empty array.
 *
 * @see {@linkcode applyAbAttrs} (Default)
 * @see {@linkcode applyRevealedAbAttrs} (Revealed)
 * @see {@linkcode applyNoAbAttrs} (Ignore)
 */
export function getAbApplyFunc(mode: AbilityApplyMode) {
  switch (mode) {
    case AbilityApplyMode.DEFAULT:
      return applyAbAttrs;
    case AbilityApplyMode.REVEALED:
      return applyRevealedAbAttrs;
    case AbilityApplyMode.IGNORE:
      return applyNoAbAttrs;
  }
}

//#endregion
//#region Internal Functions

/**
 * Applies a Pokemon's ability attributes of matching type
 * @typeParam TAttr - The specific ability attribute type.
 * @param abAttrFlag - The type of attribute to apply
 * @param params - The parameters for the given attribute's `apply` function. This should include:
 * - `pokemon`: The {@linkcode Pokemon} with the ability
 * - `simulated`: If `true`, suppresses changes to game state when applying.
 * - Any additional necessary arguments for the specific attribute type
 * @returns An array of {@linkcode ApplyAbAttrResult | applied ability attributes}
 * @see {@linkcode AbAttr}
 */
function applyAbAttrsInternal<TAttr extends AbAttr = never>(
  abFilterOptions: AbilityFilterOptions,
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): ApplyAbAttrResult<TAttr>[] {
  const results: ApplyAbAttrResult<TAttr>[] = [];
  const [pokemon, simulated, ...args] = params;
  const abilities = pokemon.getAbilities(abFilterOptions);

  abilities.forEach(({ ability, passive }) => {
    if (passive && pokemon.getPassiveAbility().id === pokemon.getAbility().id) {
      return;
    }

    const matchingAttrs = ability.getAttrs<TAttr>(abAttrFlag).filter((attr) => {
      const condition = attr.getCondition();
      return !condition || condition(pokemon);
    });

    matchingAttrs.forEach((attr) => {
      let message: ApplyAbAttrResult<TAttr>["message"] = null;
      const applied = attr.canApply(...params);
      if (!applied) {
        return;
      }

      if (attr.showAbility && !simulated) {
        globalScene.phaseManager.createAndUnshiftPhase("ShowAbilityPhase", pokemon, passive);
      }

      message = attr.getTriggerMessage(pokemon, ability.name, ...args);
      if (message && !simulated) {
        globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", message);
      }

      attr.apply(pokemon, simulated, ...args);

      if (!pokemon.summonData.abilitiesApplied.includes(ability.id)) {
        pokemon.summonData.abilitiesApplied.push(ability.id);
      }

      if (!pokemon.waveData.abilitiesApplied.includes(ability.id)) {
        pokemon.waveData.abilitiesApplied.push(ability.id);
        pokemon.waveData.abilitiesRevealed.push(ability.id);
      }

      if (attr.showAbility && !simulated) {
        globalScene.phaseManager.createAndUnshiftPhase("HideAbilityPhase", pokemon);
      }

      results.push({ attr, applied, message });
    });
  });

  return results;
}

/**
 * Apply abilities with the {@linkcode AbilityApplyMode.REVEALED | REVEALED} ability mode.
 * @typeParam TAttr - The specific ability attribute type.
 * @param abAttrFlag - The {@linkcode AbAttrFlag} to apply
 * @param params - The parameters for the given attribute's `apply` function
 * @returns An array of {@linkcode ApplyAbAttrResult | applied ability attributes}
 */
function applyRevealedAbAttrs<TAttr extends AbAttr = never>(
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): ApplyAbAttrResult<TAttr>[] {
  return applyAbAttrsInternal<TAttr>({ canApplyOnly: true, revealedOnly: true }, abAttrFlag, ...params);
}

/**
 * Apply abilities with the {@linkcode AbilityApplyMode.IGNORE | IGNORE} ability mode.
 * @typeParam TAttr - The specific ability attribute type.
 * @returns an empty array
 */
function applyNoAbAttrs<TAttr extends AbAttr>(
  _abAttrFlag: AbAttrFlag,
  ..._params: Parameters<TAttr["apply"]>
): ApplyAbAttrResult<TAttr>[] {
  return [];
}

//#endregion
