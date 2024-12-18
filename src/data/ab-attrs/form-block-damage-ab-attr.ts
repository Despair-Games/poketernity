import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { ReceivedMoveDamageMultiplierAbAttr } from "./received-move-damage-multiplier-ab-attr";

/**
 * Takes no damage from the first hit of a damaging move.
 * This is used in the Disguise and Ice Face abilities.
 * @extends ReceivedMoveDamageMultiplierAbAttr
 */
export class FormBlockDamageAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  private multiplier: number;
  private tagType: BattlerTagType;
  private recoilDamageFunc?: (pokemon: Pokemon) => number;
  private triggerMessageFunc: (pokemon: Pokemon, abilityName: string) => string;

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

  /**
   * Applies the pre-defense ability to the Pokémon.
   * Removes the appropriate `BattlerTagType` when hit by an attack and is in its defense form.
   *
   * @param pokemon The Pokémon with the ability.
   * @param _passive n/a
   * @param attacker The attacking Pokémon.
   * @param move The move being used.
   * @param _cancelled n/a
   * @param args Additional arguments.
   * @returns `true` if the immunity was applied.
   */
  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (this.condition(pokemon, attacker, move) && !move.hitsSubstitute(attacker, pokemon)) {
      if (!simulated) {
        const damage: NumberHolder = args[0];
        damage.value = this.multiplier;
        pokemon.removeTag(this.tagType);
        if (this.recoilDamageFunc) {
          pokemon.damageAndUpdate(this.recoilDamageFunc(pokemon), HitResult.OTHER, false, false, true, true);
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
   * @param _args n/a
   * @returns The trigger message.
   */
  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return this.triggerMessageFunc(pokemon, abilityName);
  }
}
