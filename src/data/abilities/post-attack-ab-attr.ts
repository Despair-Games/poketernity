import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type Move from "../move";
import { MoveCategory } from "../move";
import { AbAttr } from "./ab-attr";

export class PostAttackAbAttr extends AbAttr {
  private attackCondition: PokemonAttackCondition;

  /** The default attackCondition requires that the selected move is a damaging move */
  constructor(
    attackCondition: PokemonAttackCondition = (_user, _target, move) => move.category !== MoveCategory.STATUS,
    showAbility: boolean = true,
  ) {
    super(showAbility);

    this.attackCondition = attackCondition;
  }

  /**
   * Please override {@link applyPostAttackAfterMoveTypeCheck} instead of this method. By default, this method checks that the move used is a damaging attack before
   * applying the effect of any inherited class. This can be changed by providing a different {@link attackCondition} to the constructor. See {@link ConfusionOnStatusEffectAbAttr}
   * for an example of an effect that does not require a damaging move.
   */
  applyPostAttack(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    hitResult: HitResult | null,
    args: any[],
  ): boolean {
    // When attackRequired is true, we require the move to be an attack move and to deal damage before checking secondary requirements.
    // If attackRequired is false, we always defer to the secondary requirements.
    if (this.attackCondition(pokemon, defender, move)) {
      return this.applyPostAttackAfterMoveTypeCheck(pokemon, passive, simulated, defender, move, hitResult, args);
    } else {
      return false;
    }
  }

  /**
   * This method is only called after {@link applyPostAttack} has already been applied. Use this for handling checks specific to the ability in question.
   */
  applyPostAttackAfterMoveTypeCheck(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    _hitResult: HitResult | null,
    _args: any[],
  ): boolean {
    return false;
  }
}
