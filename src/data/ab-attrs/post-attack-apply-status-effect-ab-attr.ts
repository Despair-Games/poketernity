import type Move from "#app/data/move";
import { MoveFlags } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type { StatusEffect } from "#enums/status-effect";
import { IgnoreMoveEffectsAbAttr } from "./ignore-move-effect-ab-attr";
import { PostAttackAbAttr } from "./post-attack-ab-attr";

export class PostAttackApplyStatusEffectAbAttr extends PostAttackAbAttr {
  private contactRequired: boolean;
  private chance: number;
  private effects: StatusEffect[];

  constructor(contactRequired: boolean, chance: number, ...effects: StatusEffect[]) {
    super();

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (pokemon !== attacker) {
      return false;
    }

    // Status inflicted by abilities post attacking are also considered additional effects.
    if (
      !attacker.hasAbilityWithAttr(IgnoreMoveEffectsAbAttr)
      && !simulated
      && pokemon !== attacker
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon))
      && pokemon.randSeedInt(100) < this.chance
      && !pokemon.status
    ) {
      const effect =
        this.effects.length === 1 ? this.effects[0] : this.effects[pokemon.randSeedInt(this.effects.length)];
      return attacker.trySetStatus(effect, true, pokemon);
    }

    return simulated;
  }
}
