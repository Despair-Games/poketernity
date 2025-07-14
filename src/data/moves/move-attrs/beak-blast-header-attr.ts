import { BattlerTagType } from "#enums/battler-tag-type";
import { ChargeAnim } from "#enums/charge-anim";
import { AddBattlerTagHeaderAttr } from "#moves/add-battler-tag-header-attr";

/**
 * Header attribute to implement the "charge phase" of Beak Blast at the beginning of a turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Beak_Blast_(move) | Beak Blast}
 * @see {@linkcode BeakBlastChargingTag}
 */
export class BeakBlastHeaderAttr extends AddBattlerTagHeaderAttr {
  /** Required to initialize Beak Blast's charge animation correctly */
  public chargeAnim = ChargeAnim.BEAK_BLAST_CHARGING;

  constructor() {
    super(BattlerTagType.BEAK_BLAST_CHARGING);
  }
}
