import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { MoveFlags } from "#enums/move-flags";
import { VariableMovePowerAbAttr } from "./variable-move-power-ab-attr";

/**
 * Ability attribute that boosts the power of a move by a factor if it has a specified flag
 * +---------------+---------------+------------+
 * |    Ability    |   Move Flag   | Multiplier |
 * +---------------+---------------+------------+
 * | Iron Fist     | PUNCHING_MOVE |        1.2 |
 * | Mega Launcher | PULSE_MOVE    |        1.5 |
 * | Tough Claws   | MAKES_CONTACT |        1.3 |
 * | Sharpness     | SLICING_MOVE  |        1.5 |
 * +---------------+---------------+------------+
 */
export class MoveFlagPowerBoostAbAttr extends VariableMovePowerAbAttr {
  private readonly flagRequired: MoveFlags;
  private readonly powerMultiplier: number;

  constructor(flagRequired: MoveFlags, powerMultiplier: number, showAbility: boolean = true) {
    super(showAbility);
    this.flagRequired = flagRequired;
    this.powerMultiplier = powerMultiplier;
  }

  override apply(pokemon: Pokemon, _simulated: boolean, move: Move, defender: Pokemon, power: NumberHolder): boolean {
    if (pokemon && move.checkFlag(this.flagRequired, pokemon, defender)) {
      power.value *= this.powerMultiplier;
      return true;
    }
    return false;
  }
}
