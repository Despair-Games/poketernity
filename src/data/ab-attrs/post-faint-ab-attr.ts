import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostFaintAbAttr extends AbAttr {
  /**
   * Applies an effect after the source Pokemon faints
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _attacker The {@linkcode Pokemon} that caused the source to faint
   * @param _move The {@linkcode Move} that caused the source to faint
   * @param _hitResult The {@linkcode HitResult | effectiveness} of the
   * KO-ing move.
   * @returns `true` if effects from this attribute successfully apply
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker?: Pokemon,
    _move?: Move,
    _hitResult?: HitResult,
  ): boolean {
    return false;
  }
}
