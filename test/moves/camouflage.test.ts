import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { TerrainType } from "#enums/terrain-type";
import { ElementalType } from "#enums/elemental-type";
import { BattlerIndex } from "#enums/battler-index";
import { GameManager } from "#test/testUtils/gameManager";
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.REGIELEKI)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.PSYCHIC_TERRAIN);
  });

  it("Camouflage should look at terrain first when selecting a type to change into", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.CAMOUFLAGE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase");
    expect(game.scene.arena.hasTerrain(TerrainType.PSYCHIC)).toBe(true);
    const pokemonType = playerPokemon.getTypes()[0];
    expect(pokemonType).toBe(ElementalType.PSYCHIC);
  });
});
