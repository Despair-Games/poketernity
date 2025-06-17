import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute to allow a move to ignore the target's stat stages when attacking.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Sacred_Sword_(move) | Sacred Sword}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Darkest_Lariat_(move) | Darkest Lariat}.
 */
export class IgnoreOpponentStatStagesAttr extends MoveAttr {
  /**
   * Allows the given move to ignore the target's stat stages when attacking
   * @param _user n/a
   * @param _target n/a
   * @param _move n/a
   * @param ignoreStatStage a {@linkcode BooleanHolder} which, if set to `true`, disables
   * the effects of the target's stat stages for the current attack.
   * @returns `true`
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, ignoreStatStage: BooleanHolder): boolean {
    ignoreStatStage.value = true;

    return true;
  }
}
