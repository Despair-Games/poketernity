import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { MoveFlags } from "#enums/move-flags";
import { MovePowerBoostAbAttr } from "./move-power-boost-ab-attr";

/**
 * Ability attribute that boosts the power of a move by a factor if it has a specified flag
 * ```
 * +---------------+---------------+------------+
 * |    Ability    |   Move Flag   | Multiplier |
 * +---------------+---------------+------------+
 * | Iron Fist     | PUNCHING_MOVE |        1.2 |
 * | Mega Launcher | PULSE_MOVE    |        1.5 |
 * | Tough Claws   | MAKES_CONTACT |        1.3 |
 * | Punk Rock     | SOUND_BASED   |        1.3 |
 * | Strong Jaw    | BITING_MOVE   |        1.5 |
 * | Reckless      | RECKLESS_MOVE |        1.2 |
 * | Sharpness     | SLICING_MOVE  |        1.5 |
 * +---------------+---------------+------------+
 * ```
 */
export class MoveFlagPowerBoostAbAttr extends MovePowerBoostAbAttr {
  constructor(flagRequired: MoveFlags, powerMultiplier: number) {
    const moveFlagCondition: PokemonAttackCondition = (user, _target, move) =>
      !!user && !!move?.checkFlag(flagRequired, user, null);
    super(moveFlagCondition, powerMultiplier);
  }
}
