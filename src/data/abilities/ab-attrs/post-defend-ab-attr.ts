import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrKey } from "#types/ability-types";

export abstract class PostDefendAbAttr extends AbAttr {
  protected override readonly abAttrKey: AbAttrKey = "PostDefendAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect after being affected by another Pokemon's move.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param attacker The {@linkcode Pokemon} using the move
   * @param move The {@linkcode Move} being used
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean, _attacker: Pokemon, _move: Move): void;
}
