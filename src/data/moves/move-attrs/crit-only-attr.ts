import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute to guarantee that the move critically hits.
 */
export class CritOnlyAttr extends MoveAttr {
  /**
   * Guarantees critical hits when the given move is used
   * @param _user n/a
   * @param _target n/a
   * @param _move n/a
   * @param isCritical a {@linkcode BooleanHolder} containing a flag which, when set to `true`, guarantees critical hits
   * @returns `true`
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, isCritical: BooleanHolder): boolean {
    isCritical.value = true;

    return true;
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 5;
  }
}
