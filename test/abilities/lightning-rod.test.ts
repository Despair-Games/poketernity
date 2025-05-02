import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Lightning Rod", () => {
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
      .battleType("double")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should redirect single-target moves", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyField();

    game.field.mockAbility(enemyPokemon[0], AbilityId.LIGHTNING_ROD);

    game.move.use(MoveId.THUNDER_SHOCK, 0, BattlerIndex.ENEMY_2);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeTruthy());
    expect(enemyPokemon[0].getStatStage(Stat.SPATK)).toBe(1);
  });

  it("should redirect moves from the source's ally, but not from the source", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.field.mockAbility(playerPokemon[0], AbilityId.LIGHTNING_ROD);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    game.move.use(MoveId.THUNDER_SHOCK, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.THUNDER_SHOCK, 1, BattlerIndex.ENEMY_2);
    await game.toEndOfTurn();

    /**
     * Player 1's attack should have successfully hit Enemy 1, while
     * Player 2's attack should be absorbed by Player 1's Lightning Rod,
     * increasing Player 1's Sp. Atk by 1 stage.
     */
    expect(enemyPokemon[0].isFullHp()).toBeFalsy();
    expect(enemyPokemon[1].isFullHp()).toBeTruthy();
    expect(playerPokemon[0].getStatStage(Stat.SPATK)).toBe(1);
  });

  it("should not redirect multi-target moves", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyField();

    game.field.mockAbility(enemyPokemon[0], AbilityId.LIGHTNING_ROD);

    game.move.use(MoveId.DISCHARGE, 0);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(enemyPokemon[0].isFullHp()).toBeTruthy();
    expect(enemyPokemon[1].isFullHp()).toBeFalsy();
    expect(enemyPokemon[0].getStatStage(Stat.SPATK)).toBe(1);
  });

  it("should not redirect moves boosted by Normalize", async () => {
    game.override.ability(AbilityId.NORMALIZE);

    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyField();

    game.field.mockAbility(enemyPokemon[0], AbilityId.LIGHTNING_ROD);

    game.move.use(MoveId.THUNDER_SHOCK, 0, BattlerIndex.ENEMY_2);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(enemyPokemon[1].isFullHp()).toBeFalsy();
    expect(enemyPokemon[0].getStatStage(Stat.SPATK)).toBe(0);
  });
});
