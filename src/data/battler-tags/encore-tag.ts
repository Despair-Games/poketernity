import type { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { MoveRestrictionBattlerTag } from "#app/data/battler-tags/move-restriction-battler-tag";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Applies the effects of the move Encore onto the target Pokemon.
 * Encore forces the target Pokemon to use its most-recent move for 3 turns
 * @extends MoveRestrictionBattlerTag
 */
export class EncoreTag extends MoveRestrictionBattlerTag {
  public moveId: MoveId;

  constructor(sourceId: number) {
    super(
      BattlerTagType.ENCORE,
      [BattlerTagLapseType.CUSTOM, BattlerTagLapseType.AFTER_MOVE],
      3,
      MoveId.ENCORE,
      sourceId,
    );
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.moveId = source.moveId as MoveId;
  }

  override onAdd(pokemon: Pokemon): void {
    const lastMove = pokemon.getLastXMoves(-1).filter((mv) => !mv.virtual)[0];
    this.moveId = lastMove?.move.id;

    globalScene.queueMessage(
      i18next.t("battlerTags:encoreOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );

    const { turnManager } = globalScene.currentBattle;

    const movesetMove = pokemon.getMoveset().find((m) => m.moveId === this.moveId);
    if (movesetMove) {
      turnManager.tryReplaceMove(pokemon, movesetMove, lastMove?.targets ?? []);
    }
  }

  /**
   * If the encored move has run out of PP, Encore ends early. Otherwise, Encore lapses based on the AFTER_MOVE battler tag lapse type.
   * @returns `true` to persist | `false` to end and be removed
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.CUSTOM) {
      const encoredMove = pokemon.getMoveset().find((m) => m.moveId === this.moveId);
      if (encoredMove && encoredMove?.getPpRatio() > 0) {
        return true;
      }
      return false;
    } else {
      return super.lapse(pokemon, lapseType);
    }
  }

  /**
   * Checks if the move matches the moveId stored within the tag and returns a boolean value
   * @param moveId {@linkcode MoveId} the move selected
   * @param user N/A
   * @returns `true` if the move does not match with the moveId stored and as a result, restricted
   */
  override isMoveRestricted(moveId: MoveId, _user?: Pokemon): boolean {
    if (moveId !== this.moveId) {
      return true;
    }
    return false;
  }

  override getSelectionDeniedText(_pokemon: Pokemon, moveId: MoveId): string {
    return i18next.t("battle:moveDisabled", { moveName: allMoves.get(moveId).name });
  }

  override getInterruptedText(_pokemon: Pokemon, _moveId: MoveId): string {
    return "";
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:encoreOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
