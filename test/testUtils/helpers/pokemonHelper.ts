import type { EnemyPokemon, PlayerPokemon } from "#app/field/pokemon";
import { GameManagerHelper } from "#test/testUtils/helpers/gameManagerHelper";
// tsdoc imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type globalScene } from "#app/global-scene";

/** Helper to manage pokemon */
export class PokemonHelper extends GameManagerHelper {
  /**
   * Passthrough for {@linkcode globalScene.getPlayerPokemon} that ignores the `undefined` return value.
   *
   * Note: `undefined` can still be returned if there is no valid pokemon, but the compiler will
   * no longer warn of that possibility or require `null` checks in order to simplify test writing.
   * @param includeSwitching Whether a pokemon that is currently switching out is valid, default `true`
   * @returns The first {@linkcode PlayerPokemon} that is {@linkcode globalScene.getPlayerField on the field}
   * and {@linkcode PlayerPokemon.isActive is active}
   * (aka {@linkcode PlayerPokemon.isAllowedInBattle is allowed in battle}).
   */
  public getPlayerPokemon(includeSwitching: boolean = true): PlayerPokemon {
    return this.game.scene.getPlayerPokemon(includeSwitching)!;
  }

  /**
   * Passthrough for {@linkcode globalScene.getPlayerPokemon} that ignores the `undefined` return value.
   *
   * Note: `undefined` can still be returned if there is no valid pokemon, but the compiler will
   * no longer warn of that possibility or require `null` checks in order to simplify test writing.
   * @param includeSwitching Whether a pokemon that is currently switching out is valid, default `true`
   * @returns The first {@linkcode EnemyPokemon} that is {@linkcode globalScene.getEnemyField on the field}
   * and {@linkcode EnemyPokemon.isActive is active}
   * (aka {@linkcode EnemyPokemon.isAllowedInBattle is allowed in battle}).
   */
  public getEnemyPokemon(includeSwitching: boolean = true): EnemyPokemon {
    return this.game.scene.getEnemyPokemon(includeSwitching)!;
  }
}
