import { MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/No_Retreat_(move) | No Retreat's}
 * self-trapping effect.
 * @extends AddBattlerTagAttr
 */
export class NoRetreatAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.NO_RETREAT, true);
  }

  /** Grants a {@link MINOR_EFFECT_SCORE_PENALTY | minor penalty} if the user isn't already trapped. */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return user.isTrapped() ? 0 : MINOR_EFFECT_SCORE_PENALTY;
  }
}
