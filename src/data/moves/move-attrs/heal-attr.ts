import type { RecoveryBoostAbAttr } from "#app/data/abilities/ab-attrs/recovery-boost-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { NumberHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import i18next from "i18next";

/**
 * Heals the user or target by {@linkcode healRatio} depending on the value of {@linkcode selfTarget}
 * @extends MoveEffectAttr
 */
export class HealAttr extends MoveEffectAttr {
  /** The percentage of {@linkcode Stat.HP} to heal */
  private healRatio: number;
  /** Should an animation be shown? */
  private showAnim: boolean;

  constructor(healRatio?: number, showAnim?: boolean, selfTarget?: boolean) {
    super(selfTarget === undefined || selfTarget);

    this.healRatio = healRatio || 1;
    this.showAnim = !!showAnim;
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
    globalScene.phaseManager.queuePokemonHealPhase(
      true,
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
