import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { DamagingTrapTag } from "#battler-tags/damaging-trap-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

export class InfestationTag extends DamagingTrapTag {
  constructor(turnCount: number, sourceId: number) {
    super(BattlerTagType.INFESTATION, CommonAnim.INFESTATION, turnCount, MoveId.INFESTATION, sourceId);
  }

  override getTrapMessage(pokemon: Pokemon): string {
    return i18next.t("battlerTags:infestationOnTrap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      sourcePokemonNameWithAffix: getPokemonNameWithAffix(globalScene.getPokemonById(this.sourceId!) ?? undefined), // TODO: is that bang correct?
    });
  }
}
