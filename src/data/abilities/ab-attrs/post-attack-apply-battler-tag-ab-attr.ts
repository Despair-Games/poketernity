import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * Ability attribute that applies a battler tag to the target after an attack
 * Abilities using this attribute:
 * - Stench
 */
export class PostAttackApplyBattlerTagAbAttr extends PostAttackAbAttr {
  private readonly contactRequired: boolean;
  private readonly chance: (user: Pokemon, target: Pokemon, move: Move) => number;
  private readonly effects: BattlerTagType[];

  constructor(
    contactRequired: boolean,
    chance: (user: Pokemon, target: Pokemon, move: Move) => number,
    ...effects: BattlerTagType[]
  ) {
    super();
    this._flags.add(AbAttrFlag.POST_ATTACK_APPLY_BATTLER_TAG);

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  public override apply(attacker: Pokemon, simulated: boolean, target: Pokemon, _move: Move): void {
    if (simulated) {
      return;
    }

    const effect = this.effects.length === 1 ? this.effects[0] : this.effects[target.randSeedInt(this.effects.length)];
    attacker.addTag(effect);
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [attacker, , target, move] = params;

    /**
     * The battler tag is only applied to the target if
     * - The target does not have a secondary ability that suppresses move effects
     * - The target is not the attacker
     * - If a contact move is required to activate the ability, the move should make contact
     * - If the target is behind a substitute, the move must be able to bypass the substitute (checked in move-effect-phase.ts)
     * - The game rolls successfully based on the chance
     *
     * Note: Battler tags inflicted by abilities post attacking are also considered additional effects of moves.
     */
    return (
      !target.hasAbilityWithAttr(AbAttrFlag.IGNORE_MOVE_EFFECTS)
      && target.id !== attacker.id
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, target))
      && target.randSeedInt(100) < this.getChance(attacker, target, move)
    );
  }

  /** This indirection function allows the tests to work. */
  public getChance(attacker: Pokemon, target: Pokemon, move: Move): number {
    return this.chance(attacker, target, move);
  }
}
