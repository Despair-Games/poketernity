import { DamagingTrapTag } from "#app/data/battler-tags/damaging-trap-tag";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { CommonAnim } from "#enums/common-anim";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

export abstract class VortexTrapTag extends DamagingTrapTag {
  constructor(
    tagType: BattlerTagType,
    commonAnim: CommonAnim,
    turnCount: number,
    sourceMoveId: MoveId,
    sourceId: number,
  ) {
    super(tagType, commonAnim, turnCount, sourceMoveId, sourceId);
  }

  override getTrapMessage(pokemon: Pokemon): string {
    return i18next.t("battlerTags:vortexOnTrap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
}
