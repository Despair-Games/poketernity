import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

//#region Types

type ArenaTrapCondition = (user: Pokemon, target: Pokemon) => boolean;

//#endregion

/**
 * Base class for checking if a Pokemon is trapped by arena trap
 * @extends AbAttr
 * @field {@linkcode arenaTrapCondition} Conditional for trapping abilities.
 * For example, Magnet Pull will only activate if opponent is Steel type.
 * @see {@linkcode applyCheckTrapped}
 */
export class CheckTrappedAbAttr extends AbAttr {
  protected arenaTrapCondition: ArenaTrapCondition;
  constructor(condition: ArenaTrapCondition) {
    super(false);
    this.arenaTrapCondition = condition;
  }

  applyCheckTrapped(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _trapped: BooleanHolder,
    _otherPokemon: Pokemon,
    _args: any[],
  ): boolean {
    return false;
  }
}
