import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { type PermanentStat, Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Average Stats", () => {
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

  type TestCase = {
    moveName: string;
    moveId: MoveId;
    stats: {
      statName: string;
      stat: PermanentStat;
    }[];
  };
  const testCases: TestCase[] = [
    {
      moveName: "Guard Split",
      moveId: MoveId.GUARD_SPLIT,
      stats: [
        { statName: "Defense", stat: Stat.DEF },
        { statName: "Sp. Def", stat: Stat.SPDEF },
      ],
    },
    {
      moveName: "Power Split",
      moveId: MoveId.POWER_SPLIT,
      stats: [
        { statName: "Attack", stat: Stat.ATK },
        { statName: "Sp. Atk", stat: Stat.SPATK },
      ],
    },
  ];

  describe.each(testCases)("$moveName", ({ moveId, stats }) => {
    beforeEach(async () => {
      game.override.enemyMoveset([moveId, MoveId.SPLASH]);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    });

    const initStats = (pokemon: Pokemon[]) => {
      pokemon.forEach((p) => stats.forEach(({ stat }) => p.setStat(stat, 50)));
    };

    it("should be avoided when the user and target have equal stats", async () => {
      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      initStats([player, enemy]);

      expect(enemy).toNeverSelectMove(moveId);
    });

    it.each(stats)(
      "should be preferred when the target has significantly higher $statName than the user",
      async ({ stat }) => {
        const player = game.field.getPlayerPokemon();
        const enemy = game.field.getEnemyPokemon();
        initStats([player, enemy]);
        player.setStat(stat, 150);

        expect(enemy).toPreferSelectingMove(moveId);
      },
    );

    it.each(stats)(
      "should be avoided when the target has slightly higher $statName than the user",
      async ({ stat }) => {
        const player = game.field.getPlayerPokemon();
        const enemy = game.field.getEnemyPokemon();
        initStats([player, enemy]);
        player.setStat(stat, 75);

        expect(enemy).toNeverSelectMove(moveId);
      },
    );
  });
});
