import type { LegacyAnimConfig } from "#animations/anim-config";
import { BattleAnim } from "#animations/battle-anims";
import { commonAnims } from "#animations/common-anims";
import type { CommonAnim } from "#enums/common-anim";
import type { Pokemon } from "#field/pokemon";

/**
 * Animation for common battle effects that are (usually)
 * tied to a specific {@linkcode Pokemon}.
 * @extends BattleAnim
 * @todo Make `user` optional, or add a new subclass for
 * animations that don't require a "user" (e.g. weather animations)
 */
export class CommonBattleAnim extends BattleAnim {
  /** The {@linkcode CommonAnim} to play */
  public commonAnim: CommonAnim;

  constructor(commonAnim: CommonAnim, user: Pokemon, target?: Pokemon, playOnEmptyField: boolean = false) {
    super(user, target ?? user, playOnEmptyField);

    this.commonAnim = commonAnim;
  }

  getAnim(): LegacyAnimConfig | null {
    return this.commonAnim ? (commonAnims.get(this.commonAnim) ?? null) : null;
  }

  isOppAnim(): boolean {
    return false;
  }
}
