/* biome-ignore-start lint/correctness/noUnusedImports: TSDoc imports */
import type { Weather } from "#data/weather";
/* biome-ignore-end lint/correctness/noUnusedImports: TSDoc imports */

import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

export class PreLeaveFieldAbAttr extends AbAttr {
  constructor(showAbility?: boolean) {
    super(showAbility);

    this._flags.add(AbAttrFlag.PRE_LEAVE_FIELD);
  }
}

/**
 * Clears {@linkcode Weather.isPrimal | primal weather} conditions from the field
 * when no pokemon with the appropriate ability remains.
 */
export class PreLeaveFieldClearWeatherAbAttr extends PreLeaveFieldAbAttr {
  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return !globalScene.getField(true).some((p) => p !== pokemon && p.hasAbility(this.source.id));
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (simulated) {
      return;
    }
    globalScene.arena.trySetWeather(WeatherType.NONE, false);
  }
}
