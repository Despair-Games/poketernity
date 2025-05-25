import { MAJOR_EFFECT_SCORE_PENALTY, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to add a "recharging" turn after the move is used.
 * @extends AddBattlerTagAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Hyper_Beam | Variations of Hyper Beam}
 */
export class RechargeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.RECHARGING, true, {
      turnCountMin: 1,
      lastHitOnly: true,
      appliesScoreOnKO: true,
    });
  }

  /**
   * Has a 60% chance to grant a {@link MAJOR_EFFECT_SCORE_PENALTY | major penalty}.
   * Otherwise, grants a {@link MINOR_EFFECT_SCORE_PENALTY | minor penalty}
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return this.getRandomScore(user, 40, MINOR_EFFECT_SCORE_PENALTY, MAJOR_EFFECT_SCORE_PENALTY);
  }
}
