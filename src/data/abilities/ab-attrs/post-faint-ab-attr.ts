import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export abstract class PostFaintAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostFaintAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect after the source Pokemon faints
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param attacker The {@linkcode Pokemon} that caused the source to faint
   * @param move The {@linkcode Move} that caused the source to faint
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean, _attacker?: Pokemon, _move?: Move): void;
}
