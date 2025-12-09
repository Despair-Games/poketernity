import { globalScene } from "#app/global-scene";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import type { AbAttrKey, AbAttrMap, AbAttrParamMap, AbilityFilterOptions } from "#types/ability-types";

//#region ApplyAbAttrsResult

/** The result of applying an ability attribute, whether simulated or actual. */
interface ApplyAbAttrResult<K extends AbAttrKey> {
  /** The ability attribute that was processed */
  attr: AbAttrMap[K];
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
 * @param abAttrKey - The {@linkcode AbAttrKey} to apply
 * @param params - The parameters for the given attribute's `apply` function
 * @returns An array of {@linkcode ApplyAbAttrResult | applied ability attributes}
 *
 * @see {@linkcode applyAbAttrsInternal}
 */
export function applyAbAttrs<K extends AbAttrKey>(abAttrKey: K, ...params: AbAttrParamMap[K]): ApplyAbAttrResult<K>[] {
  return applyAbAttrsInternal<K>({ canApplyOnly: true }, abAttrKey, ...params);
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
 * @param abAttrKey - The {@linkcode AbAttrKey} to apply
 * @param params - The parameters for the given attribute's `apply` function. This should include:
 * - `pokemon`: The {@linkcode Pokemon} with the ability
 * - `simulated`: If `true`, suppresses changes to game state when applying.
 * - Any additional necessary arguments for the specific attribute type
 * @returns An array of {@linkcode ApplyAbAttrResult | applied ability attributes}
 * @see {@linkcode AbAttr}
 */
function applyAbAttrsInternal<K extends AbAttrKey>(
  abFilterOptions: AbilityFilterOptions,
  abAttrKey: K,
  ...params: AbAttrParamMap[K]
): ApplyAbAttrResult<K>[] {
  const results: ApplyAbAttrResult<K>[] = [];
  const [pokemon, simulated, ...args] = params;
  const abilities = pokemon.getAbilities(abFilterOptions);

  abilities.forEach(({ ability, passive }) => {
    if (passive && pokemon.getPassiveAbility().id === pokemon.getAbility().id) {
      return;
    }

    const matchingAttrs = ability.getAttrs(abAttrKey).filter((attr) => {
      const condition = attr.getCondition();
      return !condition || condition(pokemon);
    });

    matchingAttrs.forEach((attr) => {
      let message: ApplyAbAttrResult<K>["message"] = null;
      // Typescript does not support narrowing the type of operands in generic methods, hence the `as any` inclusion
      // (see https://stackoverflow.com/a/72891234)
      // @ts-expect-error
      const applied = attr.canApply(...params);
      if (!applied) {
        return;
      }

      if (attr.showAbility && !simulated) {
        globalScene.phaseManager.createAndUnshiftPhase("ShowAbilityPhase", pokemon, passive);
      }

      // @ts-expect-error: TS doesn't narrow `args` correctly (See above)
      message = attr.getTriggerMessage(pokemon, ability.name, ...args);
      if (message && !simulated) {
        globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", message);
      }

      // @ts-expect-error: TS doesn't narrow `args` correctly (See above)
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
 * @param abAttrKey - The {@linkcode AbAttrKey} to apply
 * @param params - The parameters for the given attribute's `apply` function
 * @returns An array of {@linkcode ApplyAbAttrResult | applied ability attributes}
 */
function applyRevealedAbAttrs<K extends AbAttrKey>(abAttrKey: K, ...params: AbAttrParamMap[K]): ApplyAbAttrResult<K>[] {
  return applyAbAttrsInternal<K>({ canApplyOnly: true, revealedOnly: true }, abAttrKey, ...params);
}

/**
 * Apply abilities with the {@linkcode AbilityApplyMode.IGNORE | IGNORE} ability mode.
 * @returns an empty array
 *
 * @remarks
 * This is just a formality for {@linkcode getAbApplyFunc} to return
 * a strongly-typed function instead of `() => []`. This shouldn't
 * be used outside of that context.
 */
function applyNoAbAttrs<K extends AbAttrKey>(_abAttrKey: K, ..._params: AbAttrParamMap[K]): ApplyAbAttrResult<K>[] {
  return [];
}

//#endregion
