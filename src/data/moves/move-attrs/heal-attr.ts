import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { RecoveryBoostAbAttr } from "#abilities/recovery-boost-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { NumberHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Heals the user or target by {@linkcode healRatio} depending on the value of {@linkcode selfTarget}
 */
export class HealAttr extends MoveEffectAttr {
  /** The percentage of {@linkcode Stat.HP} to heal */
  private healRatio: number;
  /** Should an animation be shown? */
  private showAnim: boolean;

  constructor(healRatio: number = 1, showAnim: boolean = false, selfTarget: boolean = true) {
    super(selfTarget);

    this.healRatio = healRatio;
    this.showAnim = showAnim;
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    this.addHealPhase(this.selfTarget ? user : target, this.getHealRatio(user, target, move));
    return true;
  }

  /**
   * Helper function to obtain this attribute's heal ratio
   * @returns a heal ratio in the interval [0, 1]
   */
  protected getHealRatio(user: Pokemon, target: Pokemon, move: Move): number {
    const healRatio = new NumberHolder(this.healRatio);
    applyAbAttrs<RecoveryBoostAbAttr>(AbAttrFlag.RECOVERY_BOOST, user, false, move, target, healRatio);
    return healRatio.value;
  }

  /**
   * Creates a new {@linkcode PokemonHealPhase}.
   * This heals the target and shows the appropriate message.
   */
  addHealPhase(target: Pokemon, healRatio: number) {
    globalScene.phaseManager.createAndUnshiftPhase(
      "PokemonHealPhase",
      target.getBattlerIndex(),
      toDmgValue(target.getMaxHp() * healRatio),
      {
        message: i18next.t("moveTriggers:healHp", { pokemonName: getPokemonNameWithAffix(target) }),
        skipAnim: !this.showAnim,
      },
    );
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const score =
      (1 - (this.selfTarget ? user : target).getHpRatio()) * 20 - this.getHealRatio(user, target, move) * 10;
    return Math.round(score / (1 - this.healRatio / 2));
  }
}
