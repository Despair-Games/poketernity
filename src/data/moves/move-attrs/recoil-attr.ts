import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import type { BlockRecoilDamageAbAttr } from "#abilities/block-recoil-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { RECOIL_DAMAGE_PREVENTION_ABILITIES } from "#constants/ability-constants";
import { ATTACK_SCORE_HP_THRESHOLD, BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Recoil | recoil damage} to the user.
 */
export class RecoilAttr extends MoveEffectAttr {
  private readonly useHp: boolean;
  private readonly damageRatio: number;
  private readonly unblockable: boolean;

  constructor(useHp: boolean = false, damageRatio: number = 0.25, unblockable: boolean = false) {
    super(true, { lastHitOnly: true });

    this.useHp = useHp;
    this.damageRatio = damageRatio;
    this.unblockable = unblockable;
  }

  public override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const cancelled = new BooleanHolder(false);
    if (!this.unblockable) {
      applyAbAttrs<BlockRecoilDamageAbAttr>(AbAttrFlag.BLOCK_RECOIL_DAMAGE, user, false, cancelled);
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, user, false, cancelled);
    }

    if (cancelled.value) {
      return false;
    }

    const damageValue = (this.useHp ? user.getMaxHp() : user.turnData.totalDamageDealt) * this.damageRatio;
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

  /**
   * @returns An Effect Score penalty that reflects the Attack Score given for
   * dealing the estimated recoil damage to the user.
   * - If the user has an ability that prevents recoil damage, this grants (+0).
   * - Otherwise, estimate the damage dealt to the user from this effect
   *   - If the user is expected to faint from this effect,
   *   grant a {@linkcode BAD_MOVE_PENALTY}
   *   - Otherwise, the penalty from this effect is roughly equal to the EAS
   *   for the estimated damage dealt to the user, inverted and rounded to the
   *   nearest integer. If the user is a Boss Pokemon, this penalty is doubled.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (RECOIL_DAMAGE_PREVENTION_ABILITIES.some((abId) => user.hasAbility(abId))) {
      return 0;
    }

    const approxSelfDamage = toDmgValue(
      user.getExpectedAttackScore(target, move)
        * (ATTACK_SCORE_HP_THRESHOLD / 100)
        * target.getMaxHp()
        * this.damageRatio,
    );

    if (approxSelfDamage > user.hp) {
      return BAD_MOVE_PENALTY;
    }

    const selfDamagePenalty = ((-approxSelfDamage / user.getMaxHp()) * 100) / ATTACK_SCORE_HP_THRESHOLD;
    return Math.round(selfDamagePenalty) * (user.isBoss() ? 2 : 1);
  }
}
