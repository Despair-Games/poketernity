import { ReceivedMoveDamageMultiplierAbAttr } from "#abilities/received-move-damage-multiplier-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Negates the damage from the first hit of a damaging move,
 * then removes the appropriate `BattlerTag` from the pokemon.
 *
 * This is used in the Disguise and Ice Face abilities.
 */
export class FormBlockDamageAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  private readonly multiplier: number;
  private readonly tagType: BattlerTagType;
  private readonly recoilDamageFunc?: (pokemon: Pokemon) => number;
  private readonly triggerMessageFunc: (pokemon: Pokemon, abilityName: string) => string;

  constructor(
    condition: PokemonDefendCondition,
    multiplier: number,
    tagType: BattlerTagType,
    triggerMessageFunc: (pokemon: Pokemon, abilityName: string) => string,
    recoilDamageFunc?: (pokemon: Pokemon) => number,
  ) {
    super(condition, multiplier, true);

    this.multiplier = multiplier;
    this.tagType = tagType;
    this.recoilDamageFunc = recoilDamageFunc;
    this.triggerMessageFunc = triggerMessageFunc;
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    multiplier: ValueHolder<number>,
  ): void {
    if (simulated) {
      return;
    }
    multiplier.value *= this.multiplier;
    pokemon.removeTag(this.tagType);
    if (this.recoilDamageFunc) {
      pokemon.damageAndUpdate(this.recoilDamageFunc(pokemon), {
        result: HitResult.OTHER,
        preventEndure: true,
        ignoreFaintPhase: true,
      });
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, attacker, move) && !move.hitsSubstitute(attacker, pokemon);
  }

  /**
   * Gets the message triggered when the Pokémon avoids damage using the form-changing ability.
   * @param pokemon The Pokémon with the ability.
   * @param abilityName The name of the ability.
   * @returns The trigger message.
   */
  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return this.triggerMessageFunc(pokemon, abilityName);
  }
}
