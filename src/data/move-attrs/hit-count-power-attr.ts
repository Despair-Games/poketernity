import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to increase move power by 50 times the number
 * of times the user has been hit in the current battle (up to 6).
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Rage_Fist_(move) Rage Fist}.
 * @extends VariablePowerAttr
 */
export class HitCountPowerAttr extends VariablePowerAttr {
  /**
   * Increases the given move's power by 50 times the number
   * of times the user has been hit in the current battle (up to 6 times).
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    power.value += Math.min(user.battleData.hitCount, 6) * 50;

    return true;
  }
}
