import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTag } from "#battler-tags/battler-tag";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { PreApplyBattlerTagImmunityAbAttrParams } from "#types/ab-attr-param-types";
import type { NonEmptyArray } from "#types/utility-types";
import i18next from "i18next";

/** Provides immunity to specified {@linkcode BattlerTag}s. */
export abstract class PreApplyBattlerTagImmunityAbAttr extends AbAttr {
  private readonly immuneTagTypes: Readonly<NonEmptyArray<BattlerTagType>>;
  private battlerTag: BattlerTag;

  constructor(...immuneTagTypes: Readonly<NonEmptyArray<BattlerTagType>>) {
    super(true);

    this.immuneTagTypes = immuneTagTypes;
  }

  public override apply({ cancelled }: PreApplyBattlerTagImmunityAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ simulated, battlerTag }: Parameters<this["apply"]>[0]): boolean {
    if (!this.immuneTagTypes.includes(battlerTag.tagType)) {
      return false;
    }
    if (!simulated) {
      this.battlerTag = battlerTag;
    }
    return true;
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:battlerTagImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      battlerTagName: this.battlerTag.getDescriptor(),
    });
  }
}
