import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";

/**
 * Attribute to increase the user's offensive stats by
 * 2 stages if the weather is sunny and 1 stage otherwise.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Growth_(move) Growth}.
 * @extends StatStageChangeAttr
 */
export class GrowthStatStageChangeAttr extends StatStageChangeAttr {
  constructor() {
    super([Stat.ATK, Stat.SPATK], 1, true);
  }

  override getLevels(_user: Pokemon): number {
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      const weatherType = globalScene.arena.weather?.weatherType;
      if (weatherType === WeatherType.SUNNY || weatherType === WeatherType.HARSH_SUN) {
        return this.stages + 1;
      }
    }
    return this.stages;
  }
}
