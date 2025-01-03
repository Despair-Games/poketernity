import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Future Sight", () => {
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
      .startingLevel(100)
      .moveset([Moves.FUTURE_SIGHT, Moves.SPLASH])
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.STURDY)
      .enemyMoveset(Moves.SPLASH);
  });

  it("hits 2 turns after use, ignores user switch out", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.move.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBe(false);
  });

  it("doesn't crash if the user leaves the field and the hit triggers Destiny Bond", async () => {
    game.override.enemyMoveset([Moves.DESTINY_BOND, Moves.SPLASH]).enemyAbility(Abilities.BALL_FETCH);
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();

    game.move.select(Moves.FUTURE_SIGHT);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.toNextTurn();

    game.move.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.DESTINY_BOND);
    await game.phaseInterceptor.to("SelectModifierPhase", false);

    expect(game.scene.getPlayerPokemon()!.species.speciesId).toBe(Species.MILOTIC);
    expect(milotic.isFullHp()).toBe(true);
    expect(feebas.isFullHp()).toBe(true);
  });

  it("doesn't crash if the user leaves the field and the hit triggers Innards Out", async () => {
    game.override.enemyAbility(Abilities.INNARDS_OUT);
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to("SelectModifierPhase", false);

    expect(game.scene.getPlayerPokemon()!.species.speciesId).toBe(Species.MILOTIC);
    expect(milotic.isFullHp()).toBe(true);
    expect(feebas.isFullHp()).toBe(true);
  });
});
