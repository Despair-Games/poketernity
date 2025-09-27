import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrCondition } from "#types/ability-types";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Determines whether a Pokemon is immune to a move because of an ability.
 * @see {@linkcode applyPreDefend}
 * @see {@linkcode getCondition}
 */
export class TypeImmunityAbAttr extends PreDefendAbAttr {
  private readonly immuneType: ElementalType;
  private readonly condition: AbAttrCondition;

  constructor(immuneType: ElementalType, condition: AbAttrCondition = () => true) {
    super();
    this._flags.add(AbAttrFlag.TYPE_IMMUNITY);

    this.immuneType = immuneType;
    this.condition = condition;
  }

  /**
   * Applies immunity if this ability grants immunity to the type of the given move.
   * @param pokemon - The defending {@linkcode Pokemon}
   * @param simulated - N/A
   * @param attacker - The attacking {@linkcode Pokemon}
   * @param move The used {@linkcode Move}
   * @param cancelled N/A
   * @param typeMultiplier {@linkcode NumberHolder} gets set to `0` if the pokemon is immune
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _cancelled: ValueHolder<boolean>,
    typeMultiplier: ValueHolder<number>,
  ): void {
    typeMultiplier.value = 0;
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [pokemon, , attacker, move] = params;
    return attacker !== pokemon && attacker.getMoveType(move) === this.immuneType;
  }

  public override getCondition(): AbAttrCondition {
    return this.condition;
  }
}
