/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { globalScene } from "#app/global-scene";
import type { GameManager } from "#test/test-utils/game-manager";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { Ability } from "#abilities/ability";
import { allAbilities } from "#data/data-lists";
import type { AbilityId } from "#enums/ability-id";
import type { FieldBattlerIndex } from "#enums/battler-index";
import type { ElementalType } from "#enums/elemental-type";
import { Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { GameManagerHelper } from "#test/test-utils/helpers/game-manager-helper";
import { coerceArray } from "#utils/common-utils";
import { expect, type MockInstance, vi } from "vitest";

/** Helper to manage pokemon */
export class FieldHelper extends GameManagerHelper {
  /**
   * Passthrough for {@linkcode globalScene.getPlayerPokemon} that adds an `undefined` check for
   * the Pokemon so that the return type for the function doesn't have `undefined`.
   * This removes the need to add a `!` like when calling `game.scene.getPlayerPokemon()!`.
   * @param includeSwitching Whether a pokemon that is currently switching out is valid, default `true`
   * @returns The first {@linkcode PlayerPokemon} that is {@linkcode globalScene.getPlayerField on the field}
   * and {@linkcode PlayerPokemon.isActive is active}
   * (aka {@linkcode PlayerPokemon.isAllowedInBattle is allowed in battle}).
   */
  public getPlayerPokemon(includeSwitching: boolean = true): PlayerPokemon {
    const pokemon = this.game.scene.getPlayerPokemon(includeSwitching);
    expect(pokemon).toBeDefined();
    return pokemon!;
  }

  /**
   * Passthrough for {@linkcode globalScene.getEnemyPokemon} that adds an `undefined` check for
   * the Pokemon so that the return type for the function doesn't have `undefined`.
   * This removes the need to add a `!` like when calling `game.scene.getEnemyPokemon()!`.
   * @param includeSwitching Whether a pokemon that is currently switching out is valid, default `true`
   * @returns The first {@linkcode EnemyPokemon} that is {@linkcode globalScene.getEnemyField on the field}
   * and {@linkcode EnemyPokemon.isActive is active}
   * (aka {@linkcode EnemyPokemon.isAllowedInBattle is allowed in battle}).
   */
  public getEnemyPokemon(includeSwitching: boolean = true): EnemyPokemon {
    const pokemon = this.game.scene.getEnemyPokemon(includeSwitching);
    expect(pokemon).toBeDefined();
    return pokemon!;
  }

  /** @returns the order of commands executed in the last turn by {@linkcode FieldBattlerIndex}. */
  public getTurnOrder(): FieldBattlerIndex[] {
    return this.game.scene
      .getField(true)
      .sort((pA, pB) => pA.turnData.order - pB.turnData.order)
      .map((p) => p.getBattlerIndex());
  }

  /**
   * @returns the {@linkcode FieldBattlerIndex | indexes} of Pokemon on the field in order of decreasing Speed.
   * Speed ties are returned in increasing order of index.
   */
  public getSpeedOrder(): FieldBattlerIndex[] {
    return this.game.scene
      .getField(true)
      .sort((pA, pB) => pB.getEffectiveStat(Stat.SPD) - pA.getEffectiveStat(Stat.SPD))
      .map((p) => p.getBattlerIndex());
  }

  /**
   * Sets the permanent Speed stat of active Pokemon to the given values.
   * @param playerSpd - The `number` to set each Player Pokemon's Speed to, or a pair
   * of numbers to individually set Player Pokemon speeds in a double battle
   * @param enemySpd - The `number to set each Enemy Pokemon's Speed to, or a pair
   * of numbers to individually set Enemy Pokemon speeds in a double battle
   *
   * @remarks
   * This method is useful when testing mechanics that directly check or compare Speed between
   * Pokemon. If you need to control turn order, it is safer to use {@linkcode GameManager.setTurnOrder} instead.
   */
  public setSpeed(playerSpd: number | [number, number], enemySpd: number | [number, number]): void {
    const [playerSpdArr, enemySpdArr] = [playerSpd, enemySpd].map((spd) => coerceArray(spd));
    const players = this.game.scene.getPlayerField();
    const enemies = this.game.scene.getEnemyField();

    players.forEach((p, i) => p.setStat(Stat.SPD, playerSpdArr[i] ?? playerSpdArr.at(-1)));
    enemies.forEach((e, i) => e.setStat(Stat.SPD, enemySpdArr[i] ?? enemySpdArr.at(-1)));
  }

  /**
   * Mocks a pokemon's ability, overriding its existing ability (takes precedence over global overrides)
   * @param pokemon - The pokemon to mock the ability of
   * @param ability - The ability to be mocked
   * @returns A {@linkcode MockInstance} object
   * @see {@linkcode vi.spyOn}
   * @see https://vitest.dev/api/mock#mockreturnvalue
   */
  public mockAbility(pokemon: Pokemon, ability: AbilityId): MockInstance<(baseOnly?: boolean) => Ability> {
    return vi.spyOn(pokemon, "getAbility").mockReturnValue(allAbilities[ability]);
  }

  /**
   * Forces a pokemon to be terastallized. Defaults to the pokemon's primary type if not specified.
   *
   * This function only mocks the Pokemon's tera-related variables; it does NOT activate any tera-related abilities.
   *
   * @param pokemon - The pokemon to terastallize.
   * @param teraType - (optional) The {@linkcode ElementalType} to terastallize it as.
   */
  public forceTera(pokemon: Pokemon, teraType?: ElementalType): void {
    vi.spyOn(pokemon, "isTerastallized", "get").mockReturnValue(true);
    teraType ??= pokemon.getSpeciesForm(true).type1;
    vi.spyOn(pokemon, "teraType", "get").mockReturnValue(teraType);
  }

  /** Reveals the abilities of all Pokemon on the field to the Enemy AI */
  public revealAllAbilities(): void {
    this.game.scene.getField(true).forEach((p) => {
      const abilityIds = p.getAbilities().map((ab) => ab.ability.id);
      p.waveData.abilitiesRevealed.push(...abilityIds);
    });
  }

  /** Reveals the moves of all Pokemon on the field to the Enemy AI */
  public revealAllMoves(): void {
    this.game.scene
      .getField(true)
      .forEach((p) => p.getMoveset().forEach((mv) => p.waveData.revealedMoves.add(mv.moveId)));
  }
}
