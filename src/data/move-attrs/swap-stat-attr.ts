import { type EffectiveStat, getStatKey } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used for status moves, namely Speed Swap,
 * that swaps the user's and target's corresponding stats.
 * @extends MoveEffectAttr
 */
export class SwapStatAttr extends MoveEffectAttr {
  /** The stat to be swapped between the user and the target */
  private stat: EffectiveStat;

  constructor(stat: EffectiveStat) {
    super();

    this.stat = stat;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (super.apply(user, target, move)) {
      const temp = user.getStat(this.stat, false);
      user.setStat(this.stat, target.getStat(this.stat, false), false);
      target.setStat(this.stat, temp, false);

      globalScene.queueMessage(
        i18next.t("moveTriggers:switchedStat", {
          pokemonName: getPokemonNameWithAffix(user),
          stat: i18next.t(getStatKey(this.stat)),
        }),
      );

      return true;
    }
    return false;
  }
}
