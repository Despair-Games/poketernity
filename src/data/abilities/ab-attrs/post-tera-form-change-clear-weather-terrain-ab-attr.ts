import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Used by Terapagos's Teraform Zero ability.
 * Clears weather (including Primal weather) and terrain after terastallization
 */
export class PostTeraFormChangeClearWeatherTerrainAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostTeraFormChangeClearWeatherTerrainAbAttr";

  constructor() {
    super(true);
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.arena.trySetWeather(WeatherType.NONE, true);
      globalScene.arena.trySetTerrain(TerrainType.NONE, true);
    }
  }
}
