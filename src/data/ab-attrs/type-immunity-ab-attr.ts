import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Move } from "#app/data/move";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { ElementalType } from "#enums/elemental-type";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Determines whether a Pokemon is immune to a move because of an ability.
 * @extends PreDefendAbAttr
 * @see {@linkcode applyPreDefend}
 * @see {@linkcode getCondition}
 */
export class TypeImmunityAbAttr extends PreDefendAbAttr {
  private readonly immuneType: ElementalType | null;
  private readonly condition: AbAttrCondition | null;

  constructor(immuneType: ElementalType | null, condition?: AbAttrCondition) {
    super();

    this.immuneType = immuneType;
    this.condition = condition ?? null;
  }

  /**
   * Applies immunity if this ability grants immunity to the type of the given move.
   * @param pokemon - The defending {@linkcode Pokemon}
   * @param simulated - N/A
   * @param attacker - The attacking {@linkcode Pokemon}
   * @param move The used {@linkcode Move}
   * @param cancelled N/A
   * @param typeMultiplier {@linkcode NumberHolder} gets set to `0` if the pokemon is immune
   */
  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _cancelled: BooleanHolder,
    typeMultiplier: NumberHolder,
  ): boolean {
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

  getImmuneType(): ElementalType | null {
    return this.immuneType;
  }

  override getCondition(): AbAttrCondition | null {
    return this.condition;
  }
}
