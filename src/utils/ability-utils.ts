import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";
import type { WeatherType } from "#enums/weather-type";

/**
 * Returns the Pokemon with weather-based forms
 */
export function getPokemonWithWeatherBasedForms() {
  return globalScene
    .getField(true)
    .filter(
      (p) =>
        (p.hasAbility(Abilities.FORECAST) && p.species.speciesId === Species.CASTFORM)
        || (p.hasAbility(Abilities.FLOWER_GIFT) && p.species.speciesId === Species.CHERRIM),
    );
}

export function queueShowAbility(pokemon: Pokemon, passive: boolean): void {
  globalScene.unshiftPhase(new ShowAbilityPhase(pokemon.id, passive));
  globalScene.clearPhaseQueueSplice();
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

/** Abilities perceived by the Enemy AI to have high value */
export const highValueAbilities: Readonly<Abilities[]> = [
  Abilities.WONDER_GUARD,
  Abilities.DESOLATE_LAND,
  Abilities.PRIMORDIAL_SEA,
  Abilities.HUGE_POWER,
  Abilities.PURE_POWER,
  Abilities.CONTRARY,
];

/** Abilities perceived by the Enemy AI to have a detrimental effect on the source */
export const detrimentalAbilities: Readonly<Abilities[]> = [
  Abilities.TRUANT,
  Abilities.WIMP_OUT,
  Abilities.EMERGENCY_EXIT,
  Abilities.DEFEATIST,
  Abilities.KLUTZ,
  Abilities.SLOW_START,
];
