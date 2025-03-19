import type { AnimConfig } from "#app/data/animations/anim-config";
import { BattleAnim } from "./battle-anims";
import { commonAnims } from "#app/data/animations/common-anims";
import type { Pokemon } from "#app/field/pokemon";
import type { CommonAnim } from "#enums/common-anim";

export class CommonBattleAnim extends BattleAnim {
  public commonAnim: CommonAnim | null;

  constructor(commonAnim: CommonAnim | null, user: Pokemon, target?: Pokemon, playOnEmptyField: boolean = false) {
    super(user, target || user, playOnEmptyField);

    this.commonAnim = commonAnim;
  }

  getAnim(): AnimConfig | null {
    return this.commonAnim ? (commonAnims.get(this.commonAnim) ?? null) : null;
  }

  isOppAnim(): boolean {
    return false;
  }
}
