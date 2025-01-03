import { type Pokemon, HitResult, MoveResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue } from "#app/utils";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import { BlockRecoilDamageAttr } from "#app/data/ab-attrs/block-recoil-damage-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Recoil recoil damage} to the user.
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

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const cancelled = new BooleanHolder(false);
    if (!this.unblockable) {
      applyAbAttrs(BlockRecoilDamageAttr, user, cancelled);
      applyAbAttrs(BlockNonDirectDamageAbAttr, user, cancelled);
    }

    if (cancelled.value) {
      return false;
    }

    // Chloroblast and Struggle should not deal recoil damage if the move was not successful
    if (this.useHp && [MoveResult.FAIL, MoveResult.MISS].includes(user.getLastXMoves(1)[0]?.result)) {
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
