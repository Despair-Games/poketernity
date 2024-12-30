import { type EffectiveStat, Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { CommandedTag } from "#app/data/battler-tags";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute implementing the stat boosting effect of {@link https://bulbapedia.bulbagarden.net/wiki/Order_Up_(move) | Order Up}.
 * If the user has a Pokemon with {@link https://bulbapedia.bulbagarden.net/wiki/Commander_(Ability) | Commander} in their mouth,
 * one of the user's stats are increased by 1 stage, depending on the "commanding" Pokemon's form. This effect does not respect
 * effect chance, but Order Up itself may be boosted by Sheer Force.
 */

export class OrderUpStatBoostAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const commandedTag = user.getTag(CommandedTag);
    if (!commandedTag) {
      return false;
    }

    let increasedStat: EffectiveStat = Stat.ATK;
    switch (commandedTag.tatsugiriFormKey) {
      case "curly":
        increasedStat = Stat.ATK;
        break;
      case "droopy":
        increasedStat = Stat.DEF;
        break;
      case "stretchy":
        increasedStat = Stat.SPD;
        break;
    }

    globalScene.unshiftPhase(new StatStageChangePhase(user.getBattlerIndex(), this.selfTarget, [increasedStat], 1));
    return true;
  }
}
