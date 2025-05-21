import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { PostTurnResetStatusAbAttr } from "#abilities/post-turn-reset-status-ab-attr";
import { globalScene } from "#app/global-scene";
import { TERA_MOVES } from "#constants/move-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import { ShowAbilityPhase } from "#phases/show-ability-phase";
import type { AbAttrCondition } from "#types/ab-attr-condition";
import type { PokemonAttackCondition } from "#types/pokemon-attack-condition";

/**
 * @returns An array of Pokemon with weather-based forms
 */
export function getPokemonWithWeatherBasedForms(): Pokemon[] {
  return globalScene
    .getField(true)
    .filter(
      (p) =>
        (p.hasAbility(AbilityId.FORECAST) && p.species.speciesId === SpeciesId.CASTFORM)
        || (p.hasAbility(AbilityId.FLOWER_GIFT) && p.species.speciesId === SpeciesId.CHERRIM),
    );
}

export function queueShowAbility(pokemon: Pokemon, passive: boolean): void {
  globalScene.phaseManager.unshiftPhase(new ShowAbilityPhase(pokemon.id, passive));
  globalScene.phaseManager.clearPhaseQueueSplice();
}

export function getWeatherCondition(...weatherTypes: WeatherType[]): AbAttrCondition {
  return () => {
    if (!globalScene?.arena) {
      return false;
    }
    if (globalScene.arena.weather?.isEffectSuppressed()) {
      return false;
    }
    return globalScene.arena.hasWeather([...weatherTypes]);
  };
}

/** Used for Aerialate, Refrigerate, Pixilate, Galvanize */
export const normalTypeMoveConversionCondition: PokemonAttackCondition = (user, _target, move) =>
  move?.type === ElementalType.NORMAL
  && (!move.hasAttr(VariableMoveTypeAttr) || (TERA_MOVES.includes(move.id) && !user?.isTerastallized));

/**
 * Check if a Pokemon will wake up this turn by simulating the {@linkcode AbAttrFlag.POST_TURN} applications
 * and checking for a {@linkcode PostTurnResetStatusAbAttr} with a result of `true`.
 *
 * @param pokemon - The Pokemon to check
 * @returns `true` if the Pokemon will wake up this turn, `false` otherwise
 */
export function willWakeUpAtEndOfTurn(pokemon: Pokemon) {
  return applyAbAttrs<PostTurnResetStatusAbAttr>(AbAttrFlag.POST_TURN, pokemon, true).some(
    ({ name, result }) => PostTurnResetStatusAbAttr.prototype.constructor.name === name && result,
  );
}
