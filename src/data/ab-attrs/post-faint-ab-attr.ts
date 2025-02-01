import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export abstract class PostFaintAbAttr extends AbAttr {
  /**
   * Applies an effect after the source Pokemon faints
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param attacker The {@linkcode Pokemon} that caused the source to faint
   * @param move The {@linkcode Move} that caused the source to faint
   * @returns `true` if effects from this attribute successfully apply
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _attacker?: Pokemon, _move?: Move): boolean {
    return false;
  }
}
