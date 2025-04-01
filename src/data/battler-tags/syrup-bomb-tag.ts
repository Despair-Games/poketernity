import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import i18next from "i18next";

/**
 * Tag that applies the effects of Syrup Bomb to the target Pokemon.
 * For three turns, starting from the turn of hit, at the end of each turn, the target Pokemon's speed will decrease by 1.
 * The tag can also expire by taking the target Pokemon off the field, or the Pokemon that originally used the move.
 * @extends BattlerTag
 */
export class SyrupBombTag extends BattlerTag {
  constructor(sourceId: number) {
    super(BattlerTagType.SYRUP_BOMB, BattlerTagLapseType.TURN_END, 3, MoveId.SYRUP_BOMB, sourceId);
  }

  /**
   * Adds the Syrup Bomb battler tag to the target Pokemon.
   * @param pokemon - The target {@linkcode Pokemon}
   */
  override onAdd(pokemon: Pokemon) {
    super.onAdd(pokemon);
    globalScene.queueMessage(
      i18next.t("battlerTags:syrupBombOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  /**
   * Applies the single-stage speed down to the target Pokemon and decrements the tag's turn count
   * @param pokemon - The target {@linkcode Pokemon}
   * @param _lapseType - N/A
   * @returns `true` if the `turnCount` is still greater than `0`; `false` if the `turnCount` is `0` or the target or source Pokemon has been removed from the field
   */
  override lapse(pokemon: Pokemon, _lapseType: BattlerTagLapseType): boolean {
    if (this.sourceId && !globalScene.getPokemonById(this.sourceId)?.isActive(true)) {
      return false;
    }
    // Custom message in lieu of an animation in mainline
    globalScene.queueMessage(
      i18next.t("battlerTags:syrupBombLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
    globalScene.unshiftPhase(
      new StatStageChangePhase(pokemon.getBattlerIndex(), null, [Stat.SPD], -1, { bypassReflect: true }),
    );
    return --this.turnCount > 0;
  }
}
