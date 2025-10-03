import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { MoveCategory } from "#enums/move-category";
import { NeutralDamageAgainstFlyingTypeMultiplierAttr } from "#moves/neutral-damage-against-flying-type-multiplier-attr";

/**
 * Attribute for {@link https://bulbapedia.bulbagarden.net/wiki/Levitate_(Ability) | Levitate's}
 * type immunity effect. Unlike other immunity-granting abilities, Levitate
 * only applies to attacks.
 */
export class LevitateImmunityAbAttr extends TypeImmunityAbAttr {
  /**
   * In addition to requiring the common conditions of type-immune abilities,
   * Levitate only applies against attack moves (*except for Thousand Arrows*)
   */
  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [pokemon, , attacker, move] = params;

    // this is a hacky way to fix the Levitate/Thousand Arrows interaction, but it works for now...
    return (
      attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS
      && !move.hasAttr(NeutralDamageAgainstFlyingTypeMultiplierAttr)
      && super.canApply(...params)
    );
  }

  // TODO: Add an override for Levitate's trigger message
}
