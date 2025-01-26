import { BattlerIndex } from "#enums/battler-index";
import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { EFFECTIVE_STATS, Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Unaware", () => {
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
      .ability(Abilities.UNAWARE)
      .battleType("single")
      .startingLevel(100)
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it("should ignore the opponent's stat stages, except for speed", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.SHELL_SMASH);
    await game.toNextTurn();

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();
    for (const stat of EFFECTIVE_STATS) {
      let expectedStat = enemyPokemon.getStat(stat);
      if (stat === Stat.SPD) {
        expectedStat = expectedStat * 2; // Should not ignore stat stages in Speed
      }

      const actualStat = enemyPokemon.getEffectiveStat(stat, playerPokemon);
      expect(actualStat).toBe(expectedStat);
    }
  });

  it("should not ignore the user's stat stages", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(Moves.SHELL_SMASH);
    await game.move.forceEnemyMove(Moves.SPLASH);
    await game.toNextTurn();

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();
    for (const stat of EFFECTIVE_STATS) {
      let expectedStat = playerPokemon.getStat(stat);
      if ([Stat.ATK, Stat.SPATK, Stat.SPD].includes(stat)) {
        expectedStat = expectedStat * 2;
      } else if ([Stat.DEF, Stat.SPDEF].includes(stat)) {
        expectedStat = Math.floor(expectedStat * (2 / 3));
      }

      const actualStat = playerPokemon.getEffectiveStat(stat, enemyPokemon);
      expect(actualStat).toBe(expectedStat);
    }
  });

  it("should not cause the opponent's Stored Power to ignore the opponent's stat stages", async () => {
    const storedPowerMove = allMoves[Moves.STORED_POWER];
    vi.spyOn(storedPowerMove, "calculateBattlePower");

    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.SHELL_SMASH);
    await game.toNextTurn();
    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.STORED_POWER);
    await game.toNextTurn();

    expect(storedPowerMove.calculateBattlePower).toHaveLastReturnedWith(140);
  });

  it("should not cause the move Punishment to ignore the opponent's stat stages", async () => {
    const punishmentMove = allMoves[Moves.PUNISHMENT];
    vi.spyOn(punishmentMove, "calculateBattlePower");

    game.override.startingLevel(5).enemyLevel(100);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.SHELL_SMASH);
    await game.toNextTurn();
    game.move.use(Moves.PUNISHMENT);
    await game.move.forceEnemyMove(Moves.SPLASH);
    await game.toNextTurn();

    expect(punishmentMove.calculateBattlePower).toHaveLastReturnedWith(180);
  });

  /**
   * Body Press currently ignores all Abilities in its stat calculation.
   * @todo fix this interaction to pass this test.
   */
  it.todo("should cause the opponent's Body Press to ignore the opponent's Defense stages", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "getEffectiveStat");
    const expectedDef = enemyPokemon.getStat(Stat.DEF);

    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.IRON_DEFENSE);
    await game.toNextTurn();
    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.BODY_PRESS);
    await game.toNextTurn();

    expect(enemyPokemon.getEffectiveStat).toHaveLastReturnedWith(expectedDef);
  });

  it("should not cause self-inflicted confusion to ignore stat stages", async () => {
    game.override.statusActivation(true).startingLevel(1000).enemyLevel(1000);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    vi.spyOn(playerPokemon, "getEffectiveStat");
    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "getEffectiveStat");
    const expectedPlayerAtk = Math.floor(playerPokemon.getStat(Stat.ATK) * (3 / 2));
    const expectedEnemyAtk = Math.floor(enemyPokemon.getStat(Stat.ATK) * (3 / 2));
    const expectedPlayerDef = Math.floor(playerPokemon.getStat(Stat.DEF) * (3 / 2));
    const expectedEnemyDef = Math.floor(enemyPokemon.getStat(Stat.DEF) * (3 / 2));

    game.move.use(Moves.VICTORY_DANCE);
    await game.move.forceEnemyMove(Moves.VICTORY_DANCE);
    await game.toNextTurn();

    playerPokemon.addTag(BattlerTagType.CONFUSED);
    enemyPokemon.addTag(BattlerTagType.CONFUSED);

    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.SPLASH);
    await game.toNextTurn();

    expect(playerPokemon.isFullHp()).toBe(false);
    expect(enemyPokemon.isFullHp()).toBe(false);

    // Check that each Pokemon's most recently computed stat is either their boosted Atk or their boosted Def
    expect(playerPokemon.getEffectiveStat).toHaveLastReturnedWith(
      expect.toBeOneOf([expectedPlayerAtk, expectedPlayerDef]),
    );
    expect(enemyPokemon.getEffectiveStat).toHaveLastReturnedWith(
      expect.toBeOneOf([expectedEnemyAtk, expectedEnemyDef]),
    );
  });

  it("should not ignore an opponent's physical damage reduction from a Burn status", async () => {
    // TODO: Is there a more direct way to test for Burn damage reduction?
    vi.spyOn(allMoves[Moves.WILL_O_WISP], "accuracy", "get").mockReturnValue(-1);
    game.override.startingLevel(1000).enemyLevel(1000);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    const hpAmounts = [playerPokemon.hp];

    game.move.use(Moves.WILL_O_WISP);
    await game.move.forceEnemyMove(Moves.TACKLE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    hpAmounts.push(playerPokemon.hp);

    game.move.use(Moves.WILL_O_WISP);
    await game.move.forceEnemyMove(Moves.TACKLE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    hpAmounts.push(playerPokemon.hp);

    const damage1 = hpAmounts[0] - hpAmounts[1];
    const damage2 = hpAmounts[1] - hpAmounts[2];

    expect(damage2).toBeLessThan(damage1);
  });
});
