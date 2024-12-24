import type Move from "#app/data/move";
import { MoveFlags } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type { StatusEffect } from "#enums/status-effect";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

/**
 * Ability attribute that inflicts a status on the attacking Pokemon if the attacker used a contact move on the ability holder
+--------------+-----------+----------+
| Ability Name |  Status   | % Chance |
+--------------+-----------+----------+
| Static       | Paralysis |       30 |
| Flame Body   | Burn      |       30 |
| Poison Point | Poison    |       30 |
+--------------+-----------+----------+ 
 */
export class PostDefendContactApplyStatusEffectAbAttr extends PostDefendAbAttr {
  public readonly chance: number;
  private readonly effects: StatusEffect[] = [];

  constructor(chance: number, effects: StatusEffect | StatusEffect[]) {
    super();

    this.chance = chance;
    this.effects = this.effects.concat(effects);
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
        this.effects.length === 1 ? this.effects[0] : this.effects[pokemon.randSeedInt(this.effects.length)];
      if (simulated) {
        return attacker.canSetStatus(status, true, false, pokemon);
      } else {
        return attacker.trySetStatus(status, true, pokemon);
      }
    }

    return false;
  }
}
