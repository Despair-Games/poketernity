import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllAbilities } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Drain Punch", () => {
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
      .enemySpecies(SpeciesId.MACHOP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.DRAIN_PUNCH, MoveId.SKY_UPPERCUT, MoveId.SPLASH])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over moves with slightly higher power when the user is damaged", async () => {
    await game.classicMode.startBattle(SpeciesId.SNORLAX);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp * 0.5);

    expect(enemy).toPreferSelectingMove(MoveId.DRAIN_PUNCH);
  });

  it("should not be preferred over higher-power moves when the user is healthy", async () => {
    await game.classicMode.startBattle(SpeciesId.SNORLAX);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp * 0.95);

    expect(enemy).not.toPreferSelectingMove(MoveId.DRAIN_PUNCH);
  });

  it("should not be preferred over higher-power moves when the user is afflicted with Heal Block", async () => {
    await game.classicMode.startBattle(SpeciesId.SNORLAX);

    game.move.use(MoveId.HEAL_BLOCK);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = 1;

    expect(enemy).not.toPreferSelectingMove(MoveId.DRAIN_PUNCH);
  });

  it("should be avoided when the target is known to have Liquid Ooze", async () => {
    game.override.ability(AbilityId.LIQUID_OOZE);

    await game.classicMode.startBattle(SpeciesId.SNORLAX);

    revealAllAbilities(game.scene);
    const enemy = game.field.getEnemyPokemon();
    enemy.hp = 1;
    expect(enemy).toNeverSelectMove(MoveId.DRAIN_PUNCH);
  });
});
