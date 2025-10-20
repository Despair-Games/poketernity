import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat, EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute that multiplies one of the source Pokemon's
 * {@linkcode EffectiveStat | EffectiveStats} by a factor.
 * 
 * Abilities with this attribute:
 ```
+-----------------------+-------+--------+----------------------------------+
|        Ability        | Stat  | Factor |              Notes               |
+-----------------------+-------+--------+----------------------------------+
| Huge Power/Pure Power | ATK   |      2 |                                  |
| Hustle                | ATK   |    1.5 |                                  |
|                       | ACC   |    0.8 | Applies to Physical moves only   |
| Plus                  | SPATK |    1.5 | Needs ally with Minus            |
| Minus                 | SPATK |    1.5 | Needs ally with Plus             |
| Guts                  | ATK   |    1.5 | Needs to have non-vol. status    |
| Marvel Scale          | DEF   |    1.5 | Needs to have non-vol. status    |
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
export class EffectiveStatMultiplier extends AbAttr {
  protected stat: EffectiveStat;
  protected readonly multiplier: number;
  protected readonly condition: PokemonAttackCondition;

  constructor(stat: EffectiveStat, multiplier: number, condition: PokemonAttackCondition = () => true) {
    super();
    this._flags.add(AbAttrFlag.EFFECTIVE_STAT_MULTIPLIER);

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
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _stat: BattleStat,
    statValue: ValueHolder<number>,
    _move?: Move,
    _target?: Pokemon,
  ): void {
    statValue.value *= this.multiplier;
  }

  public override canApply(...[pokemon, , stat, , move, target]: Parameters<this["apply"]>): boolean {
    return stat === this.stat && this.condition(pokemon, target, move);
  }
}
