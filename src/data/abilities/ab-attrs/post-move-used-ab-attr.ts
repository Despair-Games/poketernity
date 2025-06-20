import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattlerIndex } from "#enums/battler-index";
import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";

/**
 * Triggers just after a move is used either by the opponent or the player
 */
export abstract class PostMoveUsedAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_MOVE_USED);
  }

  /**
   * Applies an effect after a move is used by any other Pokemon
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param move The {@linkcode Move} being used
   * @param source The {@linkcode Pokemon} using the move
   * @param targets The targets of the move (by {@linkcode BattlerIndex})
   * @returns `true` if effects successfully apply
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: PokemonMove,
    _source: Pokemon,
    _targets: BattlerIndex[],
  ): boolean {
    return false;
  }
}
