import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Uproar", () => {
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
      .enemySpecies(Species.BLISSEY)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should lock the user into using Uproar for the following 2 turns", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.UPROAR);
    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.UPROAR)?.turnCount).toBe(2);
    expect(player.getMoveQueue()[0]).toMatchObject({
      move: expect.objectContaining({ id: MoveId.UPROAR }),
      ignorePP: true,
    });

    const playerUproar = player.getMoveset().find((mv) => mv.moveId === MoveId.UPROAR);
    expect(playerUproar?.ppUsed).toBe(1);

    await game.toNextTurn();
    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.UPROAR)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
    expect(playerUproar?.ppUsed).toBe(1);
  });

  it("should stop execution after using Uproar has no effect", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.UPROAR);
    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.UPROAR)?.turnCount).toBe(2);
    expect(player.getMoveQueue()[0]).toMatchObject({
      move: expect.objectContaining({ id: MoveId.UPROAR }),
      ignorePP: true,
    });

    game.override.enemyAbility(Abilities.SOUNDPROOF);

    await game.toNextTurn();
    expect(player.getTag(BattlerTagType.UPROAR)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
  });

  it("should wake up all active Pokemon on its initial use", async () => {
    game.override.enemyStatusEffect(StatusEffect.SLEEP).battleType("double");

    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.use(MoveId.UPROAR, 0);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("MoveEndPhase");
    enemyPokemon.forEach((p) => expect(p.getStatusEffect()).toBe(StatusEffect.NONE));
  });

  it("should prevent active Pokemon from falling asleep during its execution", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.use(MoveId.UPROAR, 0);
    game.move.use(MoveId.SPORE, 1, BattlerIndex.ENEMY_2);
    await game.move.forceEnemyMove(MoveId.REST);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("BerryPhase", false);
    enemyPokemon.forEach((p) => expect(p.getStatusEffect()).toBe(StatusEffect.NONE));
  });

  it("should not have its execution interrupted by Torment", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.UPROAR);
    await game.move.forceEnemyMove(MoveId.TORMENT);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.UPROAR)?.turnCount).toBe(2);
    expect(player.getMoveQueue()[0]).toMatchObject({
      move: expect.objectContaining({ id: MoveId.UPROAR }),
      ignorePP: true,
    });

    await game.toNextTurn();
    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.UPROAR)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
    expect(player.getMoveHistory()).toHaveLength(3);
    player.getMoveHistory().forEach((turnMove) =>
      expect(turnMove).toMatchObject({
        move: expect.objectContaining({ id: MoveId.UPROAR }),
        result: MoveResult.SUCCESS,
      }),
    );
  });
});
