import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Salt_Cure_(move) | Salt Cure's}
 * secondary effect. Inflicts 1/8 max HP damage to the target
 * at the end of each turn, or 1/4 max HP damage if the target
 * is Water- or Steel-type.
 * @extends AddBattlerTagAttr
 */
export class SaltCureAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.SALT_CURED);
  }

  /**
   * Grants an 80%(+1) bonus.
   * Also grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} if the target is
   * a Water- or Steel-type Pokemon.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const targetIsWaterOrSteel = [ElementalType.WATER, ElementalType.STEEL].some((t) => target.isOfType(t, true, true));

    return this.getRandomScore(user, 80) + (targetIsWaterOrSteel ? MINOR_EFFECT_SCORE_BONUS : 0);
  }
}
