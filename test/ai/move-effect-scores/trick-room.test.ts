import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Trick Room", async () => {
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
      .enemyMoveset([MoveId.TRICK_ROOM, MoveId.SPLASH, MoveId.TACKLE])
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the player outspeeds the enemy in a single battle", async () => {
    await game.classicMode.startBattle([SpeciesId.REGIELEKI]);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.TRICK_ROOM);
  });

  it("should be preferred when both player Pokemon outspeed the enemy in a double battle", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([SpeciesId.REGIELEKI, SpeciesId.ELECTRODE]);

    const [enemy] = game.scene.getEnemyField();

    expect(enemy).toPreferSelectingMove(MoveId.TRICK_ROOM);
  });

  it("should be avoided when the enemy outspeeds the player", async () => {
    await game.classicMode.startBattle([SpeciesId.SHUCKLE]);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.TRICK_ROOM);
  });

  it("should be avoided when its effect is already active", async () => {
    await game.classicMode.startBattle([SpeciesId.REGIELEKI]);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.TRICK_ROOM);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.TRICK_ROOM);
  });
});
