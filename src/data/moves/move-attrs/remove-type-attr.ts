import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Attribute to remove a set type from the user after the move is used.
 * If the user has no remaining type after removal, this makes the user
 * {@linkcode ElementalType.UNKNOWN | typeless} instead.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Burn_Up_(move) | Burn Up}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Double_Shock_(move) | Double Shock}.
 * @extends MoveEffectAttr
 */
export class RemoveTypeAttr extends MoveEffectAttr {
  private removedType: ElementalType;
  private messageCallback: ((user: Pokemon) => void) | undefined;

  constructor(removedType: ElementalType, messageCallback?: (user: Pokemon) => void) {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
    this.removedType = removedType;
    this.messageCallback = messageCallback;
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    if (user.isTerastallized() && user.getTeraType() === this.removedType) {
      // active tera types cannot be removed
      return false;
    }

    const userTypes = user.getTypes(true);
    const modifiedTypes = userTypes.filter((type) => type !== this.removedType);
    if (modifiedTypes.length === 0) {
      modifiedTypes.push(ElementalType.UNKNOWN);
    }
    user.summonData.types = modifiedTypes;
    user.updateInfo();

    if (this.messageCallback) {
      this.messageCallback(user);
    }

    return true;
  }
}
