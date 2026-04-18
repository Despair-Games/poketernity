import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { Weather } from "#data/weather";
import { WeatherType } from "#enums/weather-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/** Base class for ability attributes that trigger when a pokemon leaves the field for any reason. */
export abstract class PreLeaveFieldAbAttr extends AbAttr {
  public override readonly abAttrKey = "PreLeaveFieldAbAttr";

  public abstract override apply(params: BaseAbAttrParams): void;
}

/**
 * Clears {@linkcode Weather.isPrimal | primal weather} conditions from the field
 * when no pokemon with the appropriate ability remains.
 */
// TODO: investigate implementing parts of https://github.com/pagefaultgames/pokerogue/pull/6740
export class PreLeaveFieldClearWeatherAbAttr extends PreLeaveFieldAbAttr {
  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return !globalScene.getField(true).some((p) => p !== pokemon && p.hasAbility(this.source.id));
  }

  public override apply({ simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }
    globalScene.arena.trySetWeather(WeatherType.NONE, false);
  }
}
