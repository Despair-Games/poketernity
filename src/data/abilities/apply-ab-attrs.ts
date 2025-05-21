import type { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import type { AbilityFilterOptions } from "#types/ability-filter-options";
import { queueShowAbility } from "#utils/ability-utils";

//#region ApplyAbAttrsResult

interface AppliedAbAttr {
  /** The name of the constructor of the {@linkcode AbAttr} */
  name: string;
  /** The (simulated) result of applying the attribute */
  result: boolean;
  /** The (optional) message to show if the attribute was applied */
  message: string | null;
}

//#endregion
//#region Exports

/**
 * The function for using the {@linkcode AbilityApplyMode.DEFAULT | DEFAULT} ability mode
 * @param abAttrFlag - The {@linkcode AbAttrFlag} to apply
 * @param params - The parameters for the given attribute's `apply` function
 * @returns The apply function to use
 *
 * @see {@linkcode applyAbAttrsInternal}
 */
export function applyAbAttrs<TAttr extends AbAttr>(
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): AppliedAbAttr[] {
  return applyAbAttrsInternal<TAttr>({ canApplyOnly: true }, abAttrFlag, ...params);
}

/**
 * Obtains the function to apply abilities corresponding to the given mode
 * @param mode - The {@linkcode AbilityApplyMode} determining how abilities are applied
 * @returns The function to apply abilities based on the mode:
 * - {@linkcode AbilityApplyMode.DEFAULT DEFAULT} - Applies abilities without restriction
 *     (as long as they meet conditions to apply).
 * - {@linkcode AbilityApplyMode.REVEALED REVEALED} - Only applies abilities that have
 *     previously applied in the current battle.
 * - {@linkcode AbilityApplyMode.IGNORE IGNORE} - Does nothing and returns an empty array.
 *
 * @see {@linkcode applyAbAttrs} (Default)
 * @see {@linkcode applyRevealedAbAttrs} (Revealed)
 * @see {@linkcode ignoreAbAttrs} (Ignore)
 */
export function getAbApplyFunc(mode: AbilityApplyMode) {
  switch (mode) {
    case AbilityApplyMode.DEFAULT:
      return applyAbAttrs;
    case AbilityApplyMode.REVEALED:
      return applyRevealedAbAttrs;
    case AbilityApplyMode.IGNORE:
      return ignoreAbAttrs;
  }
}

//#endregion
//#region Internal Functions

/**
 * Applies a Pokemon's ability attributes of matching type
 * @template TAttr The specific ability attribute type.
 * @param abAttrFlag The type of attribute to apply
 * @param params The parameters for the given attribute's `apply` function. This should include:
 * - `pokemon`: The {@linkcode Pokemon} with the ability
 * - `simulated`: If `true`, suppresses changes to game state when applying.
 * - Any additional necessary arguments for the specific attribute type
 * @returns An array of {@linkcode AppliedAbAttr | applied ability attributes}
 * @see {@linkcode AbAttr}
 */
function applyAbAttrsInternal<TAttr extends AbAttr>(
  abFilterOptions: AbilityFilterOptions,
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): AppliedAbAttr[] {
  const applied: AppliedAbAttr[] = [];
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
      globalScene.phaseManager.setPhaseQueueSplice();
      let message: AppliedAbAttr["message"] = null;
      const result = attr.apply(pokemon, simulated, ...args);

      if (result && !simulated) {
        if (pokemon.summonData && !pokemon.summonData.abilitiesApplied.includes(ability.id)) {
          pokemon.summonData.abilitiesApplied.push(ability.id);
        }

        if (!pokemon.waveData.abilitiesApplied.includes(ability.id)) {
          pokemon.waveData.abilitiesApplied.push(ability.id);
          pokemon.waveData.abilitiesRevealed.push(ability.id);
        }

        if (attr.showAbility) {
          if (attr.showAbilityInstant) {
            globalScene.abilityBar.showAbility(pokemon, passive);
          } else {
            queueShowAbility(pokemon, passive);
          }
        }
      }

      if (result) {
        message = attr.getTriggerMessage(pokemon, ability.name, ...args);

        if (message) {
          if (!simulated) {
            globalScene.phaseManager.queueMessagePhase(message);
          }
        }
      }

      globalScene.phaseManager.clearPhaseQueueSplice();
      applied.push({ name: attr.constructor.name, result, message });
    });
  });

  return applied;
}

/**
 * The function for using the {@linkcode AbilityApplyMode.REVEALED | REVEALED} ability mode
 * @param abAttrFlag - The {@linkcode AbAttrFlag} to apply
 * @param params - The parameters for the given attribute's `apply` function
 * @returns The apply function to use
 */
function applyRevealedAbAttrs<TAttr extends AbAttr>(
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): AppliedAbAttr[] {
  return applyAbAttrsInternal<TAttr>({ canApplyOnly: true, revealedOnly: true }, abAttrFlag, ...params);
}

/**
 * The function for using the {@linkcode AbilityApplyMode.IGNORE | IGNORE} ability mode
 * @returns an empty object satisfying the {@linkcode AppliedAbAttr}
 */
function ignoreAbAttrs<TAttr extends AbAttr>(
  _abAttrFlag: AbAttrFlag,
  ..._params: Parameters<TAttr["apply"]>
): AppliedAbAttr[] {
  return [];
}

//#endregion
