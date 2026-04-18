import { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import type { MoveFlags } from "#enums/move-flags";
import type { PreDefendAbAttrCondition } from "#types/ability-types";

/**
 * This ability attribute provides the ability holder immunity to moves with the specified move flag
 * ```
+-------------+-------------+
|   Ability   |  Move Flag  |
+-------------+-------------+
| Soundproof  | SOUND_MOVE  |
| Overcoat    | POWDER_MOVE |
| Bulletproof | BULLET_MOVE |
+-------------+-------------+
 * ```
 */
export class MoveFlagImmunityAbAttr extends MoveImmunityAbAttr {
  /**
   * @param moveFlag - The move flag the Pokemon is immune to
   */
  constructor(moveFlag: MoveFlags) {
    const immuneCondition: PreDefendAbAttrCondition = (pokemon, attacker, move) =>
      pokemon !== attacker && move.checkFlag(moveFlag, attacker, pokemon);

    super(immuneCondition);
  }
}
