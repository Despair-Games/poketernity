import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PreDefendAbAttr extends AbAttr {
  /**
   * Applies an effect before the source Pokemon is hit by an attack.
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _attacker The {@linkcode Pokemon} attacking the source Pokemon
   * @param _move The {@linkcode Move} being used
   * @param _args Additional arguments required for the specific effect
   * @returns `true` if effects from this attribute successfully apply
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move | null,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
