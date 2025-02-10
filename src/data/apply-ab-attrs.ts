import type { AbAttr } from "#app/data/ab-attrs/ab-attr";
import type { AbilityFilterOptions } from "#app/data/ability-filter-options";
import { queueShowAbility } from "#app/utils/ability-utils";
import { globalScene } from "#app/global-scene";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import type { AbAttrFlag } from "#enums/ab-attr-flag";

//#region Exports

export function applyAbAttrs<TAttr extends AbAttr>(
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): string[] {
  return applyAbAttrsInternal({ canApplyOnly: true }, abAttrFlag, ...params);
}

/**
 * Obtains the function to apply abilities corresponding to the given mode
 * @param mode the {@linkcode AbilityApplyMode} determining how abilities are applied:
 * @returns the function to apply abilities based on the mode:
 * - {@linkcode AbilityApplyMode.DEFAULT} applies abilities without restriction
 * (as long as they meet conditions to apply).
 * - {@linkcode AbilityApplyMode.REVEALED} only applies abilities that have
 * previously applied in the current battle.
 * - {@linkcode AbilityApplyMode.IGNORE} does nothing and returns an empty
 * message array.
 */
export function getAbApplyFunc(mode: AbilityApplyMode) {
  switch (mode) {
    case AbilityApplyMode.DEFAULT:
      return applyAbAttrs;
    case AbilityApplyMode.REVEALED:
      return applyRevealedAbAttrs;
    case AbilityApplyMode.IGNORE:
      return () => [];
  }
}

//#endregion
//#region Helpers

/**
 * Applies a Pokemon's ability attributes of matching type
 * @param abAttrFlag The type of attribute to apply
 * @param params The parameters for the given attribute's `apply` function. This should include:
 * - `pokemon`: The {@linkcode Pokemon} with the ability
 * - `simulated`: If `true`, suppresses changes to game state when applying.
 * - Any additional necessary arguments for the specific attribute type
 * @returns The message(s) displayed when the ability applies
 * @see {@linkcode AbAttr}
 */
function applyAbAttrsInternal<TAttr extends AbAttr>(
  abFilterOptions: AbilityFilterOptions,
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): string[] {
  const messages: string[] = [];
  const [pokemon, simulated, ...args] = params;
  const abilities = pokemon.getAbilities(abFilterOptions);
  abilities.forEach(({ ability, passive }) => {
    if (passive && pokemon.getPassiveAbility().id === pokemon.getAbility().id) {
      return;
    }

    const matchingAttrs = ability.getAttrs(abAttrFlag).filter((attr) => {
      const condition = attr.getCondition();
      return !condition || condition(pokemon);
    });

    matchingAttrs.forEach((attr) => {
      globalScene.setPhaseQueueSplice();

      const result = attr.apply(pokemon, simulated, ...args);
      if (result && !simulated) {
        if (pokemon.summonData && !pokemon.summonData.abilitiesApplied.includes(ability.id)) {
          pokemon.summonData.abilitiesApplied.push(ability.id);
        }
        if (pokemon.battleData && !pokemon.battleData.abilitiesApplied.includes(ability.id)) {
          pokemon.battleData.abilitiesApplied.push(ability.id);
          pokemon.battleData.abilitiesRevealed.push(ability.id);
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
        const message = attr.getTriggerMessage(pokemon, ability.name, ...args);
        if (message) {
          if (!simulated) {
            globalScene.queueMessage(message);
          }
          messages.push(message);
        }
      }

      globalScene.clearPhaseQueueSplice();
    });
  });

  return messages;
}

function applyRevealedAbAttrs<TAttr extends AbAttr>(
  abAttrFlag: AbAttrFlag,
  ...params: Parameters<TAttr["apply"]>
): string[] {
  return applyAbAttrsInternal({ canApplyOnly: true, revealedOnly: true }, abAttrFlag, ...params);
}

//#endregion
