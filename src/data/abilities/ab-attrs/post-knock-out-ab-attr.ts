import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";

export abstract class PostKnockOutAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostKnockOutAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect after a Pokemon other than the source faints
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param knockedOutPokemon The {@linkcode Pokemon} that fainted
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, _knockedOutPokemon: Pokemon): void {}
}
