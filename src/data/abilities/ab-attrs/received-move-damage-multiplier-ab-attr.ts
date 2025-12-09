import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

//#region Types

type PokemonDefendCondition = (target: Pokemon, user: Pokemon, move: Move) => boolean;

//#endregion

export class ReceivedMoveDamageMultiplierAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "ReceivedMoveDamageMultiplierAbAttr";
  protected readonly condition: PokemonDefendCondition;
  private readonly damageMultiplier: number;

  constructor(condition: PokemonDefendCondition, damageMultiplier: number, showAbility: boolean = false) {
    super(showAbility);

    this.condition = condition;
    this.damageMultiplier = damageMultiplier;
  }

  /**
   * @param pokemon - The Pokémon with the ability.
   * @param simulated - If `true` then the game state will not be modified.
   * @param attacker - The attacking Pokémon.
   * @param move - The move being used.
   * @param multiplier - The damage multiplier.
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    multiplier: ValueHolder<number>,
  ): void {
    multiplier.value *= this.damageMultiplier;
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, attacker, move);
  }
}
