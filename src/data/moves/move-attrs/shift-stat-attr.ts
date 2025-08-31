import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { MoveCategory } from "#enums/move-category";
import type { EffectiveStat } from "#enums/stat";
import { getStatKey, Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute used to switch the user's own stats.
 * Used by Power Shift.
 */
export class ShiftStatAttr extends MoveEffectAttr {
  private statsToSwitch: [EffectiveStat, EffectiveStat];

  constructor(...statsToSwitch: [EffectiveStat, EffectiveStat]) {
    super(true);

    this.statsToSwitch = statsToSwitch;
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const postShiftStatValues = this.statsToSwitch.map((stat) => user.getStat(stat, false)).reverse();
    this.statsToSwitch.forEach((stat, i) => user.setStat(stat, postShiftStatValues[i], false));

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:shiftedStats", {
        pokemonName: getPokemonNameWithAffix(user),
        statToSwitch: i18next.t(getStatKey(this.statsToSwitch[0])),
        statToSwitchWith: i18next.t(getStatKey(this.statsToSwitch[1])),
      }),
    );

    return true;
  }

  /**
   * @returns A {@linkcode MINOR_EFFECT_SCORE_BONUS} if all of the below conditions apply:
   * - At least one of the shifted stats is an offensive stat (Attack or Sp. Atk)
   * - The user does not have a move whose category matches the shifted offensive stat
   * - The offensive stat is greater than the other shifted stat on the user
   *
   * If no offensive stats are shifted, this grants (+0). If any of the other conditions
   * do not apply, this grants a {@linkcode MINOR_EFFECT_SCORE_PENALTY}.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const offensiveStatToShiftIndex = this.statsToSwitch.findIndex((stat) => [Stat.ATK, Stat.SPATK].includes(stat));
    if (offensiveStatToShiftIndex === -1) {
      return 0;
    }
    const offensiveStat = this.statsToSwitch[offensiveStatToShiftIndex];
    const otherStat = this.statsToSwitch[offensiveStatToShiftIndex ? 0 : 1];
    const matchingCategory = offensiveStat === Stat.ATK ? MoveCategory.PHYSICAL : MoveCategory.SPECIAL;

    const userHasMatchingMove = user
      .getMoveset()
      .some((mv) => user.getMoveCategory(user.getOpponents()[0], mv.getMove()) === matchingCategory);

    if (offensiveStat > otherStat && !userHasMatchingMove) {
      return MINOR_EFFECT_SCORE_BONUS;
    }

    return MINOR_EFFECT_SCORE_PENALTY;
  }
}
