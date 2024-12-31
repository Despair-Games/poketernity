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
  /** Modifies base power according to the party Pokemon that contributes to the current hit. */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const party = user.getParty();
    const allyCount = party.filter((pokemon) => {
      return pokemon.id === user.id || !pokemon.status?.effect;
    }).length;
    const allyIndex = (user.turnData.hitCount - user.turnData.hitsLeft) % allyCount;
    power.value = beatUpFunc(user, allyIndex);
    return true;
  }
}
