import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ALLY_EFFECTIVE_STAT_OPTIONS, OPP_EFFECTIVE_STAT_OPTIONS } from "#constants/ai-constants";
import type { EffectiveStat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to temporarily set certain stats of the user and target to the average between the two.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Power_Split_(move) | Power Split}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Guard_Split_(move) | Guard Split}.
 */
export class AverageStatsAttr extends MoveEffectAttr {
  /** The stats to be averaged individually between the user and the target */
  private stats: readonly EffectiveStat[];
  /** The key to a localized message to show after the effect applies */
  private msgKey: string;

  constructor(stats: readonly EffectiveStat[], msgKey: string) {
    super();

    this.stats = stats;
    this.msgKey = msgKey;
  }

  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    for (const s of this.stats) {
      const avg = Math.floor((user.getStat(s, false) + target.getStat(s, false)) / 2);

      user.setStat(s, avg, false);
      target.setStat(s, avg, false);
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(this.msgKey, { pokemonName: getPokemonNameWithAffix(user) }),
    );

    return true;
  }

  /**
   * @returns A bonus that scales with the number of {@linkcode stats} where the user is
   * expected to benefit from this attribute's effect against the target.
   *
   * @privateRemarks
   * All moves that use this attribute (namely Power/Guard Split) only affect two stats,
   * so the score from this attribute cannot exceed (+2).
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const benefitStats = this.stats.filter(
      (stat) =>
        user.getEffectiveStat(stat, ALLY_EFFECTIVE_STAT_OPTIONS)
        < target.getEffectiveStat(stat, OPP_EFFECTIVE_STAT_OPTIONS),
    ).length;

    return this.getRandomScore(user, 55, benefitStats, benefitStats - 1);
  }
}
