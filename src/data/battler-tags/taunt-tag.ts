import { MoveRestrictionBattlerTag } from "#app/data/battler-tags/move-restriction-battler-tag";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag that applies the effects of Taunt to the target Pokemon, restricting the use of status moves.
 * The tag is removed after 4 turns.
 * @extends MoveRestrictionBattlerTag
 */
export class TauntTag extends MoveRestrictionBattlerTag {
  constructor() {
    super(BattlerTagType.TAUNT, [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.AFTER_MOVE], 4, MoveId.TAUNT);
  }

  override onAdd(pokemon: Pokemon) {
    super.onAdd(pokemon);
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:tauntOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      1500,
    );
  }

  /**
   * Checks if a move is a status move and determines its restriction status on that basis
   * @param moveId the move under investigation
   * @returns `true` if the move is a status move
   */
  override isMoveRestricted(moveId: MoveId): boolean {
    return allMoves.get(moveId).category === MoveCategory.STATUS;
  }

  override getSelectionDeniedText(pokemon: Pokemon, moveId: MoveId): string {
    return i18next.t("battle:moveDisabledTaunt", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: allMoves.get(moveId).name,
    });
  }

  override getInterruptedText(pokemon: Pokemon, moveId: MoveId): string {
    return i18next.t("battle:moveDisabledTaunt", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: allMoves.get(moveId).name,
    });
  }
}
