import { MoveRestrictionBattlerTag } from "#app/data/battler-tags/move-restriction-battler-tag";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the "Throat Chop" effect. Pokemon with this tag cannot use sound-based moves.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Throat_Chop_(move) | Throat Chop}
 * @extends MoveRestrictionBattlerTag
 */
export class ThroatChoppedTag extends MoveRestrictionBattlerTag {
  constructor() {
    super(
      BattlerTagType.THROAT_CHOPPED,
      [BattlerTagLapseType.TURN_END, BattlerTagLapseType.PRE_MOVE],
      2,
      MoveId.THROAT_CHOP,
    );
  }

  /**
   * Checks if a {@linkcode MoveId | move} is restricted by Throat Chop
   * @param moveId - The {@linkcode MoveId | move} to check for sound-based restriction
   * @returns `true` if the move is sound-based, `false` otherwise
   */
  override isMoveRestricted(moveId: MoveId): boolean {
    return allMoves.get(moveId).hasFlag(MoveFlags.SOUND_MOVE);
  }

  /**
   * Shows a message when the player attempts to select a move that is restricted by Throat Chop.
   * @override
   * @param _pokemon - The {@linkcode Pokemon} that is attempting to select the restricted move
   * @param moveId - The {@linkcode MoveId | move} that is being restricted
   * @returns the message to display when the player attempts to select the restricted move
   */
  override getSelectionDeniedText(_pokemon: Pokemon, moveId: MoveId): string {
    return i18next.t("battle:moveCannotBeSelected", { moveName: allMoves.get(moveId).name });
  }

  /**
   * Shows a message when a move is interrupted by Throat Chop.
   * @override
   * @param pokemon - The interrupted {@linkcode Pokemon}
   * @param _moveId - The {@linkcode MoveId | move} that was interrupted
   * @returns the message to display when the move is interrupted
   */
  override getInterruptedText(pokemon: Pokemon, _moveId: MoveId): string {
    return i18next.t("battle:throatChopInterruptedMove", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
}
