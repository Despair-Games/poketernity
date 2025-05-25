import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import { HighCritAttr } from "#moves/high-crit-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Dragon_Cheer_(move) | Dragon Cheer's}
 * effect. Increases the target's critical hit ratio by 1 stage,
 * or 2 stages if the target is Dragon-type.
 * @extends AddBattlerTagAttr
 */
export class DragonCheerAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.DRAGON_CHEER, false, { failOnOverlap: true });
  }

  /**
   * Grants a 55%(+1) bonus.
   * Also grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} if the target is Dragon-type.
   * Also grants a minor bonus if the target has a move with an increased critical hit ratio.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const targetIsDragon = target.isOfType(ElementalType.DRAGON, true, true);
    const targetHasHighCrit = target.getAttackMoves(true).some((mv) => mv.hasAttr(HighCritAttr));

    return (
      this.getRandomScore(user, 55)
      + (targetIsDragon ? MINOR_EFFECT_SCORE_BONUS : 0)
      + (targetHasHighCrit ? MINOR_EFFECT_SCORE_BONUS : 0)
    );
  }
}
