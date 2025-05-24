import { MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Glaive_Rush_(move) | Glaive Rush's}
 * secondary effect. Causes attacks against the user to deal double damage
 * and bypass accuracy checks to always hit until the user uses another move.
 * @extends AddBattlerTagAttr
 */
export class GlaiveRushAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.GLAIVE_RUSH, true, {
      lastHitOnly: true,
      appliesScoreOnKO: true,
    });
  }

  /**
   * Grants a 30%(-1) penalty.
   * Also grants a {@link MINOR_EFFECT_SCORE_PENALTY | minor penalty} if the user is a Boss.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return -this.getRandomScore(user, 30) + (user.isBoss() ? MINOR_EFFECT_SCORE_PENALTY : 0);
  }
}
