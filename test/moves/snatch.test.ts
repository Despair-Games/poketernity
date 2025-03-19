import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SWORDS_DANCE)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should steal the effects of the next used beneficial status move in the turn", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SNATCH);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(2);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should only steal the first snatchable move from another Pokemon", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

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
    await game.classicMode.startBattle([Species.FEEBAS]);

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

  it("should only activate for the first Pokemon to use Snatch", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

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

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

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
