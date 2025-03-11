import { type Pokemon } from "#app/field/pokemon";
import { HitResult } from "#enums/hit-result";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue } from "#app/utils";
import i18next from "i18next";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Recoil | recoil damage} to the user.
 * @extends MoveEffectAttr
 */
export class RecoilAttr extends MoveEffectAttr {
  private useHp: boolean;
  private damageRatio: number;
  private unblockable: boolean;

  constructor(useHp: boolean = false, damageRatio: number = 0.25, unblockable: boolean = false) {
    super(true, { lastHitOnly: true });

    this.useHp = useHp;
    this.damageRatio = damageRatio;
    this.unblockable = unblockable;
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const cancelled = new BooleanHolder(false);
    if (!this.unblockable) {
      applyAbAttrs(AbAttrFlag.BLOCK_RECOIL_DAMAGE, user, false, cancelled);
      applyAbAttrs(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, user, false, cancelled);
    }

    if (cancelled.value) {
      return false;
    }

    const damageValue = (!this.useHp ? user.turnData.totalDamageDealt : user.getMaxHp()) * this.damageRatio;
    const minValue = user.turnData.totalDamageDealt ? 1 : 0;
    const recoilDamage = toDmgValue(damageValue, minValue);
    if (!recoilDamage) {
      return false;
    }

    if (cancelled.value) {
      return false;
    }

    user.damageAndUpdate(recoilDamage, HitResult.OTHER, false, true, true);
    globalScene.queueMessage(i18next.t("moveTriggers:hitWithRecoil", { pokemonName: getPokemonNameWithAffix(user) }));
    user.turnData.damageTaken += recoilDamage;

    return true;
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, move: Move): number {
    return Math.floor(move.power / 5 / -4);
  }
}
