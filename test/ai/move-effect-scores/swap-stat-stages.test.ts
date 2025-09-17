import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { BATTLE_STATS, type BattleStat, Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Swap Stat Stages", () => {
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
      .startingLevel(100)
      .enemyLevel(100);
  });

  type StatStub = {
    statName: string;
    stat: BattleStat;
  };
  const statStubs: StatStub[] = [
    { statName: "Attack", stat: Stat.ATK },
    { statName: "Defense", stat: Stat.DEF },
    { statName: "Sp. Atk", stat: Stat.SPATK },
    { statName: "Sp. Def", stat: Stat.SPDEF },
    { statName: "Speed", stat: Stat.SPD },
    { statName: "Accuracy", stat: Stat.ACC },
    { statName: "Evasiveness", stat: Stat.EVA },
  ];

  type TestCase = {
    moveName: string;
    moveId: MoveId;
    positives: BattleStat[];
  };
  const testCases: TestCase[] = [
    { moveName: "Guard Swap", moveId: MoveId.GUARD_SWAP, positives: [Stat.DEF, Stat.SPDEF] },
    { moveName: "Power Swap", moveId: MoveId.POWER_SWAP, positives: [Stat.ATK, Stat.SPATK] },
    { moveName: "Heart Swap", moveId: MoveId.HEART_SWAP, positives: [...BATTLE_STATS] },
  ];

  describe.each(testCases)("$moveName", ({ moveId, positives }) => {
    const relevantStats = statStubs.filter(({ stat }) => positives.includes(stat));
    const irrelevantStats = statStubs.filter(({ stat }) => !positives.includes(stat));

    beforeEach(async () => {
      game.override.enemyMoveset([moveId, MoveId.SPLASH, MoveId.TACKLE]);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    });

    it("should be avoided when no stat stage changes are present on the field", async () => {
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(moveId);
    });

    it.each(irrelevantStats)("should be avoided when the opponent has increased $statName", async ({ stat }) => {
      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      player.setStatStage(stat, 2);

      expect(enemy).toNeverSelectMove(moveId);
    });

    it.each(relevantStats)("should be preferred when the opponent has increased $statName", async ({ stat }) => {
      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      player.setStatStage(stat, 2);

      expect(enemy).toPreferSelectingMove(moveId);
    });

    it.each(relevantStats)(
      "should be avoided when the user has more $statName stages than the opponent",
      async ({ stat }) => {
        const player = game.field.getPlayerPokemon();
        const enemy = game.field.getEnemyPokemon();
        player.setStatStage(stat, 2);
        enemy.setStatStage(stat, 3);

        expect(enemy).toNeverSelectMove(moveId);
      },
    );
  });
});
