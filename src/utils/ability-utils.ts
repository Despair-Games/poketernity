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
