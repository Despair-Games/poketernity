import type { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatusEffectAttr } from "#moves/status-effect-attr";
import { randSeedItem } from "#utils/random-utils";

/**
 * Attribute to randomly apply one of a {@linkcode effects | set of status effects}
 * onto the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Tri_Attack_(move) | Tri-Attack}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Dire_Claw_(move) | Dire Claw}.
 */
export class MultiStatusEffectAttr extends StatusEffectAttr {
  public effects: StatusEffect[];

  constructor(effects: StatusEffect[], selfTarget?: boolean, turnsRemaining?: number, overrideStatus?: boolean) {
    super(effects[0], selfTarget, turnsRemaining, overrideStatus);
    this.effects = effects;
  }

  public override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    this.effect = randSeedItem(this.effects);
    return super.applyEffect(user, target, move);
  }

  /**
   * @returns The average base Effect Score among each of this attribute's {@linkcode effects},
   * according to {@linkcode getStatusEffectScore}
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const totalStatusEffectScore = this.effects.reduce(
      (score, effect) => score + this.getStatusEffectScore(user, target, effect),
      0,
    );
    return totalStatusEffectScore / this.effects.length;
  }
}
