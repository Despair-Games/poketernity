import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

type ArenaTrapCondition = (user: Pokemon, target: Pokemon) => boolean;

/**
 * Base class for checking if a Pokemon is trapped by arena trap
 * @extends AbAttr
 * @field {@linkcode arenaTrapCondition} Conditional for trapping abilities.
 * For example, Magnet Pull will only activate if opponent is Steel type.
 * @see {@linkcode applyCheckTrapped}
 */
export class CheckTrappedAbAttr extends AbAttr {
  protected readonly arenaTrapCondition: ArenaTrapCondition;
  constructor(condition: ArenaTrapCondition) {
    super(false);
    this.arenaTrapCondition = condition;
  }

  /**
   * Applies an effect when another Pokemon attempts to leave the field.
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _trapped A {@linkcode BooleanHolder} which, if `true`, prevents
   * Pokemon from leaving the field.
   * @param _otherPokemon The {@linkcode Pokemon} attempting to leave the field
   * @returns
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _trapped: BooleanHolder, _otherPokemon: Pokemon): boolean {
    return false;
  }
}
