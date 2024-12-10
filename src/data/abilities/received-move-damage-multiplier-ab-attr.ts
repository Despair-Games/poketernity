import type Pokemon from "#app/field/pokemon";
import { type BooleanHolder, type NumberHolder, toDmgValue } from "#app/utils";
import type Move from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

//#region Types

type PokemonDefendCondition = (target: Pokemon, user: Pokemon, move: Move) => boolean;

//#endregion

export class ReceivedMoveDamageMultiplierAbAttr extends PreDefendAbAttr {
  protected condition: PokemonDefendCondition;
  private damageMultiplier: number;

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
    if (this.condition(pokemon, attacker, move)) {
      (args[0] as NumberHolder).value = toDmgValue((args[0] as NumberHolder).value * this.damageMultiplier);

      return true;
    }

    return false;
  }
}
