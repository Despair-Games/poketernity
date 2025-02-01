import type { Move } from "#app/data/move";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { StatusEffect } from "#enums/status-effect";
import { PostAttackAbAttr } from "./post-attack-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Ability attribute that inflicts a status on a Pokemon that gets hit by the ability user's attacks.
```
+--------------+-------------------------+----------+----------------+
| Ability Name | Only for contact moves? | % Chance | Status         |
+--------------+-------------------------+----------+----------------+
| Poison Touch |                     Yes |       30 | Poisoned       |
| Toxic Chain  |                      No |       30 | Badly Poisoned |
+--------------+-------------------------+----------+----------------+ 
```
Currently, all abilities that use this attribute only inflict one status effect each. 
The code is future-proofed so that it can accept a list of multiple status effects though. 
@extends PostAttackAbAttr
*/
export class PostAttackApplyStatusEffectAbAttr extends PostAttackAbAttr {
  private readonly contactRequired: boolean;
  public readonly chance: number;
  private readonly effects: StatusEffect[];

  constructor(contactRequired: boolean, chance: number, ...effects: StatusEffect[]) {
    super();
    this._flags.add(AbAttrFlag.POST_ATTACK_APPLY_STATUS_EFFECT);

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  override applyPostAttack(attacker: Pokemon, simulated: boolean, target: Pokemon, move: Move): boolean {
    /**
     * The status is only applied to the target if
     * - The target does not have a secondary ability that suppresses move effects
     * - The target is not the attacker
     * - If a contact move is required to activate the ability, the move should make contact
     * - If the target is behind a substitute, the move must be able to bypass the substitute (checked in move-effect-phase.ts)
     * - The game rolls successfully based on the chance
     * - The target is not already statused
     *
     * Note: Status inflicted by abilities post attacking are also considered additional effects of moves.
     */
    if (
      !target.hasAbilityWithAttr(AbAttrFlag.IGNORE_MOVE_EFFECTS)
      && target.id !== attacker.id
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, target))
      && target.randSeedInt(100) < this.chance
      && !target.status
    ) {
      const effect =
        this.effects.length === 1 ? this.effects[0] : this.effects[attacker.randSeedInt(this.effects.length)];
      return simulated || target.trySetStatus(effect, true, attacker);
    }

    return false;
  }
}
