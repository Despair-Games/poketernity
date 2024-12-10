import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";
import { Type } from "#enums/type";
import type Move from "../move";
import { PostDefendContactApplyStatusEffectAbAttr } from "./post-defend-contact-apply-status-effect-ab-attr";

export class EffectSporeAbAttr extends PostDefendContactApplyStatusEffectAbAttr {
  constructor() {
    super(10, StatusEffect.POISON, StatusEffect.PARALYSIS, StatusEffect.SLEEP);
  }

  override applyPostDefend(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    hitResult: HitResult,
    args: any[],
  ): boolean {
    if (attacker.hasAbility(Abilities.OVERCOAT) || attacker.isOfType(Type.GRASS)) {
      return false;
    }
    return super.applyPostDefend(pokemon, passive, simulated, attacker, move, hitResult, args);
  }
}
