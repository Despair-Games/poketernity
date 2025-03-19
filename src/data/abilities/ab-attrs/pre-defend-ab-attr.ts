import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export abstract class PreDefendAbAttr extends AbAttr {
  /**
   * Applies an effect before the source Pokemon is hit by an attack.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param attacker The {@linkcode Pokemon} attacking the source Pokemon
   * @param move The {@linkcode Move} being used
   * @param args Additional arguments required for the specific effect
   * @returns `true` if effects from this attribute successfully apply
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move?: Move,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
