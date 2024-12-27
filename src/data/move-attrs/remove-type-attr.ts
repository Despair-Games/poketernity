import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class RemoveTypeAttr extends MoveEffectAttr {
  private removedType: Type;
  private messageCallback: ((user: Pokemon) => void) | undefined;

  constructor(removedType: Type, messageCallback?: (user: Pokemon) => void) {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
    this.removedType = removedType;
    this.messageCallback = messageCallback;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (user.isTerastallized() && user.getTeraType() === this.removedType) {
      // active tera types cannot be removed
      return false;
    }

    const userTypes = user.getTypes(true);
    const modifiedTypes = userTypes.filter((type) => type !== this.removedType);
    if (modifiedTypes.length === 0) {
      modifiedTypes.push(Type.UNKNOWN);
    }
    user.summonData.types = modifiedTypes;
    user.updateInfo();

    if (this.messageCallback) {
      this.messageCallback(user);
    }

    return true;
  }
}
