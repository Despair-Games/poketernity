import { AnimConfig } from "#app/data/animations/anim-config";
import { MoveAnim } from "./move-anim";
import { chargeAnims } from "#app/data/animations/charge-anims";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerIndex } from "#enums/battler-index";
import type { ChargeAnim } from "#enums/charge-anim";
import type { MoveId } from "#enums/move-id";

export class MoveChargeAnim extends MoveAnim {
  private chargeAnim: ChargeAnim;

  /**
   * **Note:** The default for {@linkcode targetIndex} being {@linkcode BattlerIndex.PLAYER} is due to `MoveChargeAnim` originally not supporting a target argument.
   */
  constructor(chargeAnim: ChargeAnim, moveId: MoveId, user: Pokemon, targetIndex: BattlerIndex = BattlerIndex.PLAYER) {
    super(moveId, user, targetIndex);

    this.chargeAnim = chargeAnim;
  }

  override isOppAnim(): boolean {
    return !this.user?.isPlayer() && Array.isArray(chargeAnims.get(this.chargeAnim));
  }

  override getAnim(): AnimConfig {
    return chargeAnims.get(this.chargeAnim) instanceof AnimConfig
      ? (chargeAnims.get(this.chargeAnim) as AnimConfig)
      : (chargeAnims.get(this.chargeAnim)?.[this.user?.isPlayer() ? 0 : 1] as AnimConfig);
  }
}
