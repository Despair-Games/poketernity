import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Pokemon from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type Move from "../move";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

/**
 * Class for abilities that boost the damage of moves
 * For abilities that boost the base power of moves, see VariableMovePowerAbAttr
 * @param damageMultiplier the amount to multiply the damage by
 * @param condition the condition for this ability to be applied
 */
export class DamageBoostAbAttr extends PreAttackAbAttr {
  private damageMultiplier: number;
  private condition: PokemonAttackCondition;

  constructor(damageMultiplier: number, condition: PokemonAttackCondition) {
    super(true);
    this.damageMultiplier = damageMultiplier;
    this.condition = condition;
  }

  /**
   *
   * @param pokemon the attacker pokemon
   * @param _passive N/A
   * @param defender the target pokemon
   * @param move the move used by the attacker pokemon
   * @param args Utils.NumberHolder as damage
   * @returns true if the function succeeds
   */
  override applyPreAttack(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    defender: Pokemon,
    move: Move,
    args: any[],
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      const power = args[0] as NumberHolder;
      power.value = Math.floor(power.value * this.damageMultiplier);
      return true;
    }

    return false;
  }
}
