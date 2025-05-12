import type { nil } from "#app/@types/nil";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattlerIndex } from "#enums/battler-index";
import { FieldPhase } from "./abstract-field-phase";

/**
 * Provides helper functions to get the pokemon involved in the phase
 * @extends FieldPhase
 */
export abstract class PokemonPhase extends FieldPhase {
  protected battlerIndex: BattlerIndex | number;
  public isPlayer: boolean;
  public fieldIndex: number;

  constructor(battlerIndex: BattlerIndex | number) {
    super();

    this.battlerIndex = battlerIndex;
    this.isPlayer = battlerIndex < 2;
    this.fieldIndex = battlerIndex % 2;
  }

  public getPokemon(): Pokemon {
    // TODO: change to `: PlayerPokemon | EnemyPokemon | nil`
    let pokemon: Pokemon | nil;
    if (this.battlerIndex > BattlerIndex.ENEMY_2) {
      pokemon = globalScene.getPokemonById(this.battlerIndex);
    } else {
      pokemon = globalScene.getPokemonByBattlerIndex(this.battlerIndex);
    }
    // TODO: Remove this bang
    return pokemon!;
  }

  public getAlliedParty(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
  }

  public getOpposingParty(): Pokemon[] {
    return this.isPlayer ? globalScene.getEnemyParty() : globalScene.getPlayerParty();
  }

  public getAlliedField(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerField() : globalScene.getEnemyField();
  }

  public getOpposingField(): Pokemon[] {
    return this.isPlayer ? globalScene.getEnemyField() : globalScene.getPlayerField();
  }
}
