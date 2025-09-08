import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Misty Terrain", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.MISTY_TERRAIN, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when no synergies are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.MISTY_TERRAIN);
  });

  it("should be preferred when the user's opponent is Dragon-type", async () => {
    await game.classicMode.startBattle(SpeciesId.AXEW);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.MISTY_TERRAIN);
  });

  it("should be strongly preferred when the player has multiple Dragon-type Pokemon", async () => {
    await game.classicMode.startBattle(SpeciesId.AXEW, SpeciesId.GIBLE, SpeciesId.BAGON);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.MISTY_TERRAIN);
  });

  it("should be avoided when the user is Dragon-type", async () => {
    game.override.enemySpecies(SpeciesId.AXEW);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.MISTY_TERRAIN);
  });

  it.each([
    { moveName: "Terrain Pulse", moveId: MoveId.TERRAIN_PULSE },
    { moveName: "Misty Explosion", moveId: MoveId.MISTY_EXPLOSION },
  ])("should be preferred when the user knows $moveName", async ({ moveId }) => {
    game.override.enemyMoveset([MoveId.MISTY_TERRAIN, MoveId.TACKLE, moveId]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.MISTY_TERRAIN);
  });

  it("should be preferred when the user's opponent is known to have a status-inflicting move", async () => {
    game.override.moveset(MoveId.POISON_GAS);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.MISTY_TERRAIN);

    game.field.revealAllMoves();
    expect(enemy).toPreferSelectingMove(MoveId.MISTY_TERRAIN);
  });

  it("should be avoided when the user has a status-inflicting move", async () => {
    game.override.enemyMoveset([MoveId.POISON_GAS, MoveId.MISTY_TERRAIN, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.MISTY_TERRAIN);
  });
});
