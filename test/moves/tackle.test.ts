import { Stat } from "#enums/stat";
import { EnemyCommandPhase } from "#app/phases/enemy-command-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Tackle", () => {
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
    const moveToUse = Moves.TACKLE;
    game.overridesHelper.battleType("single");
    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.startingLevel(1);
    game.overridesHelper.startingWave(97);
    game.overridesHelper.moveset([moveToUse]);
    game.overridesHelper.enemyMoveset([Moves.GROWTH, Moves.GROWTH, Moves.GROWTH, Moves.GROWTH]);
    game.overridesHelper.disableCrits();
  });

  it("TACKLE against ghost", async () => {
    const moveToUse = Moves.TACKLE;
    game.overridesHelper.enemySpecies(Species.GENGAR);
    await game.startBattle([Species.MIGHTYENA]);
    const hpOpponent = game.scene.currentBattle.enemyParty[0].hp;
    game.moveHelper.select(moveToUse);
    await game.phaseInterceptor.runFrom(EnemyCommandPhase).to(TurnEndPhase);
    const hpLost = hpOpponent - game.scene.currentBattle.enemyParty[0].hp;
    expect(hpLost).toBe(0);
  }, 20000);

  it("TACKLE against not resistant", async () => {
    const moveToUse = Moves.TACKLE;
    await game.startBattle([Species.MIGHTYENA]);
    game.scene.currentBattle.enemyParty[0].stats[Stat.DEF] = 50;
    game.scene.getPlayerParty()[0].stats[Stat.ATK] = 50;

    const hpOpponent = game.scene.currentBattle.enemyParty[0].hp;

    game.moveHelper.select(moveToUse);
    await game.phaseInterceptor.runFrom(EnemyCommandPhase).to(TurnEndPhase);
    const hpLost = hpOpponent - game.scene.currentBattle.enemyParty[0].hp;
    expect(hpLost).toBeGreaterThan(0);
    expect(hpLost).toBeLessThan(4);
  }, 20000);
});
