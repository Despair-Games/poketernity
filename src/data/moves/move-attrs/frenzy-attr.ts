import { MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to put the user into a "frenzy", locking them into
 * using the same move against a random enemy for 1-2 additional turns.
 * @extends AddBattlerTagAttr
 */
export class FrenzyAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.FRENZY, true, {
      turnCountMin: 2,
      turnCountMax: 3,
      appliesScoreOnKO: true,
    });
  }

  /** Grants a {@link MINOR_EFFECT_SCORE_PENALTY | minor penalty} at all times */
  public override getRawEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return MINOR_EFFECT_SCORE_PENALTY;
  }
}
