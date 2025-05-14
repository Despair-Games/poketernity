import { getGameMode } from "#app/game-mode";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { GameModes } from "#enums/game-modes";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Double Battles", () => {
  const DOUBLE_CHANCE = 8; // Normal chance of double battle is 1/8

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
      .moveset(MoveId.SPLASH)
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(SpeciesId.MAGIKARP)
      .ability(AbilityId.BALL_FETCH)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  /**
   * Tests the following sequence in a wild double battle:
   * - All Pokemon on the field faint in the same turn. The Player has a third Pokemon in their party
   * - The Player revives one of their Pokemon in the following rewards phase (i.e. the Player now has 2 non-fainted Pokemon)
   * - The Player advances to another wild double battle in the next wave. The Player should automatically resummon the revived Pokemon
   * @todo This test is currently disabled because of stability issues with {@linkcode gameManager.faintOpponents} in double battles
   */
  it.skip("3v2 edge case: player summons 2 pokemon on the next battle after being fainted and revived", async () => {
    await game.classicMode.startBattle([SpeciesId.BULBASAUR, SpeciesId.CHARIZARD, SpeciesId.SQUIRTLE]);

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH, 1);

    for (const pokemon of game.scene.getPlayerField()) {
      pokemon.faint();
      expect(pokemon.isFainted()).toBe(true);
    }

    await game.faintOpponents();

    await game.phaseInterceptor.to("BattleEndPhase");
    game.doSelectModifier();

    const charizard = game.scene.getPlayerParty().findIndex((p) => p.species.speciesId === SpeciesId.CHARIZARD);
    game.revivePokemon(charizard);

    await game.phaseInterceptor.to("TurnInitPhase");
    expect(game.scene.getPlayerField().filter((p) => !p.isFainted())).toHaveLength(2);
  }, 20000);

  /** @todo This test is currently disabled because of stability issues with {@linkcode gameManager.faintOpponents} in double battles */
  it.skip("randomly chooses between single and double battles if there is no battle type override", async () => {
    game.override.battleType(null);

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);
    game.scene.gameMode = getGameMode(GameModes.ENDLESS);

    let doubleCount = 0;
    let singleCount = 0;

    // Play through endless, waves 1 to 9, counting number of double battles from waves 2 to 9
    await game.rng.equalSample(DOUBLE_CHANCE, async () => {
      game.move.select(MoveId.SPLASH);
      await game.faintOpponents();
      await game.toNextWave();

      if (game.scene.getEnemyParty().length === 1) {
        singleCount++;
      } else if (game.scene.getEnemyParty().length === 2) {
        doubleCount++;
      }
    });

    expect(doubleCount).toBe(1);
    expect(singleCount).toBe(DOUBLE_CHANCE - 1);
  });

  it("shouldn't hit itself if ally dies before move", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    const [, milotic] = game.scene.getPlayerField();

    game.move.select(MoveId.MEMENTO, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SURF, 1);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER_2]);
    await game.toNextTurn();

    expect(milotic.isFullHp()).toBe(true);
  });

  describe("Trainer Double Battles", () => {
    beforeEach(() => {
      game.override.trainerType(TrainerType.TWINS).trainerChance(1).startingLevel(1000).startingWave(12);
    });

    it("should advance exactly one wave if both opponents are defeated at the same time", async () => {
      await game.classicMode.startBattle([SpeciesId.FEEBAS]);

      game.move.use(MoveId.DAZZLING_GLEAM);
      await game.toNextWave();

      expect(game.scene.currentBattle.waveIndex).toBe(13);
      expect(game.phaseInterceptor.log.filter((phase) => phase === "SelectModifierPhase").length).toBe(1);
      expect(game.scene.phaseManager.hasPhase((phase) => phase.is(PhaseId.SELECT_MODIFIER), true)).toBe(false);
    });

    it("should advance exactly one wave if the left opponent is defeated first", async () => {
      await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      game.move.use(MoveId.MOONBLAST, 0, BattlerIndex.ENEMY);
      game.move.use(MoveId.MOONBLAST, 1, BattlerIndex.ENEMY_2);
      await game.toNextWave();

      expect(game.scene.currentBattle.waveIndex).toBe(13);
      expect(game.phaseInterceptor.log.filter((phase) => phase === "SelectModifierPhase").length).toBe(1);
      expect(game.scene.phaseManager.hasPhase((phase) => phase.is(PhaseId.SELECT_MODIFIER), true)).toBe(false);
    });

    it("should advance exactly one wave if the right opponent is defeated first", async () => {
      await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      game.move.use(MoveId.MOONBLAST, 0, BattlerIndex.ENEMY_2);
      game.move.use(MoveId.MOONBLAST, 1, BattlerIndex.ENEMY);
      await game.toNextWave();

      expect(game.scene.currentBattle.waveIndex).toBe(13);
      expect(game.phaseInterceptor.log.filter((phase) => phase === "SelectModifierPhase").length).toBe(1);
      expect(game.scene.phaseManager.hasPhase((phase) => phase.is(PhaseId.SELECT_MODIFIER), true)).toBe(false);
    });
  });
});
