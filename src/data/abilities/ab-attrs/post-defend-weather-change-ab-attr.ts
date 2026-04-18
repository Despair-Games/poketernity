import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonDefendCondition } from "#types/move-types";

export class PostDefendWeatherChangeAbAttr extends PostDefendAbAttr {
  private readonly weatherType: WeatherType;
  protected readonly condition: PokemonDefendCondition;

  constructor(weatherType: WeatherType, condition: PokemonDefendCondition = () => true) {
    super();

    this.weatherType = weatherType;
    this.condition = condition;
  }

  public override apply({ simulated }: PostDefendAbAttrParams): void {
    if (!simulated) {
      globalScene.arena.trySetWeather(this.weatherType, true);
    }
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, attacker, move) && globalScene.arena.canSetWeather(this.weatherType);
  }
}
