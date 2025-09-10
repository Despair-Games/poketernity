import { LegacyAnimConfig } from "#animations/anim-config";
import { chargeAnims } from "#animations/charge-anims";
import { MoveAnim } from "#animations/move-anim";
import { BattlerIndex, type FieldBattlerIndex } from "#enums/battler-index";
import type { ChargeAnim } from "#enums/charge-anim";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";

export class MoveChargeAnim extends MoveAnim {
  private readonly chargeAnim: ChargeAnim;

  /**
   * **Note:** The default for {@linkcode targetIndex} being {@linkcode BattlerIndex.PLAYER} is due to `MoveChargeAnim` originally not supporting a target argument.
   */
  constructor(
    chargeAnim: ChargeAnim,
    moveId: MoveId,
    user: Pokemon,
    targetIndex: FieldBattlerIndex = BattlerIndex.PLAYER,
  ) {
    super(moveId, user, targetIndex);

    this.chargeAnim = chargeAnim;
  }

  override isOppAnim(): boolean {
    return !this.user?.isPlayer() && Array.isArray(chargeAnims.get(this.chargeAnim));
  }

  override getAnim(): LegacyAnimConfig {
    return chargeAnims.get(this.chargeAnim) instanceof LegacyAnimConfig
      ? (chargeAnims.get(this.chargeAnim) as LegacyAnimConfig)
      : (chargeAnims.get(this.chargeAnim)?.[this.user?.isPlayer() ? 0 : 1] as LegacyAnimConfig);
  }
}
