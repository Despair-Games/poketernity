import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export abstract class PostKnockOutAbAttr extends AbAttr {
  /**
   * Applies an effect after a Pokemon other than the source faints
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param knockedOutPokemon The {@linkcode Pokemon} that fainted
   * @returns `true` if effects successfully applied
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _knockedOutPokemon: Pokemon): boolean {
    return false;
  }
}
