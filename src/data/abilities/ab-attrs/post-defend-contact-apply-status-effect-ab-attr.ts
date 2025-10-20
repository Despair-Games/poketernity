import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveFlags } from "#enums/move-flags";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

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

  constructor(chance: number, effects: StatusEffect | StatusEffect[]) {
    super();
    this._flags.add(AbAttrFlag.POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT);

    this.chance = chance;
    this.statusEffects = this.statusEffects.concat(effects);
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): void {
    if (simulated) {
      return;
    }

    const status =
      this.statusEffects.length === 1
        ? this.statusEffects[0]
        : this.statusEffects[pokemon.randSeedInt(this.statusEffects.length)];

    attacker.trySetStatus(status, true, pokemon);
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.hasNonVolatileStatusEffect()
      && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
    );
  }
}
