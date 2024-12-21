import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

export class LapseBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).lapseTag(tagType);
    }

    return true;
  }
}
