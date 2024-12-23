import type Move from "#app/data/move";
import { MoveFlags } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type { StatusEffect } from "#enums/status-effect";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendContactApplyStatusEffectAbAttr extends PostDefendAbAttr {
  public readonly chance: number;
  private readonly effects: StatusEffect[];

  constructor(chance: number, ...effects: StatusEffect[]) {
    super();

    this.chance = chance;
    this.effects = effects;
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
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.status
      && (this.chance === -1 || pokemon.randSeedInt(100) < this.chance)
    ) {
      const effect =
        this.effects.length === 1 ? this.effects[0] : this.effects[pokemon.randSeedInt(this.effects.length)];
      if (simulated) {
        return attacker.canSetStatus(effect, true, false, pokemon);
      } else {
        return attacker.trySetStatus(effect, true, pokemon);
      }
    }

    return false;
  }
}
