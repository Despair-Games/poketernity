import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Protect", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const baseMoveset = [MoveId.PROTECT, MoveId.SPLASH, MoveId.TACKLE];

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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(baseMoveset)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over moves with low impact", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.PROTECT);
  });

  it("should not be preferred over moves with high impact", async () => {
    game.override.enemyMoveset([...baseMoveset, MoveId.SUPER_FANG]);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.PROTECT);
  });

  it.each([
    { abilityName: "Speed Boost", abilityId: AbilityId.SPEED_BOOST },
    { abilityName: "Moody", abilityId: AbilityId.MOODY },
    { abilityName: "Stance Change", abilityId: AbilityId.STANCE_CHANGE },
  ])("should be strongly preferred if the user has $abilityName", async ({ abilityId }) => {
    game.override.enemyAbility(abilityId);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.PROTECT);
  });

  it("should not be preferred if the user used Protect last turn", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.PROTECT);
    await game.toNextTurn();

    expect(enemy).not.toPreferSelectingMove(MoveId.PROTECT);
  });
});
