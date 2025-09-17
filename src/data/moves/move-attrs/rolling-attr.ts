import { MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

export class RollingAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.ROLLING, true);
  }

  /** Grants a {@link MINOR_EFFECT_SCORE_PENALTY | minor penalty} at all times */
  public override getRawEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return MINOR_EFFECT_SCORE_PENALTY;
  }
}
