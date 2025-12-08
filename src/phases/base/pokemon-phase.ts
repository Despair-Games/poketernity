import { globalScene } from "#app/global-scene";
import { BattlerIndex, type FieldBattlerIndex } from "#enums/battler-index";
import { TrainerSlot } from "#enums/trainer-slot";
import type { Pokemon } from "#field/pokemon";
import { BattlePhase } from "#phases/base/battle-phase";
import type { nil } from "#types/utility-types";

/**
 * Provides helper functions to get the pokemon involved in the phase
 */
export abstract class PokemonPhase extends BattlePhase {
  /** FieldBattlerIndex of the target Pokemon, or its ID */
  public readonly battlerIndex: FieldBattlerIndex | number;
  public readonly isPlayer: boolean;
  public readonly fieldIndex: number;

  constructor(battlerIndex: FieldBattlerIndex | number) {
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

  /**
   * @returns The {@linkcode Pokemon} at this Phase's field index, or
   * `undefined` if no such Pokemon exists. Unlike {@linkcode getPokemon}, this
   * doesn't require the Pokemon to be active or on the field for it
   * to be returned.
   *
   * @todo This is a bandaid fix for an issue where {@linkcode RecallPhase}
   * would crash the game during a double -> single battle transition. If this phase is
   * refactored, this method should be removed in favor of a more flexible {@linkcode getPokemon}
   * @see {@link https://github.com/Despair-Games/poketernity/pull/1236#pullrequestreview-3046453380}
   */
  protected getPokemonAtFieldIndex(): Pokemon | undefined {
    return this.getAlliedParty()[this.fieldIndex];
  }

  /**
   * @returns the {@linkcode TrainerSlot} for this phase's {@linkcode getPokemon | Pokemon},
   * or {@linkcode TrainerSlot.NONE} if the Pokemon does not have a Trainer
   */
  public getTrainerSlot(): TrainerSlot {
    const pokemon = this.getPokemon();

    if (!pokemon.isEnemy()) {
      return TrainerSlot.NONE;
    }
    return pokemon.trainerSlot;
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
