import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/move-types";

export class PostDefendWeatherChangeAbAttr extends PostDefendAbAttr {
  private readonly weatherType: WeatherType;
  protected readonly condition?: PokemonDefendCondition;

  constructor(weatherType: WeatherType, condition?: PokemonDefendCondition) {
    super();

    this.weatherType = weatherType;
    this.condition = condition;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (this.condition && !this.condition(pokemon, attacker, move)) {
      return false;
    }
    if (globalScene.arena.canSetWeather(this.weatherType)) {
      if (simulated) {
        return !globalScene.arena.hasWeather(this.weatherType);
      }
      return globalScene.arena.trySetWeather(this.weatherType, true);
    }

    return false;
  }
}
