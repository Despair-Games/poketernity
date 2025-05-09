import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import { ModifiedDamageAttr } from "#moves/modified-damage-attr";
import type { Move } from "#moves/move";

/**
 * Attribute for moves that deal no damage to Flying-type Pokemon.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Sky_Drop_(move) | Sky Drop}
 */
export class NoDamageAgainstFlyingAttr extends ModifiedDamageAttr {
  override getModifiedDamage(_user: Pokemon, target: Pokemon, _move: Move, damage: number): number {
    return target.isOfType(ElementalType.FLYING, true, true) ? 0 : damage;
  }
}
