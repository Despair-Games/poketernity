import { MoveRestrictionBattlerTag } from "#app/data/battler-tags/move-restriction-battler-tag";
import { allMoves } from "#app/data/data-lists";
import { HealOnAllyAttr } from "#app/data/moves/move-attrs/heal-on-ally-attr";
import { StatusCategoryOnAllyAttr } from "#app/data/moves/move-attrs/status-category-on-ally-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { NumberHolder } from "#app/utils";
import { applyMoveAttrs } from "#app/utils/move-utils";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag that prevents HP recovery from held items and move effects. It also blocks the usage of recovery moves.
 * Applied by moves:  {@linkcode MoveId.HEAL_BLOCK | Heal Block (5 turns)}, {@linkcode MoveId.PSYCHIC_NOISE | Psychic Noise (2 turns)}
 * @extends MoveRestrictionBattlerTag
 */
export class HealBlockTag extends MoveRestrictionBattlerTag {
  constructor(turnCount: number, sourceMoveId: MoveId) {
    super(
      BattlerTagType.HEAL_BLOCK,
      [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.TURN_END],
      turnCount,
      sourceMoveId,
    );
  }

  onActivation(pokemon: Pokemon): string {
    return i18next.t("battle:battlerTagsHealBlock", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }

  /**
   * Checks if a move is disabled under Heal Block
   * @param moveId {@linkcode MoveId} the move ID
   * @returns `true` if the move has a TRIAGE_MOVE flag
   */
  override isMoveRestricted(moveId: MoveId): boolean {
    if (allMoves.get(moveId).hasFlag(MoveFlags.TRIAGE_MOVE)) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a move is disabled under Heal Block because of its choice of target
   * Implemented b/c of Pollen Puff
   * @param moveId {@linkcode MoveId} the move ID
   * @param user {@linkcode Pokemon} the move user
   * @param target {@linkcode Pokemon} the target of the move
   * @returns `true` if the move cannot be used because the target is an ally
   */
  override isMoveTargetRestricted(moveId: MoveId, user: Pokemon, target: Pokemon) {
    const moveCategory = new NumberHolder(allMoves.get(moveId).category);
    applyMoveAttrs(StatusCategoryOnAllyAttr, user, target, allMoves.get(moveId), moveCategory);
    if (allMoves.get(moveId).hasAttr(HealOnAllyAttr) && moveCategory.value === MoveCategory.STATUS) {
      return true;
    }
    return false;
  }

  /**
   * Uses its own unique getSelectionDeniedText() message
   */
  override getSelectionDeniedText(pokemon: Pokemon, moveId: MoveId): string {
    return i18next.t("battle:moveDisabledHealBlock", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: allMoves.get(moveId).name,
      healBlockName: allMoves.get(MoveId.HEAL_BLOCK).name,
    });
  }

  /**
   * @override
   * @param pokemon {@linkcode Pokemon} attempting to use the restricted move
   * @param moveId {@linkcode MoveId} ID of the move being interrupted
   * @returns text to display when the move is interrupted
   */
  override getInterruptedText(pokemon: Pokemon, moveId: MoveId): string {
    return i18next.t("battle:moveDisabledHealBlock", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: allMoves.get(moveId).name,
      healBlockName: allMoves.get(MoveId.HEAL_BLOCK).name,
    });
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battle:battlerTagsHealBlockOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      null,
      false,
      null,
    );
  }
}
