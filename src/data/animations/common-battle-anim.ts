import type { AnimConfig } from "#app/data/animations/anim-config";
import { BattleAnim } from "./battle-anims";
import { commonAnims } from "#app/data/animations/common-anims";
import type { Pokemon } from "#app/field/pokemon";
import type { CommonAnim } from "#enums/common-anim";

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

  getAnim(): AnimConfig | null {
    return this.commonAnim ? (commonAnims.get(this.commonAnim) ?? null) : null;
  }

  isOppAnim(): boolean {
    return false;
  }
}
