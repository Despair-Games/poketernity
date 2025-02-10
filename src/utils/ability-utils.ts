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
    const weatherType = globalScene.arena.weather?.weatherType;
    return !!weatherType && weatherTypes.indexOf(weatherType) > -1;
  };
}
