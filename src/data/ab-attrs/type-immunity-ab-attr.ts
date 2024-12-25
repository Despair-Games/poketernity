import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Move } from "#app/data/move";
import { MoveTarget } from "../../enums/move-target";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { Type } from "#enums/type";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Determines whether a Pokemon is immune to a move because of an ability.
 * @extends PreDefendAbAttr
 * @see {@linkcode applyPreDefend}
 * @see {@linkcode getCondition}
 */
export class TypeImmunityAbAttr extends PreDefendAbAttr {
  private readonly immuneType: Type | null;
  private readonly condition: AbAttrCondition | null;

  constructor(immuneType: Type | null, condition?: AbAttrCondition) {
    super();

    this.immuneType = immuneType;
    this.condition = condition ?? null;
  }

  /**
   * Applies immunity if this ability grants immunity to the type of the given move.
   * @param pokemon - The defending {@linkcode Pokemon}
   * @param _passive - N/A
   * @param attacker - The attacking {@linkcode Pokemon}
   * @param move The used {@linkcode Move}
   * @param _cancelled N/A
   * @param args `[0]`: {@linkcode NumberHolder} gets set to `0` if the pokemon is immune
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
    const typeMultiplier: NumberHolder = args[0];
    // Field moves should ignore immunity
    if ([MoveTarget.BOTH_SIDES, MoveTarget.ENEMY_SIDE, MoveTarget.USER_SIDE].includes(move.moveTarget)) {
      return false;
    }
    if (attacker !== pokemon && attacker.getMoveType(move) === this.immuneType) {
      typeMultiplier.value = 0;
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
