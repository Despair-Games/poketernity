import { Abilities } from "#enums/abilities";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Good As Gold", () => {
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
      .moveset([MoveId.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.GOOD_AS_GOLD)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should negate the effects of status moves against the source", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should not negate non-status moves", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.TACKLE);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(enemy.isFullHp()).toBeFalsy();
  });

  it("should not negate the source's own status moves", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SWORDS_DANCE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemy.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(enemy.getStatStage(Stat.ATK)).toBe(2);
  });

  it("should not negate moves targeting the source's side of the field", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.STEALTH_ROCK);

    await game.phaseInterceptor.to("BerryPhase", false);
    expect(player.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.STEALTH_ROCK, ArenaTagSide.ENEMY)).toBeDefined();
  });

  it("should not negate moves that target all Pokemon", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.HAZE);
    await game.move.forceEnemyMove(MoveId.SWORDS_DANCE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });
});
