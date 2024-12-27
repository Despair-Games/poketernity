import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { type BooleanHolder, type NumberHolder, toDmgValue } from "#app/utils";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

//#region Types

type PokemonDefendCondition = (target: Pokemon, user: Pokemon, move: Move) => boolean;

//#endregion

export class ReceivedMoveDamageMultiplierAbAttr extends PreDefendAbAttr {
  protected readonly condition: PokemonDefendCondition;
  private readonly damageMultiplier: number;

  constructor(condition: PokemonDefendCondition, damageMultiplier: number) {
    super();

    this.condition = condition;
    this.damageMultiplier = damageMultiplier;
  }

  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const damage: NumberHolder = args[0];
    if (this.condition(pokemon, attacker, move)) {
      damage.value = toDmgValue(damage.value * this.damageMultiplier);

      return true;
    }

    return false;
  }
}
