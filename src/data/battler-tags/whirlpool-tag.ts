import { VortexTrapTag } from "#app/data/battler-tags/vortex-trap-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";

export class WhirlpoolTag extends VortexTrapTag {
  constructor(turnCount: number, sourceId: number) {
    super(BattlerTagType.WHIRLPOOL, CommonAnim.WHIRLPOOL, turnCount, MoveId.WHIRLPOOL, sourceId);
  }
}
