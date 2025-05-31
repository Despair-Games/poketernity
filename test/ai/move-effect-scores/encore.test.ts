import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Encore", () => {
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
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.ENCORE, MoveId.SWIFT, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred if the target hasn't used a move", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.ENCORE);
  });

  it("should be preferred if the target last used a status move and the user outspeeds the target", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    player.setStat(Stat.SPD, 50);
    const enemy = game.field.getEnemyPokemon();
    enemy.setStat(Stat.SPD, 100);

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).toPreferSelectingMove(MoveId.ENCORE);
  });

  it("should not be preferred if the target last used an attack", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    player.setStat(Stat.SPD, 50);
    const enemy = game.field.getEnemyPokemon();
    enemy.setStat(Stat.SPD, 100);

    game.move.use(MoveId.TACKLE);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).not.toPreferSelectingMove(MoveId.ENCORE);
  });

  it("should be avoided if the target is already affected by Encore", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.ENCORE, BattlerIndex.PLAYER);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.ENCORE);
  });
});
