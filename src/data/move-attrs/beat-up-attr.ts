import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Helper function to calculate the the base power of an ally's hit when using Beat Up.
 * @param user The Pokemon that used Beat Up.
 * @param allyIndex The party position of the ally contributing to Beat Up.
 * @returns The base power of the Beat Up hit.
 */
const beatUpFunc = (user: Pokemon, allyIndex: number): number => {
  const party = user.getParty();

  for (let i = allyIndex; i < party.length; i++) {
    const pokemon = party[i];

    // The user contributes to Beat Up regardless of status condition.
    // Allies can contribute only if they do not have a non-volatile status condition.
    if (pokemon.id !== user.id && pokemon?.status && pokemon.status.effect !== StatusEffect.NONE) {
      continue;
    }
    return pokemon.species.getBaseStat(Stat.ATK) / 10 + 5;
  }
  return 0;
};

export class BeatUpAttr extends VariablePowerAttr {
  /**
   * Gets the next party member to contribute to a Beat Up hit, and calculates the base power for it.
   * @param user Pokemon that used the move
   * @param _target N/A
   * @param _move Move with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const power = args[0] as NumberHolder;

    const party = user.getParty();
    const allyCount = party.filter((pokemon) => {
      return pokemon.id === user.id || !pokemon.status?.effect;
    }).length;
    const allyIndex = (user.turnData.hitCount - user.turnData.hitsLeft) % allyCount;
    power.value = beatUpFunc(user, allyIndex);
    return true;
  }
}
