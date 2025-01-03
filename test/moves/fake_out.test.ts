import { GameManager } from "#test/testUtils/gameManager";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";

describe("Moves - Fake Out", () => {
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
      .enemySpecies(Species.CORVIKNIGHT)
      .moveset([Moves.FAKE_OUT, Moves.SPLASH])
      .enemyMoveset(Moves.SPLASH)
      .enemyLevel(10)
      .startingLevel(10) // prevent LevelUpPhase from happening
      .disableCrits();
  });

  it("can only be used on the first turn a pokemon is sent out in a battle", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.FAKE_OUT);
    await game.toNextTurn();

    expect(enemy.hp).toBeLessThan(enemy.getMaxHp());
    const postTurnOneHp = enemy.hp;

    game.move.select(Moves.FAKE_OUT);
    await game.toNextTurn();

    expect(enemy.hp).toBe(postTurnOneHp);
  }, 20000);

  // This is a game-specific buff to Fake Out
  it("can be used at the start of every wave even if the pokemon wasn't recalled", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.damageAndUpdate(enemy.getMaxHp() - 1);

    game.move.select(Moves.FAKE_OUT);
    await game.toNextWave();

    game.move.select(Moves.FAKE_OUT);
    await game.toNextTurn();

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBe(false);
  }, 20000);

  it("can be used again if recalled and sent back out", async () => {
    game.override.startingWave(4);
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    const enemy1 = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.FAKE_OUT);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy1.hp).toBeLessThan(enemy1.getMaxHp());

    await game.doKillOpponents();
    await game.toNextWave();

    game.move.select(Moves.FAKE_OUT);
    await game.toNextTurn();

    const enemy2 = game.scene.getEnemyPokemon()!;

    expect(enemy2.hp).toBeLessThan(enemy2.getMaxHp());
    enemy2.hp = enemy2.getMaxHp();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.move.select(Moves.FAKE_OUT);
    await game.toNextTurn();

    expect(enemy2.hp).toBeLessThan(enemy2.getMaxHp());
  }, 20000);

  it.each([
    { moveId: Moves.U_TURN, moveName: "U-turn" },
    { moveId: Moves.BATON_PASS, moveName: "Baton Pass" },
    { moveId: Moves.SHED_TAIL, moveName: "Shed Tail" },
    { moveId: Moves.MEMENTO, moveName: "a teammate fainting" },
  ])("can be used after the user is sent out via $moveName", async ({ moveId }) => {
    game.override.moveset([Moves.FAKE_OUT, moveId]);

    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    game.move.select(moveId);
    game.doSelectPartyPokemon(1);

    await game.toNextTurn();

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    expect(player.species.speciesId).toBe(Species.MAGIKARP);
    const enemyStartingHp = enemy.hp;

    game.move.select(Moves.FAKE_OUT);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.hp).toBeLessThan(enemyStartingHp);
    expect(enemy.getTag(BattlerTagType.FLINCHED)).toBeDefined();
    expect(player.turnData.acted).toBeTruthy();
    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.SUCCESS);
  });

  it("can be used after the user is sent out via Wimp Out", async () => {
    game.override.ability(Abilities.WIMP_OUT).enemyLevel(100).enemyMoveset(Moves.FALSE_SWIPE);

    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    game.move.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);

    await game.toNextTurn();

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    expect(player.species.speciesId).toBe(Species.MAGIKARP);

    game.move.select(Moves.FAKE_OUT);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.isFullHp()).toBeFalsy();
    expect(enemy.getTag(BattlerTagType.FLINCHED)).toBeDefined();
    expect(player.turnData.acted).toBeTruthy();
    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.SUCCESS);
  });
});
