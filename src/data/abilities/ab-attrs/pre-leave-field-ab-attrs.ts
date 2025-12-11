import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { Weather } from "#data/weather";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

/** Base class for ability attributes that trigger when a pokemon leaves the field for any reason. */
export abstract class PreLeaveFieldAbAttr extends AbAttr {
  public override readonly abAttrKey = "PreLeaveFieldAbAttr";

  public abstract override apply(_pokemon: Pokemon, _simulated: boolean): void;
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
