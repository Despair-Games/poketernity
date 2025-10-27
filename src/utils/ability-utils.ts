import { globalScene } from "#app/global-scene";
import { TERA_MOVES } from "#constants/move-constants";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { AbAttrCondition } from "#types/ability-types";
import type { PokemonAttackCondition } from "#types/move-types";
import type { NonEmptyArray } from "#types/utility-types";

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

export function getWeatherCondition(...weatherTypes: Readonly<NonEmptyArray<WeatherType>>): AbAttrCondition {
  return () => {
    if (!globalScene?.arena) {
      return false;
    }
    if (globalScene.arena.weather?.isEffectSuppressed()) {
      return false;
    }
    return globalScene.arena.hasWeather(...weatherTypes);
  };
}

/**
 * @returns `true` if the move isn't a variable-type move. Tera-based variable-type moves may
 * still have their type changed by abilities with this condition if the user is not Terastallized.
 * @remarks
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Normalize_(Ability) | Normalize} and as
 * part of the conditions for {@link https://bulbapedia.bulbagarden.net/wiki/Pixilate_(Ability) | Pixilate} et al.
 */
export const anyTypeMoveConversionCondition: PokemonAttackCondition = (user, _target, move) =>
  !move?.hasAttr(VariableMoveTypeAttr) || (TERA_MOVES.includes(move.id) && !user?.isTerastallized);

/**
 * Similar to {@linkcode anyTypeMoveConversionCondition}, except that the given move must also be Normal-type.
 *
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pixilate_(Ability) | Pixilate} et al.
 */
export const normalTypeMoveConversionCondition: PokemonAttackCondition = (user, target, move) =>
  move?.type === ElementalType.NORMAL && anyTypeMoveConversionCondition(user, target, move);
