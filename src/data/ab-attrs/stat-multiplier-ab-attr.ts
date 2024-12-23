import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

/**
 * Ability attribute that multiplies a Pokemon's stat by a factor
 * Abilities with this attribute:
 ```
+-----------------------+-------+--------+----------------------------------+
|        Ability        | Stat  | Factor |              Notes               |
+-----------------------+-------+--------+----------------------------------+
| Sand Veil             | EVA   |    1.3 | In sandstorm only                |
| Compound Eyes         | ACC   |    1.3 |                                  |
| Swift Swim            | SPD   |      2 | In rain only                     |
| Chlorophyll           | SPD   |      2 | In sun only                      |
| Huge Power/Pure Power | ATK   |      2 |                                  |
| Hustle                | ATK   |    1.5 |                                  |
|                       | ACC   |    0.8 | Applies to Physical moves only   |
| Plus                  | SPATK |    1.5 | Needs ally with Minus            |
| Minus                 | SPATK |    1.5 | Needs ally with Plus             |
| Guts                  | ATK   |    1.5 | Needs to have status             |
| Marvel Scale          | DEF   |    1.5 | Needs to have status             |
| Tangled Feet          | EVA   |      2 | Needs to be confused             |
| Snow Cloak            | EVA   |    1.2 | In snow/hail only                |
| Solar Power           | SPATK |    1.5 | In sun only                      |
| Quick Feet            | SPD   |      2 | Needs to have status             |
| Flower Gift           | ATK   |    1.5 | In sun only                      |
|                       | SPDEF |    1.5 |                                  |
| Defeatist             | ATK   |    0.5 | Needs to be at less than half HP |
|                       | SPATK |    0.5 |                                  |
| Sand Rush             | SPD   |      2 | In sandstorm only                |
| Grass Pelt            | DEF   |    1.5 | In grassy terrain only           |
| Slush Rush            | SPD   |      2 | In snow/hail only                |
| Surge Surfer          | SPD   |      2 | In electric terrain only         |
| Orichalum Pulse       | ATK   |   1.33 | In sun only                      |
| Hadron Engine         | SPATK |   1.33 | In electric terrain only         |
+-----------------------+-------+--------+----------------------------------+
```
 */
export class StatMultiplierAbAttr extends AbAttr {
  private readonly stat: BattleStat;
  private readonly multiplier: number;
  private readonly condition?: PokemonAttackCondition;

  constructor(stat: BattleStat, multiplier: number, condition?: PokemonAttackCondition) {
    super(false);

    this.stat = stat;
    this.multiplier = multiplier;
    this.condition = condition;
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
