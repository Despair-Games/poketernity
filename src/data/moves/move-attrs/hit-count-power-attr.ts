import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to increase move power by 50 times the number
 * of times the user has been hit in the current battle (up to 6).
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Rage_Fist_(move) | Rage Fist}.
 * @extends VariablePowerAttr
 */
export class HitCountPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    power.value += Math.min(user.waveData.hitCount, 6) * 50;

    return true;
  }
}
