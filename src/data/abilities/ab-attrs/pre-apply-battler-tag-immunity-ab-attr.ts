import { PreApplyBattlerTagAbAttr } from "#abilities/pre-apply-battler-tag-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTag } from "#battler-tags/battler-tag";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to specified targets.
 */
export abstract class PreApplyBattlerTagImmunityAbAttr extends PreApplyBattlerTagAbAttr {
  private readonly immuneTagTypes: readonly BattlerTagType[];
  private battlerTag: BattlerTag;

  constructor(...immuneTagTypes: readonly BattlerTagType[]) {
    super(true);

    this.immuneTagTypes = immuneTagTypes;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _tag: BattlerTag,
    cancelled: ValueHolder<boolean>,
  ): void {
    cancelled.value = true;
  }

  public override canApply(...[, simulated, tag]: Parameters<this["apply"]>): boolean {
    if (this.immuneTagTypes.includes(tag.tagType)) {
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
