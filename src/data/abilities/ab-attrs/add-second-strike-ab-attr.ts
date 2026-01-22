import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { AddSecondStrikeAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Attribute to convert single-strike moves to two-strike moves.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Parental_Bond_(Ability) | Parental Bond (Bulbapedia)}
 */
export class AddSecondStrikeAbAttr extends PreAttackAbAttr {
  protected override readonly abAttrKey = "AddSecondStrikeAbAttr";

  public override apply({ hitCount }: AddSecondStrikeAbAttrParams): void {
    hitCount.value += 1;
  }

  public override canApply({ pokemon, move, defender }: Parameters<this["apply"]>[0]): boolean {
    return move.canBeMultiStrikeEnhanced(pokemon, defender);
  }
}
