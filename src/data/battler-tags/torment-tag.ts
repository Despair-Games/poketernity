import { MoveRestrictionBattlerTag } from "#app/data/battler-tags/move-restriction-battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveLockTagTypes } from "#app/utils/battler-tag-type-utils";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import i18next from "i18next";

/**
 * Tag that applies the move Torment to the target Pokemon, preventing the use of moves twice in a row.
 * The tag is only removed if the target leaves the battle.
 * Torment does not interrupt the move if the move is performed consecutively in the same turn and right after Torment is applied
 * @extends MoveRestrictionBattlerTag
 */
export class TormentTag extends MoveRestrictionBattlerTag {
  constructor(sourceId: number) {
    super(BattlerTagType.TORMENT, BattlerTagLapseType.AFTER_MOVE, 1, MoveId.TORMENT, sourceId);
  }

  /**
   * Adds the battler tag to the target Pokemon and defines the private class variable 'target'
   * 'Target' is used to track the Pokemon's current status
   * @param pokemon the Pokemon tormented
   */
  override onAdd(pokemon: Pokemon) {
    super.onAdd(pokemon);
    globalScene.queueMessage(
      i18next.t("battlerTags:tormentOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      1500,
    );
  }

  /**
   * Torment only ends when the affected Pokemon leaves the battle field
   * @param pokemon the Pokemon under the effects of Torment
   * @param _tagType
   * @returns `true` if still present | `false` if not
   */
  override lapse(pokemon: Pokemon, _tagType: BattlerTagLapseType): boolean {
    return pokemon.isActive(true);
  }

  /**
   * This checks if the current move used is identical to the last used move with a {@linkcode MoveResult} of `SUCCESS`/`MISS`
   * @param moveId the move under investigation
   * @returns `true` if there is valid consecutive usage | `false` if the moves are different from each other
   */
  public override isMoveRestricted(moveId: MoveId, user: Pokemon): boolean {
    if (!user) {
      return false;
    }
    const lastMoveTurn = user.getLastXMoves(1)[0];
    if (!lastMoveTurn) {
      return false;
    }

    const validLastMoveResult = lastMoveTurn.result === MoveResult.SUCCESS || lastMoveTurn.result === MoveResult.MISS;
    if (
      lastMoveTurn.move.id === moveId
      && validLastMoveResult
      && lastMoveTurn.move.id !== MoveId.STRUGGLE
      && !user.getTag(...MoveLockTagTypes)
    ) {
      return true;
    }
    return false;
  }

  override getSelectionDeniedText(pokemon: Pokemon, _moveId: MoveId): string {
    return i18next.t("battle:moveDisabledTorment", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }

  override getInterruptedText(_pokemon: Pokemon, _moveId: MoveId): string {
    return "";
  }
}
