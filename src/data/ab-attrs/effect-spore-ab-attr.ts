import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";
import { Type } from "#enums/type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { MoveFlags } from "#app/data/move";
import { randSeedInt } from "#app/utils";

export class EffectSporeAbAttr extends PostDefendAbAttr {
  public readonly chance = 30;
  private SLEEP_THRESHOLD = 11;
  private PARA_THRESHOLD = 10 + this.SLEEP_THRESHOLD;
  private PSN_THRESHOLD = 9 + this.PARA_THRESHOLD;

  constructor() {
    super();
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
    if (attacker.hasAbility(Abilities.OVERCOAT) || attacker.isOfType(Type.GRASS)) {
      return false;
    }
    const roll = randSeedInt(100);
    if (move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon) && !attacker.status && roll < this.chance) {
      const statusEffect = this.getStatus(roll);
      if (simulated) {
        return attacker.canSetStatus(statusEffect, true, false, pokemon);
      } else {
        return attacker.trySetStatus(statusEffect, true, pokemon);
      }
    }
    return false;
  }

  private getStatus(roll: number): StatusEffect {
    if (roll < this.SLEEP_THRESHOLD) {
      return StatusEffect.SLEEP;
    } else if (roll < this.PARA_THRESHOLD) {
      return StatusEffect.PARALYSIS;
    } else if (roll < this.PSN_THRESHOLD) {
      return StatusEffect.POISON;
    }
    return StatusEffect.NONE;
  }
}
