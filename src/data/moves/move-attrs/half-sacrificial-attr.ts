import type { BlockNonDirectDamageAbAttr } from "#app/data/abilities/ab-attrs/block-non-direct-damage-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import i18next from "i18next";

/**
 * Attribute used for moves which cut the user's Max HP in half.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mind_Blown_(move) | Mind Blown}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Steel_Beam_(move) | Steel Beam}.
 * @extends MoveEffectAttr
 */
export class HalfSacrificialAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const cancelled = new BooleanHolder(false);
    // Check to see if the Pokemon has an ability that blocks non-direct damage
    applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, user, false, cancelled);
    if (!cancelled.value) {
      user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), {
        result: HitResult.OTHER,
        ignoreSegments: true,
        preventEndure: true,
        ignoreDynamaxReduction: true,
      });
      globalScene.queueMessage(
        i18next.t("moveTriggers:cutHpPowerUpMove", { pokemonName: getPokemonNameWithAffix(user) }),
      ); // Queue recoil message
    }
    return true;
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    if (user.isBoss()) {
      return -10;
    }
    return Math.ceil(
      ((1 - user.getHpRatio() / 2) * 10 - 10) * (target.getAttackTypeEffectiveness(move.type, user) - 0.5),
    );
  }
}
