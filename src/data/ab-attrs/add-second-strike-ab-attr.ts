import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

/**
 * Attribute to convert single-strike moves to two-strike moves.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Parental_Bond_(Ability) | Parental Bond}.
 * @param damageMultiplier the damage multiplier for the second strike, relative to the first.
 * @extends PreAttackAbAttr
 */
export class AddSecondStrikeAbAttr extends PreAttackAbAttr {
  private readonly damageMultiplier: number;

  constructor(damageMultiplier: number) {
    super(false);
    this._flags.add(AbAttrFlag.ADD_SECOND_STRIKE);

    this.damageMultiplier = damageMultiplier;
  }

  /**
   * If conditions are met, this increases the move's hit count (via args[0])
   * or multiplies the damage of secondary strikes (via args[1])
   * @param pokemon the {@linkcode Pokemon} using the move
   * @param simulated if `true`, suppresses changes to game state
   * @param move the {@linkcode Move} used by the ability source
   * @param defender n/a
   * @param hitCount a {@linkcode NumberHolder} containing the number of strikes this move currently has
   * @param multiplier a {@linkcode NumberHolder} containing the damage multiplier for the current strike
   * @returns `true` if the given move is modified by this effect
   */
  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    _defender: Pokemon,
    hitCount?: NumberHolder,
    multiplier?: NumberHolder,
  ): boolean {
    if (move.canBeMultiStrikeEnhanced(pokemon)) {
      this.showAbility = !!hitCount?.value;
      if (hitCount?.value) {
        hitCount.value += 1;
      }

      if (multiplier?.value && pokemon.turnData.hitsLeft === 1) {
        multiplier.value = this.damageMultiplier;
      }
      return true;
    }
    return false;
  }
}
