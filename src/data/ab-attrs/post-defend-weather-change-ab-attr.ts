import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { WeatherType } from "#enums/weather-type";
import type { PokemonDefendCondition } from "../../@types/PokemonDefendCondition";
import type Move from "../move";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendWeatherChangeAbAttr extends PostDefendAbAttr {
  private weatherType: WeatherType;
  protected condition?: PokemonDefendCondition;

  constructor(weatherType: WeatherType, condition?: PokemonDefendCondition) {
    super();

    this.weatherType = weatherType;
    this.condition = condition;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if ((this.condition && !this.condition(pokemon, attacker, move)) || move.hitsSubstitute(attacker, pokemon)) {
      return false;
    }
    if (!globalScene.arena.weather?.isImmutable()) {
      if (simulated) {
        return globalScene.arena.weather?.weatherType !== this.weatherType;
      }
      return globalScene.arena.trySetWeather(this.weatherType, true);
    }

    return false;
  }
}
