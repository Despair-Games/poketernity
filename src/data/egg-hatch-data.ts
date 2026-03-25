import { globalScene } from "#app/global-scene";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { DexEntry } from "#types/dex-data";
import type { StarterDataEntry } from "#types/starter-data";

/**
 * Stores data associated with a specific egg and the hatched pokemon.
 *
 * Allows hatch info to be stored at hatch then retrieved for display during egg summary.
 */
export class EggHatchData {
  /** The Pokemon that hatched from the egg (including shiny, IVs, ability) */
  public readonly pokemon: PlayerPokemon;
  /** The index of the egg move from the hatched Pokemon (not stored in `PlayerPokemon`) */
  public readonly eggMoveIndex: number;
  /** Whether the egg move for the hatch is new */
  public eggMoveUnlocked: boolean;
  /** A copy of the hatched Pokemon's dex entry before it was updated due to hatching */
  private _dexEntryBeforeUpdate: DexEntry;
  /** A copy of the hatched Pokemon's starter entry before it was updated due to hatching */
  private _starterDataEntryBeforeUpdate: StarterDataEntry;

  constructor(pokemon: PlayerPokemon, eggMoveIndex: number) {
    this.pokemon = pokemon;
    this.eggMoveIndex = eggMoveIndex;
  }

  public get dexEntryBeforeUpdate(): DexEntry {
    return this._dexEntryBeforeUpdate;
  }

  public get starterDataEntryBeforeUpdate(): StarterDataEntry {
    return this._starterDataEntryBeforeUpdate;
  }

  /**
   * Stores a copy of the current {@linkcode DexEntry} of the pokemon and {@linkcode StarterDataEntry} of its starter.
   *
   * Used before updating the dex, so comparing the pokemon to these entries will show the new attributes.
   */
  public storeDexAndStarterEntries(): void {
    const { gameData } = globalScene;

    const currDexEntry = gameData.dexData[this.pokemon.species.speciesId];
    const currStarterDataEntry = gameData.starterData[this.pokemon.species.getRootSpeciesId()];

    this._dexEntryBeforeUpdate = { ...currDexEntry };
    this._starterDataEntryBeforeUpdate = { ...currStarterDataEntry, ivs: [...currStarterDataEntry.ivs] };
  }

  /**
   * Update the pokedex data corresponding with the new hatch's pokemon data.
   *
   * Also sets whether the egg move is a new unlock or not.
   * @param showMessage - (Default `false`) Whether to show messages for the new catches and egg moves
   */
  public async updatePokemon(showMessage: boolean = false): Promise<void> {
    const { gameData } = globalScene;

    await gameData.setPokemonCaught(this.pokemon, true, true, showMessage);
    gameData.updateSpeciesDexIvs(this.pokemon.species.speciesId, this.pokemon.ivs);

    const unlocked = await gameData.setEggMoveUnlocked(this.pokemon.species, this.eggMoveIndex, showMessage);
    this.eggMoveUnlocked = unlocked;
  }
}
