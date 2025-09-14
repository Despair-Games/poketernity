import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Snowscape", () => {
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
      .enemyMoveset([MoveId.SNOWSCAPE, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when no synergy is on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SNOWSCAPE);
  });

  it("should be preferred when the user is Ice-type", async () => {
    game.override.enemySpecies(SpeciesId.SNOM);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SNOWSCAPE);
  });

  it("should be avoided when the opponent is Ice-type", async () => {
    await game.classicMode.startBattle(SpeciesId.SNOM);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SNOWSCAPE);
  });

  type AbilityTestCase = { name: string; id: AbilityId };
  const abilityTestCases: AbilityTestCase[] = [
    { name: "Ice Body", id: AbilityId.ICE_BODY },
    { name: "Snow Cloak", id: AbilityId.SNOW_CLOAK },
    { name: "Slush Rush", id: AbilityId.SLUSH_RUSH },
    { name: "Ice Face", id: AbilityId.ICE_FACE },
  ];

  it.each(abilityTestCases)("should be preferred when the user has $name", async ({ id }) => {
    game.override.enemyAbility(id);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SNOWSCAPE);
  });

  it.each(abilityTestCases)("should be avoided when the opponent is known to have $name", async ({ id }) => {
    game.override.ability(id);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    // This needs to be asserted conditionally because Ice Face reveals itself on summon
    if (!game.field.getPlayerPokemon().hasRevealedAbility(id)) {
      expect(enemy).not.toNeverSelectMove(MoveId.SNOWSCAPE);
    }

    game.field.revealAllAbilities();
    expect(enemy).toNeverSelectMove(MoveId.SNOWSCAPE);
  });

  type MoveTestCase = { name: string; id: MoveId };
  const moveTestCases: MoveTestCase[] = [
    { name: "Weather Ball", id: MoveId.WEATHER_BALL },
    { name: "Blizzard", id: MoveId.BLIZZARD },
    { name: "Aurora Veil", id: MoveId.AURORA_VEIL },
  ];

  it.each(moveTestCases)("should be preferred when the user knows $name", async ({ id }) => {
    game.override.enemyMoveset([MoveId.SNOWSCAPE, id]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SNOWSCAPE);
  });
});
