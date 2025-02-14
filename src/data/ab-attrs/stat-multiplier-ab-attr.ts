import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
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
export class StatMultiplierAbAttr extends AbAttr {
  protected stat: BattleStat;
  protected readonly multiplier: number;
  protected readonly condition?: PokemonAttackCondition;

  constructor(stat: BattleStat, multiplier: number, condition?: PokemonAttackCondition) {
    super();
    this._flags.add(AbAttrFlag.STAT_MULTIPLIER);

    this.stat = stat;
    this.multiplier = multiplier;
    this.condition = condition;
  }

  /**
   * Applies a multiplier to a given stat on the source if conditions are met.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param stat The {@linkcode BattleStat} being evaluated
   * @param statValue A {@linkcode NumberHolder} containing the value of the evaluated stat
   * @param move The {@linkcode Move} being used at the time of evaluation
   * @param target The {@linkcode Pokemon} targeted by the move
   * @returns `true` if this attribute's multiplier applies to the evaluated stat
   */
  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    move?: Move,
    target?: Pokemon,
  ): boolean {
    if (stat === this.stat && (!this.condition || this.condition(pokemon, target, move))) {
      statValue.value *= this.multiplier;
      return true;
    }

    return false;
  }
}
