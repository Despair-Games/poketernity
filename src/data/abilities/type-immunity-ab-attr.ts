import type { Type } from "#app/enums/type";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { type Move, MoveTarget } from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

//#region Types

type AbAttrCondition = (pokemon: Pokemon) => boolean;

//#endregion

/**
 * Determines whether a Pokemon is immune to a move because of an ability.
 * @extends PreDefendAbAttr
 * @see {@linkcode applyPreDefend}
 * @see {@linkcode getCondition}
 */
export class TypeImmunityAbAttr extends PreDefendAbAttr {
  private immuneType: Type | null;
  private condition: AbAttrCondition | null;

  constructor(immuneType: Type | null, condition?: AbAttrCondition) {
    super();

    this.immuneType = immuneType;
    this.condition = condition ?? null;
  }

  /**
   * Applies immunity if this ability grants immunity to the type of the given move.
   * @param pokemon {@linkcode Pokemon} The defending Pokemon.
   * @param _passive - Whether the ability is passive.
   * @param attacker {@linkcode Pokemon} The attacking Pokemon.
   * @param move {@linkcode Move} The attacking move.
   * @param _cancelled {@linkcode BooleanHolder} - A holder for a boolean value indicating if the move was cancelled.
   * @param args [0] {@linkcode NumberHolder} gets set to 0 if move is immuned by an ability.
   * @param args [1] - Whether the move is simulated.
   */
  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    // Field moves should ignore immunity
    if ([MoveTarget.BOTH_SIDES, MoveTarget.ENEMY_SIDE, MoveTarget.USER_SIDE].includes(move.moveTarget)) {
      return false;
    }
    if (attacker !== pokemon && attacker.getMoveType(move) === this.immuneType) {
      (args[0] as NumberHolder).value = 0;
      return true;
    }
    return false;
  }

  getImmuneType(): Type | null {
    return this.immuneType;
  }

  override getCondition(): AbAttrCondition | null {
    return this.condition;
  }
}
