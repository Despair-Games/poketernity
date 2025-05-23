import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

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
      .enemySpecies(SpeciesId.CORVIKNIGHT)
      .moveset([MoveId.FAKE_OUT, MoveId.SPLASH])
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(10)
      .startingLevel(10) // prevent LevelUpPhase from happening
      .disableCrits();
  });

  it("flinches the opponent on hit", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MAGIKARP);

    const [enemy1, enemy2] = game.scene.getEnemyField();

    game.move.select(MoveId.FAKE_OUT, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.FAKE_OUT, 1, BattlerIndex.ENEMY_2);
    await game.toNextTurn();

    expect(enemy1).toHaveMoveResult(MoveResult.FAIL);
    expect(enemy2).toHaveMoveResult(MoveResult.FAIL);
  });

  it("can only be used on the first turn a pokemon is sent out in a battle", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.FAKE_OUT);
    await game.toNextTurn();

    expect(enemy.hp).toBeLessThan(enemy.getMaxHp());
    const postTurnOneHp = enemy.hp;

    game.move.select(MoveId.FAKE_OUT);
    await game.toNextTurn();

    expect(enemy.hp).toBe(postTurnOneHp);
  });

  // This is a game-specific buff to Fake Out
  it("can be used at the start of every wave even if the pokemon wasn't recalled", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.damageAndUpdate(enemy.getMaxHp() - 1);

    game.move.select(MoveId.FAKE_OUT);
    await game.toNextWave();

    game.move.select(MoveId.FAKE_OUT);
    await game.toNextTurn();

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBe(false);
  });

  it("can be used again if recalled and sent back out", async () => {
    game.override.startingWave(4);
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MAGIKARP);

    const enemy1 = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.FAKE_OUT);
    await game.phaseInterceptor.to("PostActionPhase");

    expect(enemy1.hp).toBeLessThan(enemy1.getMaxHp());

    await game.faintOpponents();
    await game.toNextWave();

    game.move.select(MoveId.FAKE_OUT);
    await game.toNextTurn();

    const enemy2 = game.scene.getEnemyPokemon()!;

    expect(enemy2.hp).toBeLessThan(enemy2.getMaxHp());
    enemy2.hp = enemy2.getMaxHp();

    game.switchPokemon(1);
    await game.toNextTurn();

    game.switchPokemon(1);
    await game.toNextTurn();

    game.move.select(MoveId.FAKE_OUT);
    await game.toNextTurn();

    expect(enemy2.hp).toBeLessThan(enemy2.getMaxHp());
  });

  it.each([
    { moveId: MoveId.U_TURN, moveName: "U-turn" },
    { moveId: MoveId.BATON_PASS, moveName: "Baton Pass" },
    { moveId: MoveId.SHED_TAIL, moveName: "Shed Tail" },
    { moveId: MoveId.MEMENTO, moveName: "a teammate fainting" },
  ])("can be used after the user is sent out via $moveName", async ({ moveId }) => {
    game.override.moveset([MoveId.FAKE_OUT, moveId]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MAGIKARP);

    game.move.select(moveId);
    game.selectPartyPokemon(1);

    await game.toNextTurn();

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    expect(player.species.speciesId).toBe(SpeciesId.MAGIKARP);
    const enemyStartingHp = enemy.hp;

    game.move.select(MoveId.FAKE_OUT);

    await game.phaseInterceptor.to("PostActionPhase");
    expect(enemy.hp).toBeLessThan(enemyStartingHp);
    expect(enemy.getTag(BattlerTagType.FLINCHED)).toBeDefined();
    expect(player.turnData.acted).toBeTruthy();
    expect(player).toHaveMoveResult(MoveResult.SUCCESS);
  });

  it("can be used after the user is sent out via Wimp Out", async () => {
    game.override.ability(AbilityId.WIMP_OUT).enemyLevel(100).enemyMoveset(MoveId.FALSE_SWIPE);

    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MAGIKARP);

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);

    await game.toNextTurn();

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    expect(player.species.speciesId).toBe(SpeciesId.MAGIKARP);

    game.move.select(MoveId.FAKE_OUT);

    await game.phaseInterceptor.to("PostActionPhase");
    expect(enemy.isFullHp()).toBeFalsy();
    expect(enemy.getTag(BattlerTagType.FLINCHED)).toBeDefined();
    expect(player.turnData.acted).toBeTruthy();
    expect(player).toHaveMoveResult(MoveResult.SUCCESS);
  });
});
