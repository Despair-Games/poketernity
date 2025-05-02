import { DamagingTrapTag } from "#app/data/battler-tags/damaging-trap-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

export class ClampTag extends DamagingTrapTag {
  constructor(turnCount: number, sourceId: number) {
    super(BattlerTagType.CLAMP, CommonAnim.CLAMP, turnCount, MoveId.CLAMP, sourceId);
  }

  override getTrapMessage(pokemon: Pokemon): string {
    return i18next.t("battlerTags:clampOnTrap", {
      sourcePokemonNameWithAffix: getPokemonNameWithAffix(globalScene.getPokemonById(this.sourceId!) ?? undefined), // TODO: is that bang correct?
      pokemonName: getPokemonNameWithAffix(pokemon),
    });
  }
}
