import type { StockpilingTag } from "#app/data/battler-tags/stockpiling-tag";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Snatch", () => {
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
      .enemyMoveset(MoveId.SWORDS_DANCE)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should steal the effects of the next used beneficial status move in the turn", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SNATCH);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(2);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should only steal the first snatchable move from another Pokemon", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    game.move.use(MoveId.SNATCH, 0);
    game.move.use(MoveId.SPLASH, 1);

    await game.toNextTurn();

    expect(playerPokemon[0].getStatStage(Stat.ATK)).toBe(2);
    expect(enemyPokemon[0].getStatStage(Stat.ATK)).toBe(0);
    expect(enemyPokemon[1].getStatStage(Stat.ATK)).toBe(2);
  });

  it.each([
    { moveId: MoveId.REST, moveName: "Rest" },
    { moveId: MoveId.SWALLOW, moveName: "Swallow" },
  ])("should not steal $moveName when it has no effect on the original user", async ({ moveId }) => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SNATCH);
    await game.move.forceEnemyMove(moveId);
    await game.toEndOfTurn();

    expect(player.getStatusEffect()).toBe(StatusEffect.NONE);
    expect(enemy.getStatusEffect()).toBe(StatusEffect.NONE);
    expect(player.getMoveHistory()).not.toContain(
      expect.objectContaining({
        move: expect.objectContaining({ id: moveId }),
        virtual: true,
      }),
    );
  });

  it("should steal Rest if it would affect the original user", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.FALSE_SWIPE);
    await game.move.forceEnemyMove(MoveId.FALSE_SWIPE);
    await game.toNextTurn();

    game.move.use(MoveId.SNATCH);
    await game.move.forceEnemyMove(MoveId.REST);
    await game.toEndOfTurn();

    expect(player.isFullHp()).toBeTruthy();
    expect(player.getStatusEffect()).toBe(StatusEffect.SLEEP);
    expect(enemy.isFullHp()).toBeFalsy();
    expect(enemy.getStatusEffect()).toBe(StatusEffect.NONE);
  });

  it("should steal Swallow if the original user has Stockpiled, restoring 25% HP", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    player.hp = 1;
    enemy.hp = 1;

    vi.spyOn(player, "getMaxHp").mockReturnValue(100);

    for (let i = 0; i < 3; i++) {
      game.move.use(MoveId.SPLASH);
      await game.move.forceEnemyMove(MoveId.STOCKPILE);
      await game.toNextTurn();
    }

    game.move.use(MoveId.SNATCH);
    await game.move.forceEnemyMove(MoveId.SWALLOW);
    await game.toEndOfTurn();

    expect(player.hp).toBe(26);
    expect(enemy.hp).toBe(1);
    expect(enemy.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)?.stockpiledCount).toBe(3);
  });

  it("should only activate for the first Pokemon to use Snatch", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    game.setTurnOrder([BattlerIndex.ENEMY_2, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2, BattlerIndex.PLAYER]);
    game.move.use(MoveId.SNATCH, 0);
    game.move.use(MoveId.SNATCH, 1);
    await game.move.forceEnemyMove(MoveId.SWORDS_DANCE);
    await game.move.forceEnemyMove(MoveId.SNATCH);

    await game.toEndOfTurn();

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    // Only ENEMY_2 should have stolen ENEMY's Swords Dance
    playerPokemon.forEach((p) => expect(p.getStatStage(Stat.ATK)).toBe(0));
    expect(enemyPokemon[0].getStatStage(Stat.ATK)).toBe(0);
    expect(enemyPokemon[1].getStatStage(Stat.ATK)).toBe(2);
  });

  it("should not activate if its user is picked up by Sky Drop", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);
    game.move.use(MoveId.SNATCH, 0);
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SKY_DROP, BattlerIndex.PLAYER);
    await game.move.forceEnemyMove(MoveId.SWORDS_DANCE);

    await game.toEndOfTurn();

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    expect(playerPokemon[0].getStatStage(Stat.ATK)).toBe(0);
    expect(enemyPokemon[1].getStatStage(Stat.ATK)).toBe(2);
  });

  /** @todo Fix Pressure's interactions with indirect targeting and add this test */
  it.todo("should have 1 more PP reduced on use for each opponent with Pressure");
});
