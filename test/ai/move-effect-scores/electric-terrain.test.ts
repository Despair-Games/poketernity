import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Electric Terrain", () => {
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
      .enemyMoveset([MoveId.ELECTRIC_TERRAIN, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when no synergies are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.ELECTRIC_TERRAIN);
  });

  it("should be preferred when the user is Electric-type", async () => {
    game.override.enemySpecies(SpeciesId.PAWMI);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.ELECTRIC_TERRAIN);
  });

  it("should be avoided when the opponent is Electric-type", async () => {
    await game.classicMode.startBattle(SpeciesId.PAWMI);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.ELECTRIC_TERRAIN);
  });

  const abilityTestCases = [
    { abilityName: "Surge Surfer", abilityId: AbilityId.SURGE_SURFER },
    { abilityName: "Quark Drive", abilityId: AbilityId.QUARK_DRIVE },
    // Hadron Engine is excluded since it already sets Electric Terrain
  ];

  it.each(abilityTestCases)("should be preferred when the user has $abilityName", async ({ abilityId }) => {
    game.override.enemyAbility(abilityId);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.ELECTRIC_TERRAIN);
  });

  it.each(abilityTestCases)(
    "should be avoided when the opponent is known to have $abilityName",
    async ({ abilityId }) => {
      game.override.ability(abilityId);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toNeverSelectMove(MoveId.ELECTRIC_TERRAIN);

      game.field.revealAllAbilities();
      expect(enemy).toNeverSelectMove(MoveId.ELECTRIC_TERRAIN);
    },
  );

  const moveTestCases = [
    { moveName: "Terrain Pulse", moveId: MoveId.TERRAIN_PULSE },
    { moveName: "Rising Voltage", moveId: MoveId.RISING_VOLTAGE },
  ];

  it.each(moveTestCases)("should be preferred when the user has $moveName", async ({ moveId }) => {
    game.override.enemyMoveset([MoveId.ELECTRIC_TERRAIN, moveId, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.CHIKORITA);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.ELECTRIC_TERRAIN);
  });

  it("should be preferred when the opponent is known to have a Sleep-inducing move", async () => {
    game.override.moveset(MoveId.HYPNOSIS);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.ELECTRIC_TERRAIN);

    game.field.revealAllMoves();
    expect(enemy).toPreferSelectingMove(MoveId.ELECTRIC_TERRAIN);
  });

  it("should not be preferred when the opponent is known to have a Burn-inducing move", async () => {
    game.override.moveset(MoveId.WILL_O_WISP);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    game.field.revealAllAbilities();

    expect(enemy).not.toPreferSelectingMove(MoveId.ELECTRIC_TERRAIN);
  });

  it("should be avoided when the user has a Sleep-inducing move", async () => {
    game.override.enemyMoveset([MoveId.ELECTRIC_TERRAIN, MoveId.HYPNOSIS, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.ELECTRIC_TERRAIN);
  });
});
