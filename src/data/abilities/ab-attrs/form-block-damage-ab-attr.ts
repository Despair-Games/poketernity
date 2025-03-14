import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import { ReceivedMoveDamageMultiplierAbAttr } from "#app/data/abilities/ab-attrs/received-move-damage-multiplier-ab-attr";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";

/**
 * Negates the damage from the first hit of a damaging move,
 * then removes the appropriate `BattlerTag` from the pokemon.
 *
 * This is used in the Disguise and Ice Face abilities.
 * @extends ReceivedMoveDamageMultiplierAbAttr
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
    super(condition, multiplier);

    this.multiplier = multiplier;
    this.tagType = tagType;
    this.recoilDamageFunc = recoilDamageFunc;
    this.triggerMessageFunc = triggerMessageFunc;
  }

  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    multiplier: NumberHolder,
  ): boolean {
    if (this.condition(pokemon, attacker, move) && !move.hitsSubstitute(attacker, pokemon)) {
      if (!simulated) {
        multiplier.value *= this.multiplier;
        pokemon.removeTag(this.tagType);
        if (this.recoilDamageFunc) {
          pokemon.damageAndUpdate(this.recoilDamageFunc(pokemon), {
            result: HitResult.OTHER,
            preventEndure: true,
            ignoreFaintPhase: true,
            ignoreDynamaxReduction: true,
          });
        }
      }
      return true;
    }

    return false;
  }

  /**
   * Gets the message triggered when the Pokémon avoids damage using the form-changing ability.
   * @param pokemon The Pokémon with the ability.
   * @param abilityName The name of the ability.
   * @param args n/a
   * @returns The trigger message.
   */
  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return this.triggerMessageFunc(pokemon, abilityName);
  }
}
