import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { BATTLE_STATS } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to invert the target's stat stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Topsy-Turvy_(move) | Topsy-Turvy}.
 */
export class InvertStatsAttr extends MoveEffectAttr {
  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    for (const s of BATTLE_STATS) {
      target.setStatStage(s, -target.getStatStage(s));
    }

    target.updateInfo();
    user.updateInfo();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:invertStats", { pokemonName: getPokemonNameWithAffix(target) }),
    );

    return true;
  }

  /**
   * @returns an Effect Score modifier equal to the effective stat stages gained from this effect
   * multiplied by {@linkcode MINOR_EFFECT_SCORE_PENALTY}. This modifier cannot exceed the {@linkcode SOFT_EFFECT_SCORE_LIMIT}.
   */
  public override getEffectScore(_user: EnemyPokemon, target: Pokemon, _move: Move): number {
    return Math.min(this.getProjectedStatChange(target) * MINOR_EFFECT_SCORE_PENALTY, SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * @returns an Effect Score modifier equal to the effective stat stages gained from this effect
   * multiplied by {@linkcode MINOR_EFFECT_SCORE_BONUS}. This modifier cannot exceed the {@linkcode SOFT_EFFECT_SCORE_LIMIT}.
   */
  public override getAllyTargetScore(_user: EnemyPokemon, target: EnemyPokemon, _move: Move): number {
    return Math.min(this.getProjectedStatChange(target) * MINOR_EFFECT_SCORE_BONUS, SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * @param target - The {@linkcode Pokemon} on which this effect is evaluated
   * @returns The effective change (in number of stat stages) this attribute's effect is expected
   * to apply to the given target
   */
  private getProjectedStatChange(target: Pokemon): number {
    return BATTLE_STATS.reduce((total, stat) => total + target.getStatStage(stat) * -2, 0);
  }
}
