import type { Move } from "#app/data/move";
import { MoveFlags } from "../../enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type { StatusEffect } from "#enums/status-effect";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

/**
 * Ability attribute that inflicts a status on the attacking Pokemon if the attacker used a contact move on the ability holder
```
+--------------+-----------+----------+
| Ability Name |  Status   | % Chance |
+--------------+-----------+----------+
| Static       | Paralysis |       30 |
| Flame Body   | Burn      |       30 |
| Poison Point | Poison    |       30 |
+--------------+-----------+----------+ 
```
Currently, all abilities that use this attribute only inflict one status effect each. 
The code is future-proofed so that it can accept a list of multiple status effects though. 
*/
export class PostDefendContactApplyStatusEffectAbAttr extends PostDefendAbAttr {
  public readonly chance: number;
  private readonly statusEffects: StatusEffect[] = [];

  /**
   * PostDefendContactApplyStatusEffectAbAttr takes an activation chance and a status effect/list of status effects that should be applied following a passing roll.
   * @param chance a percentage chance of the ability attribute's activation
   * @param effects the status effect(s) to be applied to the attacker
   */
  constructor(chance: number, effects: StatusEffect | StatusEffect[]) {
    super();

    this.chance = chance;
    this.statusEffects = this.statusEffects.concat(effects);
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.status
      && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
    ) {
      const status =
        this.statusEffects.length === 1
          ? this.statusEffects[0]
          : this.statusEffects[pokemon.randSeedInt(this.statusEffects.length)];
      if (simulated) {
        return attacker.canSetStatus(status, true, false, pokemon);
      } else {
        return attacker.trySetStatus(status, true, pokemon);
      }
    }

    return false;
  }
}
