import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import type { BlockRecoilDamageAbAttr } from "#abilities/block-recoil-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Recoil | recoil damage} to the user.
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
      applyAbAttrs<BlockRecoilDamageAbAttr>(AbAttrFlag.BLOCK_RECOIL_DAMAGE, user, false, cancelled);
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, user, false, cancelled);
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

    user.damageAndUpdate(recoilDamage, {
      result: HitResult.OTHER,
      ignoreSegments: true,
      preventEndure: true,
    });
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:hitWithRecoil", { pokemonName: getPokemonNameWithAffix(user) }),
    );

    return true;
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, move: Move): number {
    return Math.floor(move.power / 5 / -4);
  }
}
