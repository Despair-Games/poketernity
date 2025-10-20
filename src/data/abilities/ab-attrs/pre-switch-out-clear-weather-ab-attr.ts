import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon switching out.
 */
export class PreSwitchOutClearWeatherAbAttr extends PreSwitchOutAbAttr {
  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.arena.trySetWeather(WeatherType.NONE, false);
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return !globalScene.getField(true).some((p) => p !== pokemon && p.hasAbility(this.source.id));
  }
}
