import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { ElementalType } from "#enums/elemental-type";
import { BattlerIndex } from "#enums/battler-index";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Camouflage", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .moveset([MoveId.CAMOUFLAGE])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.REGIELEKI)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.PSYCHIC_TERRAIN);
  });

  it("Camouflage should look at terrain first when selecting a type to change into", async () => {
    await game.classicMode.startBattle([SpeciesId.SHUCKLE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.CAMOUFLAGE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();
    expect(game.scene.arena.hasTerrain(TerrainType.PSYCHIC)).toBe(true);
    const pokemonType = playerPokemon.getTypes()[0];
    expect(pokemonType).toBe(ElementalType.PSYCHIC);
  });
});
