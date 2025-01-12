import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { StatStageAbAttr } from "./stat-stage-ab-attr";

/**
 * Ability attribute that multiplies a Pokemon's stat by a factor
 * Abilities with this attribute:
 ```
+-----------------------+-------+--------+----------------------------------+
|        Ability        | Stat  | Factor |              Notes               |
+-----------------------+-------+--------+----------------------------------+
| Sand Veil             | EVA   |    1.3 | In sandstorm only                |
| Compound Eyes         | ACC   |    1.3 |                                  |
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
| Fur Coat              | DEF   |      2 |                                  |
| Grass Pelt            | DEF   |    1.5 | In grassy terrain only           |
| Surge Surfer          | SPD   |      2 | In electric terrain only         |
| Orichalum Pulse       | ATK   |   1.33 | In sun only                      |
| Hadron Engine         | SPATK |   1.33 | In electric terrain only         |
+-----------------------+-------+--------+----------------------------------+
```
 */
export class StatMultiplierAbAttr extends StatStageAbAttr {
  private readonly multiplier: number;
  private readonly condition?: PokemonAttackCondition;

  constructor(stat: BattleStat, multiplier: number, condition?: PokemonAttackCondition) {
    super(stat);

    this.multiplier = multiplier;
    this.condition = condition;
  }

  override applyStatStage(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    move: Move,
    target?: Pokemon,
  ): boolean {
    if (stat === this.stat && (!this.condition || this.condition(pokemon, target ?? null, move))) {
      statValue.value *= this.multiplier;
      return true;
    }

    return false;
  }
}
