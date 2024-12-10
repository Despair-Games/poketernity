import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type Move from "../move";
import { MoveFlags } from "../move";
import { IgnoreMoveEffectsAbAttr } from "./ignore-move-effect-ab-attr";
import { PostAttackAbAttr } from "./post-attack-ab-attr";

/**
 * Ability attribute that applies a battler tag to the target after an attack
 * Abilities using this attribute:
 * - Stench
 */

export class PostAttackApplyBattlerTagAbAttr extends PostAttackAbAttr {
  private contactRequired: boolean;
  private chance: (user: Pokemon, target: Pokemon, move: Move) => number;
  private effects: BattlerTagType[];

  constructor(
    contactRequired: boolean,
    chance: (user: Pokemon, target: Pokemon, move: Move) => number,
    ...effects: BattlerTagType[]
  ) {
    super();

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  override applyPostAttackAfterMoveTypeCheck(
    attacker: Pokemon,
    _passive: boolean,
    simulated: boolean,
    target: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    /**
     * The battler tag is only applied to the target if
     * - The attacker does not have a secondary ability that suppresses move effects
     * - The target is not the attacker
     * - If a contact move is required to activate the ability, the move should make contact
     * - If the target is behind a substitute, the move must be able to bypass the substitute
     * - The game rolls successfully based on the chance
     *
     * Note: Battler tags inflicted by abilities post attacking are also considered additional effects of moves.
     */
    if (
      !attacker.hasAbilityWithAttr(IgnoreMoveEffectsAbAttr)
      && target.id !== attacker.id
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, target))
      && (target.getTag(BattlerTagType.SUBSTITUTE) ? move.hitsSubstitute(attacker, target) : true)
      && target.randSeedInt(100) < this.getChance(attacker, target, move)
    ) {
      const effect =
        this.effects.length === 1 ? this.effects[0] : this.effects[target.randSeedInt(this.effects.length)];
      return simulated || attacker.addTag(effect);
    }
    return false;
  }

  /**
   * Calculates the ability's activation chance based on the conditional stored in this.chance
   */
  getChance(attacker: Pokemon, target: Pokemon, move: Move): number {
    return this.chance(attacker, target, move);
  }
}
