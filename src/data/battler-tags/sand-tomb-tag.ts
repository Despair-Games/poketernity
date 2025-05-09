import { getPokemonNameWithAffix } from "#app/messages";
import { DamagingTrapTag } from "#battler-tags/damaging-trap-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

export class SandTombTag extends DamagingTrapTag {
  constructor(turnCount: number, sourceId: number) {
    super(BattlerTagType.SAND_TOMB, CommonAnim.SAND_TOMB, turnCount, MoveId.SAND_TOMB, sourceId);
  }

  override getTrapMessage(pokemon: Pokemon): string {
    return i18next.t("battlerTags:sandTombOnTrap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: this.getMoveName(),
    });
  }
}
