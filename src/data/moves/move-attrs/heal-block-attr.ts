import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Heal_Block_(move) | Heal Block's}
 * effects. Negates all healing on the target(s) and prevents
 * them from selecting or using healing moves.
 * @extends AddBattlerTagAttr
 */
export class HealBlockAttr extends AddBattlerTagAttr {
  constructor(isAttack: boolean = false, turnCount: number = 5) {
    super(BattlerTagType.HEAL_BLOCK, false, {
      failOnOverlap: !isAttack,
      turnCountMin: turnCount,
    });
  }

  /**
   * Grants 40%(+1), with an additional {@link MINOR_EFFECT_SCORE_BONUS | minor bonus}
   * if the target has the ability {@link AbilityId.TRIAGE | Triage}.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const triageBonus = target.hasRevealedAbility(AbilityId.TRIAGE) ? MINOR_EFFECT_SCORE_BONUS : 0;

    return this.getRandomScore(user, 40) + triageBonus;
  }
}
