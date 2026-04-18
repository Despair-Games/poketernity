import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { ArenaTrapAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

type ArenaTrapCondition = (user: Pokemon, target: Pokemon) => boolean;

/**
 * Determines whether a Pokemon is blocked from switching/running away
 * because of a trapping ability or move.
 * @remarks
 * Conditions that prevent a Pokemon from being trapped:
 * - If the enemy is a Ghost type
 * - If the enemy has the ability Run Away
 * - If the user has Magnet Pull and the enemy is not a Steel type
 * - If the user has Arena Trap and the enemy is not grounded
 */
export class ArenaTrapAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ArenaTrapAbAttr";

  protected readonly arenaTrapCondition: ArenaTrapCondition;

  constructor(condition: ArenaTrapCondition) {
    super(false);
    this.arenaTrapCondition = condition;
  }

  public override apply({ isTrapped }: ArenaTrapAbAttrParams): void {
    isTrapped.value = true;
  }

  public override canApply({ pokemon, trappedPokemon }: Parameters<this["apply"]>[0]): boolean {
    return (
      this.arenaTrapCondition(pokemon, trappedPokemon)
      && !trappedPokemon.isOfType(ElementalType.GHOST, true, true)
      && !trappedPokemon.hasAbility(AbilityId.RUN_AWAY)
    );
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:arenaTrap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
