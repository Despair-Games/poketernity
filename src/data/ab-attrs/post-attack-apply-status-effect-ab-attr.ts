import type { Move } from "#app/data/move";
import { MoveFlags } from "../../enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type { StatusEffect } from "#enums/status-effect";
import { IgnoreMoveEffectsAbAttr } from "./ignore-move-effect-ab-attr";
import { PostAttackAbAttr } from "./post-attack-ab-attr";

export class PostAttackApplyStatusEffectAbAttr extends PostAttackAbAttr {
  private readonly contactRequired: boolean;
  public readonly chance: number;
  private readonly effects: StatusEffect[];

  constructor(contactRequired: boolean, chance: number, ...effects: StatusEffect[]) {
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
      !target.hasAbilityWithAttr(IgnoreMoveEffectsAbAttr)
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
