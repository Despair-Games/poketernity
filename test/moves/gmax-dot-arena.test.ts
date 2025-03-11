import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect } from "vitest";
import { toDmgValue } from "#app/utils";

describe("Moves - G-Max damage over time arena moves", () => {
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
      .startingLevel(1)
      .moveset([MoveId.G_MAX_WILDFIRE, MoveId.G_MAX_VOLCALITH, MoveId.SPLASH])
      .enemySpecies(Species.SHUCKLE)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("G-Max wildfire should do 1/6th hp damage to non fire types", async () => {
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(MoveId.G_MAX_WILDFIRE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    const enemyStartingHp = enemyParty.map((p) => p.hp);
    await game.toNextTurn();
    const enemyEndingHp = enemyParty.map((p) => p.hp);
    enemyParty.forEach((pokemon, index) => {
      const damage = enemyStartingHp[index] - enemyEndingHp[index];
      expect(damage).toBe(toDmgValue(pokemon.getMaxHp() / 6));
    });
  });

  it("G-Max Volcalith should not damage rock types", async () => {
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(MoveId.G_MAX_VOLCALITH, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    const enemyStartingHp = enemyParty.map((p) => p.hp);
    await game.toNextTurn();
    const enemyEndingHp = enemyParty.map((p) => p.hp);
    enemyParty.forEach((_pokemon, index) => {
      const damage = enemyStartingHp[index] - enemyEndingHp[index];
      expect(damage).toBe(0);
    });
  });

  it("G-Max moves should not damage magic guard", async () => {
    game.override.enemyAbility(Abilities.MAGIC_GUARD);
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(MoveId.G_MAX_WILDFIRE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    const enemyStartingHp = enemyParty.map((p) => p.hp);
    await game.toNextTurn();
    const enemyEndingHp = enemyParty.map((p) => p.hp);
    enemyParty.forEach((_pokemon, index) => {
      const damage = enemyStartingHp[index] - enemyEndingHp[index];
      expect(damage).toBe(0);
    });
  });
});
