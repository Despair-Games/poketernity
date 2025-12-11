import { globalScene } from "#app/global-scene";
import { BattlerTag } from "#battler-tags/battler-tag";
import type { RestrictingBattlerTag } from "#battler-tags/restricting-battler-tag";
import type { RESTRICTING_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MovePhase } from "#phases/move-phase";

/**
 * Base class for tags that restrict the usage of moves.
 * This effect is generally referred to as "disabling" a move in-game.
 * This is not to be confused with {@linkcode MoveId.DISABLE}.
 *
 * Descendants can override {@linkcode isMoveRestricted} to restrict moves that match a condition.
 * A restricted move gets cancelled before it is used.
 *
 * Players and enemies should not be allowed to select restricted moves.
 *
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode RESTRICTING_TAG_TYPES}
 */
export abstract class MoveRestrictionBattlerTag extends BattlerTag implements RestrictingBattlerTag {
  /** @override */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.PRE_MOVE) {
      // Cancel the affected pokemon's selected move
      const phase = globalScene.phaseManager.getCurrentPhase() as MovePhase;
      const { pokemonMove } = phase;

      if (this.isMoveRestricted(pokemonMove.moveId, pokemon)) {
        const interruptedText = this.getInterruptedText(pokemon, pokemonMove.moveId);
        if (interruptedText) {
          globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", interruptedText);
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
  protected getLastValidMove(pokemon: Pokemon): Move | undefined {
    const turnMove = pokemon
      .getLastXMoves(-1)
      .find((m) => m.move.id !== MoveId.NONE && m.move.id !== MoveId.STRUGGLE && !m.virtual);

    return turnMove?.move;
  }
}
