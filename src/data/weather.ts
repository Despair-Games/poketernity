import type { SuppressWeatherEffectAbAttr } from "#abilities/suppress-weather-effect-ab-attr";
import { globalScene } from "#app/global-scene";
import { PRIMAL_WEATHER_TYPES } from "#constants/weather-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ElementalType } from "#enums/elemental-type";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/** Class representing Weather effects */
export class Weather {
  public weatherType: WeatherType;
  public turnsLeft: number;

  /**
   * @param weatherType - The {@linkcode WeatherType} that is being represented
   * @param turnsLeft - How many turns the weather still has left (0 if immutable)
   */
  constructor(weatherType: WeatherType, turnsLeft: number = 0) {
    this.weatherType = weatherType;
    this.turnsLeft = this.isPrimal() ? 0 : turnsLeft;
  }

  /**
   * Decrements {@linkcode turnsLeft} by 1
   * @returns `true` if the weather {@linkcode isPrimal} or if `turnsLeft !== 0`
   */
  lapse(): boolean {
    if (this.isPrimal()) {
      return true;
    }
    if (this.turnsLeft) {
      return --this.turnsLeft !== 0;
    }

    return true;
  }

  /**
   * Checks if the weather is immutable (heavy rain, harsh sun, or strong winds)
   * @returns true if {@linkcode WeatherType} is immutable, false otherwise
   */
  isPrimal(): boolean {
    return PRIMAL_WEATHER_TYPES.includes(this.weatherType);
  }

  /**
   * Checks if the weather deals damage
   * @returns true for sandstorm or hail, false otherwise
   */
  isDamaging(): boolean {
    return [WeatherType.SANDSTORM, WeatherType.HAIL].includes(this.weatherType);
  }

  /**
   * Checks if the weather will deal damage to a type
   * Rock/Ground/Steel types are immune to sandstorm
   * Ice is immune to hail
   * @param type - the {@linkcode ElementalType} of the Pokemon being checked
   * @returns true if damage will be dealt, false otherwise
   */
  isTypeDamageImmune(type: ElementalType): boolean {
    switch (this.weatherType) {
      case WeatherType.SANDSTORM:
        return type === ElementalType.GROUND || type === ElementalType.ROCK || type === ElementalType.STEEL;
      case WeatherType.HAIL:
        return type === ElementalType.ICE;
    }

    return false;
  }

  /**
   * Function to return a multiplier for specific types
   * Harsh/normal sun boosts fire by 50% and reduces water by 50%
   * Heavy/normal rain boosts water by 50% and reduces fire by 50%
   * @param attackType - the {@linkcode ElementalType} being checked
   * @returns a multiplier (0.5, 1.5, or 1)
   */
  getAttackTypeMultiplier(attackType: ElementalType): number {
    switch (this.weatherType) {
      case WeatherType.SUNNY:
      case WeatherType.HARSH_SUN:
        if (attackType === ElementalType.FIRE) {
          return 1.5;
        }
        if (attackType === ElementalType.WATER) {
          return 0.5;
        }
        break;
      case WeatherType.RAIN:
      case WeatherType.HEAVY_RAIN:
        if (attackType === ElementalType.FIRE) {
          return 0.5;
        }
        if (attackType === ElementalType.WATER) {
          return 1.5;
        }
        break;
    }

    return 1;
  }

  /**
   * Checks if the weather should cancel the move
   * Harsh sun cancels out water attacks
   * Heavy rain cancels out fire attacks
   * @param user - The {@linkcode Pokemon} using the move
   * @param move - The {@linkcode Move}
   * @returns true if the move is cancelled by the weather, false otherwise
   */
  isMoveWeatherCancelled(user: Pokemon, move: Move): boolean {
    const moveType = user.getMoveType(move);

    switch (this.weatherType) {
      case WeatherType.HARSH_SUN:
        return move.isAttackMove() && moveType === ElementalType.WATER;
      case WeatherType.HEAVY_RAIN:
        return move.isAttackMove() && moveType === ElementalType.FIRE;
    }

    return false;
  }

  /**
   * Checks if the weather would be suppressed by a Pokemon with an ability/passive
   * with SuppressWeatherEffectAbAttr (Air Lock or Cloud Nine)
   * @returns true if the weather is being suppressed, false otherwise
   */
  isEffectSuppressed(): boolean {
    const field = globalScene.getField(true);

    for (const pokemon of field) {
      let suppressWeatherEffectAbAttr: SuppressWeatherEffectAbAttr | null = pokemon
        .getAbility()
        .getAttrs<SuppressWeatherEffectAbAttr>(AbAttrFlag.SUPPRESS_WEATHER_EFFECT)[0];
      if (!suppressWeatherEffectAbAttr) {
        suppressWeatherEffectAbAttr = pokemon.hasPassive()
          ? pokemon.getPassiveAbility().getAttrs<SuppressWeatherEffectAbAttr>(AbAttrFlag.SUPPRESS_WEATHER_EFFECT)[0]
          : null;
      }
      if (suppressWeatherEffectAbAttr && (!this.isPrimal() || suppressWeatherEffectAbAttr.affectsPrimal)) {
        return true;
      }
    }

    return false;
  }
}
