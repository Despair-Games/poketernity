import { AbAttr } from "#app/data/abilities/ab-attrs/ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";

/**
 * Used by Terapagos's Teraform Zero ability.
 * Clears weather (including Primal weather) and terrain after terastallization
 * @extends AbAttr
 */
export class PostTeraFormChangeClearWeatherTerrainAbAttr extends AbAttr {
  constructor() {
    super(true, true);

    this._flags.add(AbAttrFlag.POST_TERA_FORM_CHANGE_CLEAR_WEATHER_TERRAIN);
  }

  override apply(_pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      globalScene.arena.trySetWeather(WeatherType.NONE, true);
      globalScene.arena.trySetTerrain(TerrainType.NONE, true);
    }

    return true;
  }
}
