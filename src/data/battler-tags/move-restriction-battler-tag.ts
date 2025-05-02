import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { RestrictingBattlerTag } from "#app/data/battler-tags/restricting-battler-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { MovePhase } from "#app/phases/move-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * Base class for tags that restrict the usage of moves. This effect is generally referred to as "disabling" a move
 * in-game. This is not to be confused with {@linkcode MoveId.DISABLE}.
 *
 * Descendants can override {@linkcode isMoveRestricted} to restrict moves that
 * match a condition. A restricted move gets cancelled before it is used. Players and enemies should not be allowed
 * to select restricted moves.
 * @extends BattlerTag
 * @implements `RestrictingBattlerTag`
 */
export abstract class MoveRestrictionBattlerTag extends BattlerTag implements RestrictingBattlerTag {
  constructor(
    tagType: BattlerTagType,
    lapseType: BattlerTagLapseType | BattlerTagLapseType[],
    turnCount: number,
    sourceMoveId?: MoveId,
    sourceId?: number,
  ) {
    super(tagType, lapseType, turnCount, sourceMoveId, sourceId);
  }

  /** @override */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.PRE_MOVE) {
      // Cancel the affected pokemon's selected move
      const phase = globalScene.phaseManager.getCurrentPhase() as MovePhase;
      const move = phase.move;

      if (this.isMoveRestricted(move.moveId, pokemon)) {
        if (this.getInterruptedText(pokemon, move.moveId)) {
          globalScene.phaseManager.queueMessagePhase(this.getInterruptedText(pokemon, move.moveId));
        }
        phase.cancel();
      }

      return true;
    }

    return super.lapse(pokemon, lapseType);
  }

  /**
   * Gets whether this tag is restricting a move.
   *
   * @param moveId - {@linkcode MoveId} ID to check restriction for.
   * @param user - The {@linkcode Pokemon} involved
   * @returns `true` if the move is restricted by this tag, otherwise `false`.
   */
  public abstract isMoveRestricted(moveId: MoveId, user?: Pokemon): boolean;

  /**
   * Checks if this tag is restricting a move based on a user's decisions during the target selection phase
   * @param _moveId - The {@linkcode MoveId | move} to check restriction for
   * @param _user - The {@linkcode Pokemon | user} of the move
   * @param _target - The {@linkcode Pokemon| target} of the move
   * @returns `false` unless overridden by the child tag
   */
  public isMoveTargetRestricted(_moveId: MoveId, _user: Pokemon, _target: Pokemon): boolean {
    return false;
  }

  /**
   * Gets the text to display when the player attempts to select a move that is restricted by this tag.
   *
   * @param pokemon - {@linkcode Pokemon} for which the player is attempting to select the restricted move
   * @param moveId - {@linkcode MoveId | move} that is having its selection denied
   * @returns text to display when the player attempts to select the restricted move
   */
  abstract getSelectionDeniedText(pokemon: Pokemon, moveId: MoveId): string;

  /**
   * Gets the text to display when a move's execution is prevented as a result of the restriction.
   * Because restriction effects also prevent selection of the move, this situation can only arise if a
   * pokemon first selects a move, then gets outsped by a pokemon using a move that restricts the selected move.
   *
   * @param _pokemon - {@linkcode Pokemon} attempting to use the restricted move
   * @param _moveId - The {@linkcode MoveId | move} being interrupted
   * @returns text to display when the move is interrupted
   */
  abstract getInterruptedText(_pokemon: Pokemon, _moveId: MoveId): string;

  /**
   * Gets the last valid move from the pokemon's move history.
   * @param pokemon {@linkcode Pokemon} to get the last valid move from
   * @returns the last valid move from the pokemon's move history
   */
  public getLastValidMove(pokemon: Pokemon): Move | undefined {
    const turnMove = pokemon
      .getLastXMoves()
      .find((m) => m.move.id !== MoveId.NONE && m.move.id !== MoveId.STRUGGLE && !m.virtual);

    return turnMove?.move;
  }
}
