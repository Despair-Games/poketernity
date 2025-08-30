import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BAD_MOVE_PENALTY, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BATTLE_STATS, type BattleStat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to copy the target's stat stages onto the user.
 * This also copies critical hit stages from Focus Energy or Lansat Berries.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Psych_Up_(move) | Psych Up}.
 */
export class CopyStatsAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    for (const s of BATTLE_STATS) {
      user.setStatStage(s, target.getStatStage(s));
    }

    if (target.hasTag(BattlerTagType.CRIT_BOOST)) {
      user.addTag(BattlerTagType.CRIT_BOOST, 0, move.id);
    } else {
      user.removeTag(BattlerTagType.CRIT_BOOST);
    }
    target.updateInfo();
    user.updateInfo();
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:copiedStatChanges", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }

  /**
   * @returns (+1) for every `2` stat stages the user would gain from this effect against the given
   * target. If the projected gain is 0 or less, this grants a {@linkcode BAD_MOVE_PENALTY} instead.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const totalStatGain = BATTLE_STATS.reduce(
      (total, stat) => total + this.getProjectedStatGain(user, target, stat),
      0,
    );

    if (totalStatGain <= 0) {
      return BAD_MOVE_PENALTY;
    }

    return Math.min(Math.floor(totalStatGain * 0.5), SOFT_EFFECT_SCORE_LIMIT);
  }

  /** This effect treats allies in the same way as opponents */
  public override getAllyTargetScore(user: EnemyPokemon, target: EnemyPokemon, move: Move): number {
    return this.getEffectScore(user, target, move);
  }

  /**
   * @param user - The {@linkcode EnemyPokemon} evaluating this effect
   * @param target - The {@linkcode Pokemon} this effect is evaluated against
   * @param stat - The {@linkcode BattleStat} for which the stat stage gain is calculated
   * @returns The number of stat stages the given user gains in the given stat when this
   * attribute's effect is applied to the target
   */
  private getProjectedStatGain(user: EnemyPokemon, target: Pokemon, stat: BattleStat) {
    return target.getStatStage(stat) - user.getStatStage(stat);
  }
}
