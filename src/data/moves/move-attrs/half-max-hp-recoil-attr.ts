import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HitResult } from "#enums/hit-result";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { toDmgValue, ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute used for moves which cut the user's Max HP in half.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Mind_Blown_(move) | Mind Blown (Bulbapedia)}
 * @see {@linkcode https://bulbapedia.bulbagarden.net/wiki/Steel_Beam_(move) | Steel Beam (Bulbapedia)}
 */
export class HalfMaxHpRecoilAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const cancelled = new ValueHolder(false);
    applyAbAttrs("BlockNonDirectDamageAbAttr", { pokemon: user, simulated: false, cancelled });
    if (cancelled.value) {
      return true;
    }

    user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), {
      result: HitResult.OTHER,
      ignoreSegments: true,
      preventEndure: true,
    });
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:cutHpPowerUpMove", { pokemonName: getPokemonNameWithAffix(user) }),
    );

    return true;
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    if (user.boss) {
      return -10;
    }
    return Math.ceil(
      ((1 - user.getHpRatio() / 2) * 10 - 10) * (target.getAttackTypeEffectiveness(move.type, user) - 0.5),
    );
  }
}
