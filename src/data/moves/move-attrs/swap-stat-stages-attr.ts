import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { getStatKey } from "#utils/i18n-utils";
import i18next from "i18next";

/**
 * Attribute used for status moves, specifically Heart, Guard, and Power Swap,
 * that swaps the user's and target's corresponding stat stages.
 * @see {@linkcode apply}
 */
export class SwapStatStagesAttr extends MoveEffectAttr {
  /** The stat stages to be swapped between the user and the target */
  private readonly stats: readonly BattleStat[];

  constructor(stats: readonly BattleStat[]) {
    super();

    this.stats = stats;
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    for (const s of this.stats) {
      const temp = user.getStatStage(s);
      user.setStatStage(s, target.getStatStage(s));
      target.setStatStage(s, temp);
    }

    target.updateInfo();
    user.updateInfo();

    if (this.stats.length === 7) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("moveTriggers:switchedStatChanges", { pokemonName: getPokemonNameWithAffix(user) }),
      );
    } else if (this.stats.length === 2) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("moveTriggers:switchedTwoStatChanges", {
          pokemonName: getPokemonNameWithAffix(user),
          firstStat: i18next.t(getStatKey(this.stats[0])),
          secondStat: i18next.t(getStatKey(this.stats[1])),
        }),
      );
    }
    return true;
  }
}
