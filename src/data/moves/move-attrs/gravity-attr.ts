import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { AddArenaTagAttr } from "#moves/move-attrs/add-arena-tag-attr";
import { OneHitKOAttr } from "#moves/move-attrs/one-hit-ko-attr";
import { isBetween } from "#utils/common-utils";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Gravity_(move) | Gravity}.
 * Causes all Pokemon on the field to become {@link Pokemon.isGrounded | "grounded"}
 * for 5 turns. This also increases the accuracy of all non-OHKO moves by 1.67x.
 * @extends AddArenaTagAttr
 */
export class GravityAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.GRAVITY, ArenaTagRelativeSide.ALL, { turnCount: 5, failOnOverlap: true });
  }

  /**
   * Grants 60%(+1) for each ally that knows a move that is either Ground-type or
   * has a base accuracy of less than 80%.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    /**
     * @returns `true` if the given {@linkcode Pokemon} has a move that is either Ground-type
     * when used by the Pokemon or has less than 80 base accuracy.
     */
    const hasBenefitMove = (pokemon: Pokemon) => {
      return pokemon
        .getMoveset()
        .map((pmv) => pmv.getMove())
        .some(
          (mv) =>
            (!mv.hasAttr(OneHitKOAttr) && isBetween(mv.accuracy, 0, 79))
            || pokemon.getMoveType(mv) === ElementalType.GROUND,
        );
    };

    const benefittingAllies = user.getField().filter((p) => p.isActive(true) && hasBenefitMove(p));

    return benefittingAllies.map(() => this.getRandomScore(user, 60)).reduce((total, score) => total + score, 0);
  }
}
