import type { Pokemon } from "#app/field/pokemon";
import { Type } from "#enums/type";
import type { Move } from "../move";
import { ModifiedDamageAttr } from "./modified-damage-attr";

/**
 * Attribute for moves that deal no damage to Flying-type Pokemon.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Sky_Drop_(move) | Sky Drop}
 */
export class NoDamageAgainstFlyingAttr extends ModifiedDamageAttr {
  override getModifiedDamage(_user: Pokemon, target: Pokemon, _move: Move, damage: number): number {
    return target.isOfType(Type.FLYING, true, true) ? 0 : damage;
  }
}
