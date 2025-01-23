import type { PreDefendAbAttrCondition } from "#app/@types/PreDefendAbAttrCondition";
import { MoveImmunityAbAttr } from "./move-immunity-ab-attr";
import type { MoveFlags } from "#enums/move-flags";

/**
 * This ability attribute provides the ability holder immunity to moves of a specified move flag category
 * Soundproof, Bulletproof, Powder
 */
export class MoveFlagImmunityAbAttr extends MoveImmunityAbAttr {
  /**
   * Extends MoveImmunityAbAttr
   * @param moveFlag the move flag the Pokemon is immune to
   */
  constructor(moveFlag: MoveFlags) {
    const immuneCondition: PreDefendAbAttrCondition = (pokemon, attacker, move) =>
      pokemon !== attacker && move.checkFlag(moveFlag, attacker, pokemon);
    super(immuneCondition);
  }
}
