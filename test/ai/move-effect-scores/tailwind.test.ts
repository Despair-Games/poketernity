import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Tailwind", () => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset([MoveId.TAILWIND, MoveId.SPLASH, MoveId.TACKLE])
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should have a small incentive to use in a single battle", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.TAILWIND);

    game.override.enemyMoveset([MoveId.TAILWIND, MoveId.SPLASH, MoveId.SUPER_FANG]);
    // Super Fang has an expected AS higher than 1 since it deals >40% damage
    expect(enemy).toPreferSelectingMove(MoveId.SUPER_FANG);
  });

  it("should have a large incentive to use in a double battle", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toPreferSelectingMove(MoveId.TAILWIND);

    game.override.enemyMoveset([MoveId.TAILWIND, MoveId.SPLASH, MoveId.SUPER_FANG]);
    expect(enemy).toPreferSelectingMove(MoveId.TAILWIND);
  });

  it("should be avoided when its effect is already active", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.TAILWIND);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.TAILWIND);
  });
});
