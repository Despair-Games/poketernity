import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Psycho_Shift_(move) | Psycho Shift}'s effect.
 * Passes the user's status effect onto the target, then heals the user.
 */
export class PsychoShiftEffectAttr extends MoveEffectAttr {
  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const statusToApply = user.getStatusEffect();

    if (!statusToApply) {
      return false;
    }

    if (target.hasNonVolatileStatusEffect()) {
      return false;
    }
    const canSetStatus = target.canSetStatus(statusToApply, true, false, user);
    const trySetStatus = canSetStatus ? target.trySetStatus(statusToApply, true, user) : false;

    if (trySetStatus && user.hasNonVolatileStatusEffect()) {
      // PsychoShiftTag is added to the user if move succeeds so that the user is healed of its status effect after its move
      user.addTag(BattlerTagType.PSYCHO_SHIFT);
    }

    return trySetStatus;
  }

  /**
   * @returns An Effect Score based on the {@linkcode StatusEffect} that would be transferred
   * to the target when using this move.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const statusToApply = user.getStatusEffect();
    if (!target.canSetStatus(statusToApply, true, false, user)) {
      return BAD_MOVE_PENALTY;
    }

    return this.getStatusEffectScore(user, target, statusToApply);
  }

  /**
   * @returns The Effect Score given for transferring the given {@linkcode effect}
   * from the {@linkcode user} to the {@linkcode target}:
   * - Poison and Toxic Poison grant (+2)/(+3) respectively.
   * - Paralysis grants (+2) if the user outspeeds the target, and (+3) otherwise.
   * - Burn grants (+3) if the target has a physical affinity (ATK > SPATK), and (+2) otherwise.
   * - Sleep and Freeze grant a {@linkcode BAD_MOVE_PENALTY}. Psycho Shift can't normally be used
   * while the user is under these status effects.
   */
  private getStatusEffectScore(user: EnemyPokemon, target: Pokemon, effect: StatusEffect): number {
    switch (effect) {
      case StatusEffect.POISON:
        return 2;
      case StatusEffect.TOXIC:
        return 3;
      case StatusEffect.PARALYSIS:
        return user.outspeeds(target, true) ? 2 : 3;
      case StatusEffect.BURN: {
        const effectiveStatOptions = {
          abilityApplyMode: AbilityApplyMode.REVEALED,
          simulated: true,
        };
        return target.getEffectiveStat(Stat.ATK, effectiveStatOptions)
          > target.getEffectiveStat(Stat.SPATK, effectiveStatOptions)
          ? 3
          : 2;
      }
      case StatusEffect.SLEEP:
      case StatusEffect.FREEZE:
        return BAD_MOVE_PENALTY;
      default:
        // This will cause a type error if more status effects are added in the future,
        // ensuring they are not forgotten to be accounted for.
        effect satisfies StatusEffect.NONE;
        return 0;
    }
  }
}
