import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { MoveFlags } from "#enums/move-flags";
import type { StatusEffect } from "#enums/status-effect";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import type { NonEmptyArray } from "#types/utility-types";

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
  private readonly effects: Readonly<NonEmptyArray<StatusEffect>>;

  constructor(chance: number, ...effects: Readonly<NonEmptyArray<StatusEffect>>) {
    super();

    this.chance = chance;
    this.effects = effects;
  }

  public override apply({ pokemon, simulated, attacker }: PostDefendAbAttrParams): void {
    if (simulated) {
      return;
    }

    const status = this.effects.length === 1 ? this.effects[0] : this.effects[pokemon.randSeedInt(this.effects.length)];

    attacker.trySetStatus(status, true, pokemon);
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.hasNonVolatileStatusEffect()
      && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
    );
  }
}
