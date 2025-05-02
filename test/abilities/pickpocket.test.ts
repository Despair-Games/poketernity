import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Pickpocket", () => {
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
      .moveset([MoveId.SPLASH, MoveId.SUBSTITUTE])
      .ability(AbilityId.PICKPOCKET)
      .startingLevel(20)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.TACKLE)
      .enemyHeldItems([{ name: "LEFTOVERS" }]);
  });

  it("should steal the enemy's held item when hit by a contact move", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.scene.getEnemyPokemon()!.getHeldItems().length).toBe(0);
    expect(game.scene.getPlayerPokemon()!.getHeldItems().length).toBe(1);
  });

  it("should not steal the enemy's held item when hit by a non-contact move", async () => {
    game.override.enemyMoveset(MoveId.EMBER);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.scene.getEnemyPokemon()!.getHeldItems().length).toBe(1);
    expect(game.scene.getPlayerPokemon()!.getHeldItems().length).toBe(0);
  });

  it("shouldn't trigger when the enemy hits a substitute", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.select(MoveId.SUBSTITUTE);
    await game.toEndOfTurn();

    expect(game.scene.getEnemyPokemon()!.getHeldItems().length).toBe(1);
    expect(game.scene.getPlayerPokemon()!.getHeldItems().length).toBe(0);
  });
});
