import type { BattleStat } from "#enums/stat";
import { getStatKey } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used for status moves, specifically Heart, Guard, and Power Swap,
 * that swaps the user's and target's corresponding stat stages.
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class SwapStatStagesAttr extends MoveEffectAttr {
  /** The stat stages to be swapped between the user and the target */
  private stats: readonly BattleStat[];

  constructor(stats: readonly BattleStat[]) {
    super();

    this.stats = stats;
  }

  /**
   * For all {@linkcode stats}, swaps the user's and target's corresponding stat
   * stage.
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (super.apply(user, target, move)) {
      for (const s of this.stats) {
        const temp = user.getStatStage(s);
        user.setStatStage(s, target.getStatStage(s));
        target.setStatStage(s, temp);
      }

      target.updateInfo();
      user.updateInfo();

      if (this.stats.length === 7) {
        globalScene.queueMessage(
          i18next.t("moveTriggers:switchedStatChanges", { pokemonName: getPokemonNameWithAffix(user) }),
        );
      } else if (this.stats.length === 2) {
        globalScene.queueMessage(
          i18next.t("moveTriggers:switchedTwoStatChanges", {
            pokemonName: getPokemonNameWithAffix(user),
            firstStat: i18next.t(getStatKey(this.stats[0])),
            secondStat: i18next.t(getStatKey(this.stats[1])),
          }),
        );
      }
      return true;
    }
    return false;
  }
}
