import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon fainting
 */
export class PostFaintClearWeatherAbAttr extends PostFaintAbAttr {
  public override apply(_pokemon: Pokemon, simulated: boolean, _attacker?: Pokemon, _move?: Move): void {
    if (!simulated) {
      globalScene.arena.trySetWeather(WeatherType.NONE, false);
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return !globalScene.getField(true).some((p) => p !== pokemon && p.hasAbility(this.source.id));
  }
}
