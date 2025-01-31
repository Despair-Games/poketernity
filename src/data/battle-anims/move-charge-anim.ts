import { AnimConfig } from "#app/data/anim-config";
import { MoveAnim } from "./move-anim";
import { chargeAnims } from "#app/data/charge-anims";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerIndex } from "#enums/battler-index";
import type { ChargeAnim } from "#enums/charge-anim";
import type { Moves } from "#enums/moves";

export class MoveChargeAnim extends MoveAnim {
  private chargeAnim: ChargeAnim;

  /**
   * **Note:** The default for {@linkcode targetIndex} being {@linkcode BattlerIndex.PLAYER} is due to `MoveChargeAnim` originally not supporting a target argument.
   */
  constructor(chargeAnim: ChargeAnim, move: Moves, user: Pokemon, targetIndex: BattlerIndex = BattlerIndex.PLAYER) {
    super(move, user, targetIndex);

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
