import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
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

  /*
   * Tests the following sequence in a wild double battle:
   * - All Pokemon on the field faint in the same turn. The Player has a third Pokemon in their party
   * - The Player revives one of their Pokemon in the following rewards phase (i.e. the Player now has 2 non-fainted Pokemon)
   * - The Player advances to another wild double battle in the next wave. The Player should automatically resummon the revived Pokemon
   */
  it("3v2 edge case: player summons 2 pokemon on the next battle after being fainted and revived", async () => {
    await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARIZARD, SpeciesId.SQUIRTLE);

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
  });

  it("randomly chooses between single and double battles if there is no battle type override", async () => {
    game.override
      .battleType(null)
      .startingWave(11)
      .trainerChance(0)
      .mysteryEncounterChance(0)
      .enemyMoveset(MoveId.MEMENTO);

    await game.classicMode.startBattle(SpeciesId.BULBASAUR);

    let doubleCount = 0;
    let singleCount = 0;

    // Play through waves 11 to 19, counting number of double battles from waves 12 to 19
    await game.rng.equalSample(DOUBLE_CHANCE, async () => {
      game.move.use(MoveId.HAZE);
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

  it("should transition to and from double battles without crashing", async () => {
    game.override.battleType("even-doubles");
    await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARMANDER);

    // Run 2 single -> double transitions and 2 double -> single transitions
    for (let waveNumber = 1; waveNumber < 5; waveNumber++) {
      const isDouble = waveNumber % 2 === 0;
      expect(game.scene.currentBattle.double).toBe(isDouble);
      expect(game.scene.currentBattle.waveIndex).toBe(waveNumber);

      game.move.select(MoveId.SPLASH);
      if (isDouble) {
        game.move.select(MoveId.SPLASH, 1);
      }
      await game.faintOpponents();
      await game.toNextWave();

      expect(game.scene.currentBattle.double).toBe(!isDouble);
    }
  });

  it("shouldn't hit itself if ally dies before move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MILOTIC);

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
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      game.move.use(MoveId.DAZZLING_GLEAM);
      await game.toNextWave();

      expect(game.scene.currentBattle.waveIndex).toBe(13);
      expect(game.phaseInterceptor.log.filter((phase) => phase === "SelectModifierPhase").length).toBe(1);
      expect(game.scene.phaseManager.hasPhaseOfType("SelectModifierPhase")).toBe(false);
    });

    it("should advance exactly one wave if the left opponent is defeated first", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MILOTIC);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      game.move.use(MoveId.MOONBLAST, 0, BattlerIndex.ENEMY);
      game.move.use(MoveId.MOONBLAST, 1, BattlerIndex.ENEMY_2);
      await game.toNextWave();

      expect(game.scene.currentBattle.waveIndex).toBe(13);
      expect(game.phaseInterceptor.log.filter((phase) => phase === "SelectModifierPhase").length).toBe(1);
      expect(game.scene.phaseManager.hasPhaseOfType("SelectModifierPhase")).toBe(false);
    });

    it("should advance exactly one wave if the right opponent is defeated first", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MILOTIC);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      game.move.use(MoveId.MOONBLAST, 0, BattlerIndex.ENEMY_2);
      game.move.use(MoveId.MOONBLAST, 1, BattlerIndex.ENEMY);
      await game.toNextWave();

      expect(game.scene.currentBattle.waveIndex).toBe(13);
      expect(game.phaseInterceptor.log.filter((phase) => phase === "SelectModifierPhase").length).toBe(1);
      expect(game.scene.phaseManager.hasPhaseOfType("SelectModifierPhase")).toBe(false);
    });
  });
});
