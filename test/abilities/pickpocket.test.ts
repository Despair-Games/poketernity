import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
    game.overridesHelper
      .moveset([Moves.SPLASH, Moves.SUBSTITUTE])
      .ability(Abilities.PICKPOCKET)
      .startingLevel(20)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.TACKLE)
      .enemyHeldItems([{ name: "LEFTOVERS" }]);
  });

  it("should steal the enemy's held item when hit by a contact move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(game.scene.getEnemyPokemon()!.getHeldItems().length).toBe(0);
    expect(game.scene.getPlayerPokemon()!.getHeldItems().length).toBe(1);
  });

  it("should not steal the enemy's held item when hit by a non-contact move", async () => {
    game.overridesHelper.enemyMoveset(Moves.EMBER);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(game.scene.getEnemyPokemon()!.getHeldItems().length).toBe(1);
    expect(game.scene.getPlayerPokemon()!.getHeldItems().length).toBe(0);
  });

  it("shouldn't trigger when the enemy hits a substitute", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(Moves.SUBSTITUTE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(game.scene.getEnemyPokemon()!.getHeldItems().length).toBe(1);
    expect(game.scene.getPlayerPokemon()!.getHeldItems().length).toBe(0);
  });
});
