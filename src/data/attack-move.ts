import { MoveCategory } from "#app/enums/move-category";
import { MoveTarget } from "#app/enums/move-target";
import type { Moves } from "#app/enums/moves";
import { Stat } from "#app/enums/stat";
import { StatusEffect } from "#app/enums/status-effect";
import { Type } from "#app/enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import { Move, applyMoveAttrs } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";
import { HealStatusEffectAttr } from "#app/data/move-attrs/heal-status-effect-attr";

export class AttackMove extends Move {
  constructor(
    id: Moves,
    type: Type,
    category: MoveCategory,
    power: number,
    accuracy: number,
    pp: number,
    chance: number,
    priority: number,
    generation: number,
  ) {
    super(id, type, category, MoveTarget.NEAR_OTHER, power, accuracy, pp, chance, priority, generation);

    /**
     * {@link https://bulbapedia.bulbagarden.net/wiki/Freeze_(status_condition)}
     * > All damaging Fire-type moves can now thaw a frozen target, regardless of whether or not they have a chance to burn;
     */
    if (this.type === Type.FIRE) {
      this.addAttr(new HealStatusEffectAttr(false, StatusEffect.FREEZE));
    }
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let ret = super.getTargetBenefitScore(user, target, move);

    let attackScore = 0;

    const effectiveness = target.getAttackTypeEffectiveness(this.type, user, undefined, undefined, this);
    attackScore = Math.pow(effectiveness - 1, 2) * effectiveness < 1 ? -2 : 2;
    if (attackScore) {
      if (this.category === MoveCategory.PHYSICAL) {
        const atk = new NumberHolder(user.getEffectiveStat(Stat.ATK, target));
        applyMoveAttrs(VariableAtkAttr, user, target, move, atk);
        if (atk.value > user.getEffectiveStat(Stat.SPATK, target)) {
          const statRatio = user.getEffectiveStat(Stat.SPATK, target) / atk.value;
          if (statRatio <= 0.75) {
            attackScore *= 2;
          } else if (statRatio <= 0.875) {
            attackScore *= 1.5;
          }
        }
      } else {
        const spAtk = new NumberHolder(user.getEffectiveStat(Stat.SPATK, target));
        applyMoveAttrs(VariableAtkAttr, user, target, move, spAtk);
        if (spAtk.value > user.getEffectiveStat(Stat.ATK, target)) {
          const statRatio = user.getEffectiveStat(Stat.ATK, target) / spAtk.value;
          if (statRatio <= 0.75) {
            attackScore *= 2;
          } else if (statRatio <= 0.875) {
            attackScore *= 1.5;
          }
        }
      }

      const power = new NumberHolder(this.power);
      applyMoveAttrs(VariablePowerAttr, user, target, move, power);

      attackScore += Math.floor(power.value / 5);
    }

    ret -= attackScore;

    return ret;
  }
}
