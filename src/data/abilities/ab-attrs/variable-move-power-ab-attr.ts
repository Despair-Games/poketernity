import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

export abstract class VariableMovePowerAbAttr extends PreAttackAbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.VARIABLE_MOVE_POWER);
  }

  /**
   * Modifies a move's power when used by the source Pokemon
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @param move - The {@linkcode Move} being used
   * @param defender - The {@linkcode Pokemon} targeted by the move
   * @param power - A {@linkcode ValueHolder} containing the move's power for the current turn
   */
  public abstract override apply(
    pokemon: Pokemon,
    simulated: boolean,
    move: Move,
    defender: Pokemon,
    power: ValueHolder<number>,
  ): void;
}
