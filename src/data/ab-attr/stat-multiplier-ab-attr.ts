import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Pokemon from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import type Move from "../move";
import { AbAttr } from "./ab-attr";

export class StatMultiplierAbAttr extends AbAttr {
  private stat: BattleStat;
  private multiplier: number;
  private condition: PokemonAttackCondition | null;

  constructor(stat: BattleStat, multiplier: number, condition?: PokemonAttackCondition) {
    super(false);

    this.stat = stat;
    this.multiplier = multiplier;
    this.condition = condition ?? null;
  }

  applyStatStage(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    args: any[],
  ): boolean {
    const move = args[0] as Move;
    if (stat === this.stat && (!this.condition || this.condition(pokemon, null, move))) {
      statValue.value *= this.multiplier;
      return true;
    }

    return false;
  }
}
