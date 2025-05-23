import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute for the effect of {@link https://bulbapedia.bulbagarden.net/wiki/Nightmare_(move) | Nightmare}.
 * If the target is asleep, deals damage to the target at the end
 * of each turn until the target wakes up.
 * @extends AddBattlerTagAttr
 */
export class NightmareAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.NIGHTMARE, false, { failOnOverlap: true });
  }

  /** Grants (+1) if the target has been asleep for 1 turn or less */
  public override getEffectScore(_user: EnemyPokemon, target: Pokemon, _move: Move): number {
    return target.hasStatusEffect(StatusEffect.SLEEP) && target.turnsAsleep <= 1 ? 1 : 0;
  }
}
