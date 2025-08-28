import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { RecoveryBoostAbAttr } from "#abilities/recovery-boost-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
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
  private addHealPhase(target: Pokemon, healRatio: number): void {
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

  /**
   * @returns An Effect Score modifier for the given move action as follows:
   * - If the target is an opponent to the user, grant double the {@linkcode BAD_MOVE_PENALTY}
   * - Otherwise, grant a bonus as defined in {@linkcode getAllyTargetScore}
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, move: Move): number {
    if (this.selfTarget) {
      return this.getAllyTargetScore(user, user, move);
    }

    return 2 * BAD_MOVE_PENALTY;
  }

  /**
   * Obtains the Effect Score bonus for healing an allied Pokemon with this effect:
   * - If the target is afflicted with Heal Block, grants a {@linkcode BAD_MOVE_PENALTY}
   * - Otherwise, check the following conditions:
   *   - Any opposing Pokemon is faster than the user
   *   - The target's missing HP ratio is greater than or equal to this effect's heal ratio
   *
   *   If either of the above conditions are met, grant (+1) + C(+1), where the chance C is equal to
   *   this effect's heal ratio.
   * @param user - The {@linkcode Pokemon} evaluating the move
   * @param target - The {@linkcode Pokemon} the move is evaluated against. This is assumed to be either the user or its ally.
   * @param move - The {@linkcode Move} being evaluated
   * @returns The ES for using the given move against the given target
   */
  public override getAllyTargetScore(user: EnemyPokemon, target: EnemyPokemon, move: Move): number {
    if (target.hasTag(BattlerTagType.HEAL_BLOCK) || target.isFullHp()) {
      return BAD_MOVE_PENALTY;
    }

    /** `true` if at least one opponent outspeeds the user */
    const opponentOutspeeds = user.getOpponents().some((opp) => !user.outspeeds(opp, true));
    const healRatio = this.getHealRatio(user, target, move);

    if (opponentOutspeeds || 1 - target.getHpRatio() >= healRatio) {
      return this.getRandomScore(user, healRatio * 100, 2, 1);
    }

    return 0;
  }
}
