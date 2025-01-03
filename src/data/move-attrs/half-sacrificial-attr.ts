import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { type Pokemon, HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, toDmgValue } from "#app/utils";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used for moves which cut the user's Max HP in half.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mind_Blown_(move) Mind Blown}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Steel_Beam_(move) Steel Beam}.
 * @extends MoveEffectAttr
 */
export class HalfSacrificialAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const cancelled = new BooleanHolder(false);
    // Check to see if the Pokemon has an ability that blocks non-direct damage
    applyAbAttrs(BlockNonDirectDamageAbAttr, user, cancelled);
    if (!cancelled.value) {
      user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), HitResult.OTHER, false, true, true);
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
