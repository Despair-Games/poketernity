import type { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { DamageProtectedTag } from "#app/data/battler-tags/damage-protected-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";

/**
 * Tag used to block damaging moves and damage the attacker if the move makes contact.
 * Used by {@linkcode MoveId.SPIKY_SHIELD}
 * @extends DamageProtectedTag
 */
export class ContactDamageProtectedTag extends DamageProtectedTag {
  private damageRatio: number;

  constructor(sourceMoveId: MoveId, damageRatio: number) {
    super(sourceMoveId, BattlerTagType.SPIKY_SHIELD);

    this.damageRatio = damageRatio;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.damageRatio = source.damageRatio;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (!super.apply(pokemon, simulated, attacker, move)) {
      return false;
    }

    if (!simulated && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, null)) {
      if (!attacker.hasAbilityWithAttr(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE)) {
        attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio)), {
          result: HitResult.OTHER,
          ignoreDynamaxReduction: true,
        });
      }
    }
    return true;
  }
}
