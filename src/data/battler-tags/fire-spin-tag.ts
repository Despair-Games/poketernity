import { VortexTrapTag } from "#app/data/battler-tags/vortex-trap-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";

export class FireSpinTag extends VortexTrapTag {
  constructor(turnCount: number, sourceId: number) {
    super(BattlerTagType.FIRE_SPIN, CommonAnim.FIRE_SPIN, turnCount, MoveId.FIRE_SPIN, sourceId);
  }
}
