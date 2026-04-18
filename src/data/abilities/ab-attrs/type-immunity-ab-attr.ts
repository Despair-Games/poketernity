import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { ElementalType } from "#enums/elemental-type";
import type { TypeImmunityAbAttrParams } from "#types/ab-attr-param-types";
import type { AbAttrCondition } from "#types/ability-types";
import i18next from "i18next";

/** Determines whether a Pokemon is immune to a move because of an ability. */
export class TypeImmunityAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "TypeImmunityAbAttr";

  private readonly immuneType: ElementalType;
  private readonly condition: AbAttrCondition;

  constructor(immuneType: ElementalType, condition: AbAttrCondition = () => true) {
    super(true);

    this.immuneType = immuneType;
    this.condition = condition;
  }

  public override apply({ cancelled, typeMultiplier }: TypeImmunityAbAttrParams): void {
    cancelled.value = true;
    typeMultiplier.value = 0;
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return attacker !== pokemon && attacker.getMoveType(move) === this.immuneType;
  }

  /**
   * Type immunity abilities require a trigger message override in order for the ability flyout to display correctly. \
   * By default, this is set to the baseline no-effect message ("It doesn't affect {Pokemon}!").
   */
  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], _abilityName: string): string | null {
    return i18next.t("battle:hitResultNoEffect", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }

  public override getCondition(): AbAttrCondition {
    return this.condition;
  }
}
