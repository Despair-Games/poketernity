import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveResult } from "#enums/move-result";
import { Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import type { MoveCondition } from "#moves/move-condition";
import { ProtectCondition } from "#moves/protect-condition";

/**
 * Attribute to apply a set type of protection to the user.
 *
 * Moves with this attribute have an increased chance of failing after
 * consecutive uses:
 *
 * | Uses **\|** | Success Rate |
 * |:-----------:|:------------:|
 * |     0       |      1       |
 * |     1       |    1/3       |
 * |     2       |    1/9       |
 * |     3       |   1/27       |
 * |     4       |    ...       |
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Protect | Variations of Protect}
 */
export class ProtectAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType = BattlerTagType.PROTECTED) {
    super(tagType, true);
  }

  public override getCondition(): MoveCondition {
    return new ProtectCondition();
  }

  /**
   * The Effect Score bonus from this effect consists of 3 components, and only applies
   * if the user did not use a "protection" move successfully last turn:
   * - A flat {@link MINOR_EFFECT_SCORE_BONUS | minor bonus}
   * - A 15%(+1) bonus. The chance is increased to 100% if the user has an {@link synergyAbilities | ability}
   * that synergizes with self-protection.
   * - A chance-based (+1) bonus. The chance varies based on the type of protection applied.
   * @see {@linkcode getTagEffectScore}
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const userLastMove = user.getLastXMoves(-1).find((turnMove) => !turnMove.virtual);
    if (userLastMove?.move.hasAttr(ProtectAttr) && userLastMove.result === MoveResult.SUCCESS) {
      return 0;
    }

    const synergyAbilities = [AbilityId.MOODY, AbilityId.SPEED_BOOST, AbilityId.STANCE_CHANGE];
    const synergyBonusChance = synergyAbilities.some((abId) => user.hasAbility(abId)) ? 100 : 15;
    const synergyBonus = this.getRandomScore(user, synergyBonusChance);

    return MINOR_EFFECT_SCORE_BONUS + synergyBonus + this.getTagEffectScore(user);
  }

  /**
   * Calculates the Effect Score bonus from this attribute's tag type.
   * @param user - The {@linkcode EnemyPokemon} evaluating the move
   * @returns Either (+0) or (+1) randomly. The chance of returning (+1) is determined
   * by the number of {@linkcode Stat.ATK | Attack}-leaning opponents and the tag type's
   * {@linkcode getTagBonusChanceIncrement | chance modifier}.
   */
  private getTagEffectScore(user: EnemyPokemon): number {
    const numPhysicalOpponents = user
      .getOpponents()
      .filter((opp) => opp.getEffectiveStat(Stat.ATK) > opp.getEffectiveStat(Stat.SPATK)).length;

    const tagBonusChance = numPhysicalOpponents * this.getTagBonusChanceIncrement();
    return this.getRandomScore(user, Math.min(tagBonusChance, 100));
  }

  private getTagBonusChanceIncrement() {
    switch (this.tagType) {
      case BattlerTagType.SPIKY_SHIELD:
        return 35;
      case BattlerTagType.BANEFUL_BUNKER:
        return 45;
      case BattlerTagType.SILK_TRAP:
        return 50;
      case BattlerTagType.KINGS_SHIELD:
      case BattlerTagType.BURNING_BULWARK:
      case BattlerTagType.OBSTRUCT:
        return 60;
      default:
        return 0;
    }
  }
}
