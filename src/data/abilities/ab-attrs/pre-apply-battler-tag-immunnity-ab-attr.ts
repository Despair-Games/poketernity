import { PreApplyBattlerTagAbAttr } from "#abilities/pre-apply-battler-tag-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTag } from "#battler-tags/battler-tag";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { coerceArray, type BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to specified targets.
 * @extends PreApplyBattlerTagAbAttr
 */
export class PreApplyBattlerTagImmunityAbAttr extends PreApplyBattlerTagAbAttr {
  private readonly immuneTagTypes: BattlerTagType[];
  private battlerTag: BattlerTag;

  constructor(immuneTagTypes: BattlerTagType | BattlerTagType[]) {
    super();

    this.immuneTagTypes = coerceArray(immuneTagTypes);
  }

  public override apply(_pokemon: Pokemon, simulated: boolean, tag: BattlerTag, cancelled: BooleanHolder): boolean {
    if (this.immuneTagTypes.includes(tag.tagType)) {
      cancelled.value = true;
      if (!simulated) {
        this.battlerTag = tag;
      }
      return true;
    }

    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:battlerTagImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      battlerTagName: this.battlerTag.getDescriptor(),
    });
  }
}
