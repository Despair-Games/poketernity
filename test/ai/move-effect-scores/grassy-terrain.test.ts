import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Grassy Terrain", () => {
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
      .enemyMoveset([MoveId.GRASSY_TERRAIN, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when no synergies are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.GRASSY_TERRAIN);
  });

  it("should be preferred when the user is Grass-type", async () => {
    game.override.enemySpecies(SpeciesId.CHIKORITA);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.GRASSY_TERRAIN);
  });

  it("should be avoided when the opponent is Grass-type", async () => {
    await game.classicMode.startBattle(SpeciesId.CHIKORITA);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.GRASSY_TERRAIN);
  });

  it("should be preferred when the user has Grass Pelt", async () => {
    game.override.enemyAbility(AbilityId.GRASS_PELT);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.GRASSY_TERRAIN);
  });

  it("should be avoided when the opponent is known to have Grass Pelt", async () => {
    game.override.ability(AbilityId.GRASS_PELT);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toNeverSelectMove(MoveId.GRASSY_TERRAIN);

    game.field.revealAllAbilities();
    expect(enemy).toNeverSelectMove(MoveId.GRASSY_TERRAIN);
  });

  it.each([
    { moveName: "Terrain Pulse", moveId: MoveId.TERRAIN_PULSE },
    { moveName: "Grassy Glide", moveId: MoveId.GRASSY_GLIDE },
  ])("should be preferred when the user knows $moveName", async ({ moveId }) => {
    game.override.enemyMoveset([MoveId.GRASSY_TERRAIN, moveId, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.MELTAN);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.GRASSY_TERRAIN);
  });

  const badMoveTestCases = [
    { moveName: "Earthquake", moveId: MoveId.EARTHQUAKE },
    { moveName: "Bulldoze", moveId: MoveId.BULLDOZE },
    { moveName: "Magnitude", moveId: MoveId.MAGNITUDE },
  ];

  it.each(badMoveTestCases)("should be avoided when the user knows $moveName", async ({ moveId }) => {
    game.override.enemyMoveset([MoveId.GRASSY_TERRAIN, moveId, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.GRASSY_TERRAIN);
  });

  it.each(badMoveTestCases)("should be preferred when the opponent is known to have $moveName", async ({ moveId }) => {
    game.override.moveset(moveId);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.GRASSY_TERRAIN);

    game.field.revealAllMoves();
    expect(enemy).toPreferSelectingMove(MoveId.GRASSY_TERRAIN);
  });
});
