// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type globalScene } from "#app/global-scene";
// -- end tsdoc imports --

import type { Ability } from "#app/data/abilities/ability";
import { allAbilities } from "#app/data/data-lists";
import type { EnemyPokemon, PlayerPokemon, Pokemon } from "#app/field/pokemon";
import type { Abilities } from "#enums/abilities";
import type { BattlerIndex } from "#enums/battler-index";
import { Stat } from "#enums/stat";
import { GameManagerHelper } from "#test/test-utils/helpers/gameManagerHelper";
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

  /** @returns the order of commands executed in the last turn by {@linkcode BattlerIndex}. */
  public getTurnOrder(): BattlerIndex[] {
    return this.game.scene
      .getField(true)
      .sort((pA, pB) => pA.turnData.order - pB.turnData.order)
      .map((p) => p.getBattlerIndex());
  }

  /**
   * @returns the {@linkcode BattlerIndex | indexes} of Pokemon on the field in order of decreasing Speed.
   * Speed ties are returned in increasing order of index.
   */
  public getSpeedOrder(): BattlerIndex[] {
    return this.game.scene
      .getField(true)
      .sort((pA, pB) => pB.getEffectiveStat(Stat.SPD) - pA.getEffectiveStat(Stat.SPD))
      .map((p) => p.getBattlerIndex());
  }

  /**
   * Mocks a pokemon's ability, overriding its existing ability (takes precedence over global overrides)
   * @param pokemon - The pokemon to mock the ability of
   * @param ability - The ability to be mocked
   * @returns A {@linkcode MockInstance} object
   * @see {@linkcode vi.spyOn}
   * @see https://vitest.dev/api/mock#mockreturnvalue
   */
  public mockAbility(pokemon: Pokemon, ability: Abilities): MockInstance<(baseOnly?: boolean) => Ability> {
    return vi.spyOn(pokemon, "getAbility").mockReturnValue(allAbilities[ability]);
  }
}
