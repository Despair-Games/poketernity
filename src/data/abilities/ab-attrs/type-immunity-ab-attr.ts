import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrCondition } from "#types/ability-types";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Determines whether a Pokemon is immune to a move because of an ability.
 * @see {@linkcode applyPreDefend}
 * @see {@linkcode getCondition}
 */
export class TypeImmunityAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "TypeImmunityAbAttr";
  private readonly immuneType: ElementalType;
  private readonly condition: AbAttrCondition;

  constructor(immuneType: ElementalType, condition: AbAttrCondition = () => true) {
    super(true);

    this.immuneType = immuneType;
    this.condition = condition;
  }

  /**
   * Applies immunity if this ability grants immunity to the type of the given move.
   * @param pokemon - The defending {@linkcode Pokemon}
   * @param simulated - N/A
   * @param attacker - The attacking {@linkcode Pokemon}
   * @param move - The used {@linkcode Move}
   * @param cancelled - A {@linkcode ValueHolder} which, if set to `true`, suppresses
   * the default "It doesn't affect {Pokemon}" message after the hit check
   * @param typeMultiplier - A {@linkcode ValueHolder} containing the move's running effectiveness
   * multiplier
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    cancelled: ValueHolder<boolean>,
    typeMultiplier: ValueHolder<number>,
  ): void {
    cancelled.value = true;
    typeMultiplier.value = 0;
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [pokemon, , attacker, move] = params;
    return attacker !== pokemon && attacker.getMoveType(move) === this.immuneType;
  }

  /**
   * Type immunity abilities require a trigger message override in order for the ability
   * flyout to display correctly. By default, this is set to the baseline no-effect message
   * ("It doesn't affect {Pokemon}!").
   */
  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string | null {
    return i18next.t("battle:hitResultNoEffect", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }

  public override getCondition(): AbAttrCondition {
    return this.condition;
  }
}
