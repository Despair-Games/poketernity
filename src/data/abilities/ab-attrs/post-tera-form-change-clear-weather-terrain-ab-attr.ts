import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Clears weather (including Primal weather) and terrain after Terastallization
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Teraform_Zero_(Ability) | Teraform Zero (Bulbapedia)}
 */
export class PostTeraFormChangeClearWeatherTerrainAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostTeraFormChangeClearWeatherTerrainAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      globalScene.arena.trySetWeather(WeatherType.NONE, true);
      globalScene.arena.trySetTerrain(TerrainType.NONE, true);
    }
  }
}
