import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { MoveFlags } from "#enums/move-flags";
import type { StatusEffect } from "#enums/status-effect";
import type { PostAttackAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Ability attribute that inflicts a status on a Pokemon that gets hit by the ability user's attacks.
 * ```
 * +--------------+-------------------------+----------+----------------+
 * | Ability Name | Only for contact moves? | % Chance | Status         |
 * +--------------+-------------------------+----------+----------------+
 * | Poison Touch |            Yes          |    30    | Poisoned       |
 * | Toxic Chain  |            No           |    30    | Badly Poisoned |
 * +--------------+-------------------------+----------+----------------+
 * ```
 * Currently, all abilities that use this attribute only inflict one status effect each. \
 * The code is future-proofed so that it can accept a list of multiple status effects though.
 */
export class PostAttackApplyStatusEffectAbAttr extends PostAttackAbAttr {
  private readonly contactRequired: boolean;
  public readonly chance: number;
  // TODO: use `NonEmptyArray`
  private readonly effects: StatusEffect[];

  constructor(contactRequired: boolean, chance: number, ...effects: StatusEffect[]) {
    super();

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  public override apply({ pokemon, simulated, defender }: PostAttackAbAttrParams): void {
    if (simulated) {
      return;
    }

    const effect = this.effects.length === 1 ? this.effects[0] : this.effects[pokemon.randSeedInt(this.effects.length)];
    defender.trySetStatus(effect, true, pokemon);
  }

  public override canApply({ pokemon, defender, move }: Parameters<this["apply"]>[0]): boolean {
    /*
     * The status is only applied to the target if
     * - The move is an Attack Move
     * - The target does not have a secondary ability that suppresses move effects
     * - The target is not the attacker
     * - If a contact move is required to activate the ability, the move should make contact
     * - If the target is behind a substitute, the move must be able to bypass the substitute (checked in `move-effect-phase.ts`)
     * - The game rolls successfully based on the chance
     * - The target is not already statused
     *
     * Note: Status inflicted by abilities post attacking are also considered additional effects of moves.
     */
    return (
      move.isAttackMove()
      && !defender.hasAbilityWithAttr("IgnoreMoveEffectsAbAttr")
      && defender.id !== pokemon.id
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, pokemon, defender))
      && defender.randSeedInt(100) < this.chance
      && !defender.hasNonVolatileStatusEffect()
    );
  }
}
