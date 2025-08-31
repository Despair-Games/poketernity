import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BAD_MOVE_PENALTY, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { BATTLE_STATS } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to reset the stat stages of a single Pokemon
 * (e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Clear_Smog_(move) | Clear Smog})
 * or all Pokemon on the field
 * (e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Haze_(move) | Haze}).
 */
export class ResetStatsAttr extends MoveEffectAttr {
  /** Should this attribute reset the stat stages of *all* Pokemon on the field? */
  private targetAllPokemon: boolean;
  constructor(targetAllPokemon: boolean) {
    super();
    this.targetAllPokemon = targetAllPokemon;
  }

  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    if (this.targetAllPokemon) {
      // Target all pokemon on the field when Freezy Frost or Haze are used
      const activePokemon = globalScene.getField(true);
      activePokemon.forEach((p) => this.resetStats(p));
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("moveTriggers:statEliminated"));
    } else {
      // Affects only the single target when Clear Smog is used
      this.resetStats(target);
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("moveTriggers:resetStats", { pokemonName: getPokemonNameWithAffix(target) }),
      );
    }
    return true;
  }

  private resetStats(pokemon: Pokemon): void {
    for (const s of BATTLE_STATS) {
      pokemon.setStatStage(s, 0);
    }
    pokemon.updateInfo();
  }

  /**
   * @returns An Effect Score modifier based on the effective stat stage changes for all
   * affected allies and opponents as a result of this move action. This effect is rewarded
   * when affected opponents have positive stat stages and/or allies have negative stat stages.
   * This also grants a {@linkcode BAD_MOVE_PENALTY} when the net stat stage change does not
   * favor the user's side of the field.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    const affectedPokemon = this.targetAllPokemon ? globalScene.getField(true) : [target];

    const uncappedScore = affectedPokemon.reduce((total, p) => total + this.getIndividualEffectScore(user, p), 0);
    if (uncappedScore <= 0 && move.isStatusMove()) {
      return BAD_MOVE_PENALTY;
    }
    return Math.min(uncappedScore, SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * @param user - The {@linkcode EnemyPokemon} evaluating this attribute's effect
   * @param target - The {@linkcode Pokemon} this effect is evaluated against
   * @returns The Effect Score bonus or penalty for resetting the given target's current stat stages. This
   * score scales with the target's current stat stage for each stat. If the target is an opponent to the user,
   * this grants (+0.5) times the combined number of stat stages across all {@linkcode BATTLE_STATS}. This scoring
   * logic is inverted for ally targets (including the user itself).
   */
  private getIndividualEffectScore(user: EnemyPokemon, target: Pokemon): number {
    const scoreMultiplier = target.isOpponent(user) ? 0.5 : -0.5;

    return Math.floor(BATTLE_STATS.reduce((total, stat) => total + target.getStatStage(stat) * scoreMultiplier, 0));
  }
}
