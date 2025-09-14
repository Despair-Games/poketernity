import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Sandstorm", () => {
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
      .enemyMoveset([MoveId.SANDSTORM, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when no synergy is on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SANDSTORM);
  });

  const typeTestCases = [
    { typeName: "Rock", testSpecies: SpeciesId.NACLI },
    { typeName: "Ground", testSpecies: SpeciesId.NINCADA },
    { typeName: "Steel", testSpecies: SpeciesId.BELDUM },
  ];

  it.each(typeTestCases)("should be preferred when the user is $typeName-type", async ({ testSpecies }) => {
    game.override.enemySpecies(testSpecies);

    await game.classicMode.startBattle(SpeciesId.AVALUGG);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SANDSTORM);
  });

  // Ground and Steel are penalized less, so Sandstorm is discouraged, but not avoided.
  // However, testing for "not preferring" Sandstorm may produce false positives (see "no synergy" test)
  it.skip.each(typeTestCases)("should be avoided when the opponent is $typeName-type", async ({ testSpecies }) => {
    await game.classicMode.startBattle(testSpecies);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SANDSTORM);
  });

  type AbilityTestCase = { name: string; id: AbilityId };
  const abilityTestCases: AbilityTestCase[] = [
    { name: "Sand Force", id: AbilityId.SAND_FORCE },
    { name: "Sand Rush", id: AbilityId.SAND_RUSH },
    { name: "Sand Veil", id: AbilityId.SAND_VEIL },
    { name: "Magic Guard", id: AbilityId.MAGIC_GUARD },
    { name: "Overcoat", id: AbilityId.OVERCOAT },
  ];

  it.each(abilityTestCases)("should be preferred when the user has $name", async ({ id }) => {
    game.override.enemyAbility(id);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SANDSTORM);
  });

  it.each(abilityTestCases)("should be avoided when the opponent is known to have $name", async ({ id }) => {
    game.override.ability(id);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toNeverSelectMove(MoveId.SANDSTORM);

    game.field.revealAllAbilities();
    expect(enemy).toNeverSelectMove(MoveId.SANDSTORM);
  });

  type MoveTestCase = { name: string; id: MoveId };
  const moveTestCases: MoveTestCase[] = [
    { name: "Weather Ball", id: MoveId.WEATHER_BALL },
    { name: "Shore Up", id: MoveId.SHORE_UP },
  ];

  it.each(moveTestCases)("should be preferred when the user knows $name", async ({ id }) => {
    game.override.enemySpecies(SpeciesId.MUNCHLAX).enemyMoveset([MoveId.SANDSTORM, id]);

    await game.classicMode.startBattle(SpeciesId.BLISSEY);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SANDSTORM);
  });
});
