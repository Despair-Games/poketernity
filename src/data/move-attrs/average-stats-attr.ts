import type { EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used for status moves, namely Power Split and Guard Split,
 * that take the average of a user's and target's corresponding
 * stats and assign that average back to each corresponding stat.
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class AverageStatsAttr extends MoveEffectAttr {
  /** The stats to be averaged individually between the user and the target */
  private stats: readonly EffectiveStat[];
  private msgKey: string;

  constructor(stats: readonly EffectiveStat[], msgKey: string) {
    super();

    this.stats = stats;
    this.msgKey = msgKey;
  }

  /**
   * Takes the average of the user's and target's corresponding {@linkcode stat}
   * values and sets those stats to the corresponding average for both
   * temporarily.
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (super.apply(user, target, move)) {
      for (const s of this.stats) {
        const avg = Math.floor((user.getStat(s, false) + target.getStat(s, false)) / 2);

        user.setStat(s, avg, false);
        target.setStat(s, avg, false);
      }

      globalScene.queueMessage(i18next.t(this.msgKey, { pokemonName: getPokemonNameWithAffix(user) }));

      return true;
    }
    return false;
  }
}
