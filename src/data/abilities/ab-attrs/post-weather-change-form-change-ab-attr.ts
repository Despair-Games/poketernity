import { PostWeatherChangeAbAttr } from "#abilities/post-weather-change-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { NonEmptyArray } from "#types/utility-types";

/**
 * Triggers weather-based form change when weather changes.
 * Used by Forecast and Flower Gift.
 */
export class PostWeatherChangeFormChangeAbAttr extends PostWeatherChangeAbAttr {
  private readonly formRevertingWeathers: Readonly<NonEmptyArray<WeatherType>>;

  constructor(...formRevertingWeathers: Readonly<NonEmptyArray<WeatherType>>) {
    super();

    this.formRevertingWeathers = formRevertingWeathers;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean, _weather: WeatherType): void {
    if (simulated) {
      return;
    }

    const { weatherType } = globalScene.arena;

    if (!weatherType || this.formRevertingWeathers.includes(weatherType)) {
      globalScene.arena.triggerWeatherBasedFormChangesToNormal();
    } else {
      globalScene.arena.triggerWeatherBasedFormChanges();
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === SpeciesId.CASTFORM && this.source.id === AbilityId.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === SpeciesId.CHERRIM && this.source.id === AbilityId.FLOWER_GIFT;

    return isCastformWithForecast || isCherrimWithFlowerGift;
  }
}
