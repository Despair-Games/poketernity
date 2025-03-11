import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Nature Power", () => {
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
      .moveset([MoveId.NATURE_POWER])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should call Round in the Town biome", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.NATURE_POWER);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(game.field.getPlayerPokemon().getLastXMoves()[0].move.id).toBe(MoveId.ROUND);
  });

  it("should call Thunderbolt in electric terrain, overriding the Biome-defined move", async () => {
    game.override.ability(Abilities.ELECTRIC_SURGE);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.NATURE_POWER);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(game.field.getPlayerPokemon().getLastXMoves()[0].move.id).toBe(MoveId.THUNDERBOLT);
  });

  it("should be able to target the user's ally", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    game.move.use(MoveId.NATURE_POWER, 0, BattlerIndex.PLAYER_2);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerParty()[1].isFullHp()).toBe(false);
    for (const pokemon of game.scene.getEnemyParty()) {
      expect(pokemon.isFullHp()).toBe(true);
    }
  });

  it("should be able to target multiple Pokemon at once, if applicable for the called move", async () => {
    game.override.battleType("double").startingBiome(Biome.VOLCANO); // Volcano -> Lava Plume
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    game.move.use(MoveId.NATURE_POWER, 0, BattlerIndex.PLAYER_2);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerParty()[1].isFullHp()).toBe(false);
    for (const pokemon of game.scene.getEnemyParty()) {
      expect(pokemon.isFullHp()).toBe(false);
    }
  });
});
