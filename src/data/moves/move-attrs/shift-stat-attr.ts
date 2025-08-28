import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { EffectiveStat } from "#enums/stat";
import { getStatKey } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute used to switch the user's own stats.
 * Used by Power Shift.
 */
export class ShiftStatAttr extends MoveEffectAttr {
  private statToSwitch: EffectiveStat;
  private statToSwitchWith: EffectiveStat;

  constructor(statToSwitch: EffectiveStat, statToSwitchWith: EffectiveStat) {
    super();

    this.statToSwitch = statToSwitch;
    this.statToSwitchWith = statToSwitchWith;
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const firstStat = user.getStat(this.statToSwitch, false);
    const secondStat = user.getStat(this.statToSwitchWith, false);

    user.setStat(this.statToSwitch, secondStat, false);
    user.setStat(this.statToSwitchWith, firstStat, false);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:shiftedStats", {
        pokemonName: getPokemonNameWithAffix(user),
        statToSwitch: i18next.t(getStatKey(this.statToSwitch)),
        statToSwitchWith: i18next.t(getStatKey(this.statToSwitchWith)),
      }),
    );

    return true;
  }
}
