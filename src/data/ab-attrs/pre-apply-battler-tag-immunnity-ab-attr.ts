import type { BattlerTag } from "#app/data/battler-tags";
import type Pokemon from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import type { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";
import { PreApplyBattlerTagAbAttr } from "./pre-apply-battler-tag-ab-attr";

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to specified targets.
 * @extends PreApplyBattlerTagAbAttr
 */
export class PreApplyBattlerTagImmunityAbAttr extends PreApplyBattlerTagAbAttr {
  private immuneTagTypes: BattlerTagType[];
  private battlerTag: BattlerTag;

  constructor(immuneTagTypes: BattlerTagType | BattlerTagType[]) {
    super();

    this.immuneTagTypes = Array.isArray(immuneTagTypes) ? immuneTagTypes : [immuneTagTypes];
  }

  override applyPreApplyBattlerTag(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    tag: BattlerTag,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (this.immuneTagTypes.includes(tag.tagType)) {
      cancelled.value = true;
      if (!simulated) {
        this.battlerTag = tag;
      }
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:battlerTagImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      battlerTagName: this.battlerTag.getDescriptor(),
    });
  }
}
