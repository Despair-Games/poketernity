import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

//#region Types

type PokemonDefendCondition = (target: Pokemon, user: Pokemon, move: Move) => boolean;

//#endregion

export class ReceivedMoveDamageMultiplierAbAttr extends PreDefendAbAttr {
  protected readonly condition: PokemonDefendCondition;
  private readonly damageMultiplier: number;

  constructor(condition: PokemonDefendCondition, damageMultiplier: number) {
    super();
    this._flags.add(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER);

    this.condition = condition;
    this.damageMultiplier = damageMultiplier;
  }

  /**
   * @param pokemon - The Pokémon with the ability.
   * @param simulated - If `true` then the game state will not be modified.
   * @param attacker - The attacking Pokémon.
   * @param move - The move being used.
   * @param multiplier - The damage multiplier.
   * @returns `true` if the ability was applied.
   */
  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    multiplier: NumberHolder,
  ): boolean {
    if (this.condition(pokemon, attacker, move)) {
      multiplier.value *= this.damageMultiplier;

      return true;
    }

    return false;
  }
}
