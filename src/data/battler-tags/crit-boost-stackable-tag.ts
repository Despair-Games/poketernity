import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * A stackable instance of crit boost granted by G-Max Chi Strike
 */
export class CritBoostStackableTag extends BattlerTag {
  public stackCount: number = 0;

  constructor() {
    super(BattlerTagType.CRIT_BOOST_STACKABLE, BattlerTagLapseType.CUSTOM, 1, MoveId.G_MAX_CHI_STRIKE, undefined);
  }

  override onAdd(pokemon: Pokemon): void {
    this.stackCount += 1;
    // This actually does not have any messages in the mainline games
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:critBoostOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override onOverlap(pokemon: Pokemon): void {
    this.onAdd(pokemon);
  }

  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.stackCount = source.stackCount ?? 0;
  }
}
