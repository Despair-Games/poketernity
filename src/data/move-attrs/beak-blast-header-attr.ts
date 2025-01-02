import { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagHeaderAttr } from "#app/data/move-attrs/add-battler-tag-header-attr";
import { ChargeAnim } from "#app/data/battle-anims";

/**
 * Header attribute to implement the "charge phase" of Beak Blast at the
 * beginning of a turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Beak_Blast_(move) Beak Blast}
 * @extends AddBattlerTagHeaderAttr
 * @see {@linkcode BeakBlastChargingTag}
 */
export class BeakBlastHeaderAttr extends AddBattlerTagHeaderAttr {
  /** Required to initialize Beak Blast's charge animation correctly */
  public chargeAnim = ChargeAnim.BEAK_BLAST_CHARGING;

  constructor() {
    super(BattlerTagType.BEAK_BLAST_CHARGING);
  }
}
