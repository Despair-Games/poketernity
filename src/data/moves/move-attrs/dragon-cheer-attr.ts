import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
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
    const opponent = target.getOpponents()[0];
    /** @todo This is only based on the target's first opponent */
    const maxCritStage = target.getMoveset().reduce((maxStage, mv) => {
      const critStage = opponent?.getCritStage(target, mv.getMove(), true) ?? 0;
      return Math.max(critStage, maxStage);
    }, 0);

    if (maxCritStage >= 4) {
      return 0;
    }

    return (
      this.getRandomScore(user, 50)
      + (targetIsDragon ? MINOR_EFFECT_SCORE_BONUS : 0)
      + (maxCritStage > 0 ? MINOR_EFFECT_SCORE_BONUS : 0)
    );
  }
}
