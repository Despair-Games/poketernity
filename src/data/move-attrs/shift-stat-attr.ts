import type { EffectiveStat } from "#enums/stat";
import { getStatKey } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used to switch the user's own stats.
 * Used by Power Shift.
 * @extends MoveEffectAttr
 */
export class ShiftStatAttr extends MoveEffectAttr {
  private statToSwitch: EffectiveStat;
  private statToSwitchWith: EffectiveStat;

  constructor(statToSwitch: EffectiveStat, statToSwitchWith: EffectiveStat) {
    super();

    this.statToSwitch = statToSwitch;
    this.statToSwitchWith = statToSwitchWith;
  }

  /**
   * Switches the user's stats based on the {@linkcode statToSwitch} and {@linkcode statToSwitchWith} attributes.
   * @param user the {@linkcode Pokemon} that used the move
   * @param target n/a
   * @param move n/a
   * @param args n/a
   * @returns whether the effect was applied
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const firstStat = user.getStat(this.statToSwitch, false);
    const secondStat = user.getStat(this.statToSwitchWith, false);

    user.setStat(this.statToSwitch, secondStat, false);
    user.setStat(this.statToSwitchWith, firstStat, false);

    globalScene.queueMessage(
      i18next.t("moveTriggers:shiftedStats", {
        pokemonName: getPokemonNameWithAffix(user),
        statToSwitch: i18next.t(getStatKey(this.statToSwitch)),
        statToSwitchWith: i18next.t(getStatKey(this.statToSwitchWith)),
      }),
    );

    return true;
  }

  /**
   * Encourages the user to use the move if the stat to switch with is greater than the stat to switch.
   * @param user the {@linkcode Pokemon} that used the move
   * @param _target n/a
   * @param _move n/a
   * @returns number of points to add to the user's benefit score
   */
  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    return user.getStat(this.statToSwitchWith, false) > user.getStat(this.statToSwitch, false) ? 10 : 0;
  }
}
