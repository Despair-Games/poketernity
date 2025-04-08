import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import type { WeatherType } from "#enums/weather-type";

/**
 * Returns the Pokemon with weather-based forms
 */
export function getPokemonWithWeatherBasedForms() {
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
