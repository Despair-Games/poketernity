import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

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

  override apply(
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
