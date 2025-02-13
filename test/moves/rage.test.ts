import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect } from "vitest";
import { Stat } from "#enums/stat";
import { BattlerTagType } from "#enums/battler-tag-type";

describe("Moves - Rage", () => {
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
      .battleType("double")
      .startingLevel(100)
      .moveset([MoveId.RAGE, MoveId.SPLASH])
      .enemySpecies(Species.BLISSEY)
      .enemyLevel(100)
      .enemyAbility(Abilities.NO_GUARD)
      .enemyMoveset([MoveId.SHADOW_PUNCH, MoveId.RAGE, MoveId.TRIPLE_AXEL, MoveId.TACKLE]);
  });

  it("Rage should increase the user's attack by 1 for each time they are hit", async () => {
    await game.classicMode.startBattle([Species.BLISSEY]);
    const playerPokemon = game.field.getPlayerPokemon();

    game.move.select(MoveId.RAGE, 0, BattlerIndex.ENEMY);
    await game.move.forceEnemyMove(MoveId.TRIPLE_AXEL); // Should give +3
    await game.move.forceEnemyMove(MoveId.TACKLE); // Should give +1

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toNextTurn();

    expect(playerPokemon.getTag(BattlerTagType.RAGE)).toBeDefined();
    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(4);

    game.move.select(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.TRIPLE_AXEL); // Should give +0
    await game.move.forceEnemyMove(MoveId.TACKLE); // Should give +0

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toNextTurn();

    expect(playerPokemon.getTag(BattlerTagType.RAGE)).toBeUndefined();
    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(4);

    game.move.select(MoveId.RAGE, 0, BattlerIndex.ENEMY);
    await game.move.forceEnemyMove(MoveId.SHADOW_PUNCH); // Should give +0
    await game.move.forceEnemyMove(MoveId.TACKLE); // Should give +1

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toNextTurn();

    expect(playerPokemon.getTag(BattlerTagType.RAGE)).toBeDefined();
    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(5);
  });
});
