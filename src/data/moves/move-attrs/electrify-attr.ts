import { ELECTRIC_IMMUNE_ABILITIES } from "#constants/ability-constants";
import {
  MAJOR_EFFECT_SCORE_BONUS,
  MAJOR_EFFECT_SCORE_PENALTY,
  MINOR_EFFECT_SCORE_PENALTY,
} from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Electrify_(move) | Electrify's}
 * effect. Converts the target's moves to Electric-type for the rest of the turn.
 * @extends AddBattlerTagAttr
 */
export class ElectrifyAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.ELECTRIFIED, false, { failOnOverlap: true });
  }

  /**
   * Grants:
   * - A {@link MAJOR_EFFECT_SCORE_PENALTY | major penalty} if the target is faster than the user
   * - 60%(+2) if the user or its ally has an immunity to Electric-type moves, either
   * from its typing or Ability, and the above condition doesn't apply.
   * - A {@link MINOR_EFFECT_SCORE_PENALTY | minor penalty} if none of the above
   * conditions apply
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (!user.outspeeds(target, true)) {
      return MAJOR_EFFECT_SCORE_PENALTY;
    }

    const allyHasElectricImmunity = user
      .getField()
      .some(
        (p) =>
          p.getAttackTypeEffectiveness(ElementalType.ELECTRIC, target) === 0
          || ELECTRIC_IMMUNE_ABILITIES.some((abId) => p.hasAbility(abId)),
      );

    return allyHasElectricImmunity
      ? this.getRandomScore(user, 60, MAJOR_EFFECT_SCORE_BONUS)
      : MINOR_EFFECT_SCORE_PENALTY;
  }
}
